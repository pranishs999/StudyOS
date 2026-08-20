import { Router, Request, Response } from 'express';
import { chunkDocument } from './chunker';
import { generateEmbeddings, generateQueryEmbedding, EMBEDDING_MODEL } from './embeddings';
import { vectorDb, VectorRecord } from './vectorDb';

export const vectorRouter = Router();

const MAX_ITEMS_PER_REQUEST = 50;
const MAX_ITEM_CONTENT_LENGTH = 100_000;
const MAX_QUERY_LENGTH = 2_000;
const MAX_ACTIVE_IDS = 10_000;

interface IndexItemPayload {
  id: string;
  type: 'topic' | 'note' | 'question' | 'resource';
  title: string;
  content: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  version?: number;
}

function sendInternalError(res: Response, message: string, err: unknown): void {
  console.error(`[VectorAPI] ${message}`, err);
  res.status(500).json({ error: message });
}

function requireUserId(value: unknown, res: Response): string | null {
  if (typeof value !== 'string' || !value.trim() || value.length > 256) {
    res.status(400).json({ error: 'A valid userId is required.' });
    return null;
  }
  return value.trim();
}

function normalizeLimit(value: unknown, fallback = 8): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(50, Math.max(1, Math.floor(parsed)));
}

function normalizeSimilarity(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
}

function validSourceType(value: unknown): value is IndexItemPayload['type'] {
  return value === undefined || value === 'topic' || value === 'note' || value === 'question' || value === 'resource';
}

/**
 * POST /api/vector/index-items
 * Splits content into chunks, generates embeddings, and stores them in the vector database.
 *
 * TODO(security): replace client-supplied userId with a verified server-side identity when
 * real authentication is introduced. Input validation is intentionally strict meanwhile.
 */
vectorRouter.post('/index-items', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, userId } = req.body as { items?: unknown; userId?: unknown };
    const normalizedUserId = requireUserId(userId, res);
    if (!normalizedUserId) return;

    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'items must be an array.' });
      return;
    }
    if (items.length > MAX_ITEMS_PER_REQUEST) {
      res.status(413).json({ error: `A maximum of ${MAX_ITEMS_PER_REQUEST} items can be indexed per request.` });
      return;
    }
    if (items.length === 0) {
      res.json({ indexedCount: 0, vectorCount: 0, message: 'No items provided to index.' });
      return;
    }

    const validItems: IndexItemPayload[] = [];
    for (const rawItem of items) {
      const item = rawItem as Partial<IndexItemPayload>;
      if (
        !item ||
        typeof item.id !== 'string' || !item.id.trim() || item.id.length > 256 ||
        !validSourceType(item.type) || item.type === undefined ||
        typeof item.title !== 'string' || item.title.length > 2_000 ||
        typeof item.content !== 'string' || item.content.length > MAX_ITEM_CONTENT_LENGTH
      ) {
        res.status(400).json({ error: 'One or more index items are invalid.' });
        return;
      }
      validItems.push({
        id: item.id.trim(),
        type: item.type,
        title: item.title.trim(),
        content: item.content,
        subjectId: typeof item.subjectId === 'string' ? item.subjectId.slice(0, 256) : undefined,
        subjectCode: typeof item.subjectCode === 'string' ? item.subjectCode.slice(0, 128) : undefined,
        subjectName: typeof item.subjectName === 'string' ? item.subjectName.slice(0, 512) : undefined,
        version: typeof item.version === 'number' && Number.isFinite(item.version) && item.version > 0 ? Math.floor(item.version) : 1,
      });
    }

    const allRecords: VectorRecord[] = [];
    const textToEmbed: { chunkText: string; recMeta: Omit<VectorRecord, 'embedding' | 'embeddingDimension'> }[] = [];
    const now = new Date().toISOString();

    for (const item of validItems) {
      const fullText = `${item.title}\n\n${item.content}`.trim();
      if (!fullText) continue;
      const chunks = chunkDocument(fullText, {
        documentId: item.id,
        sourceType: item.type,
        userId: normalizedUserId,
        subjectId: item.subjectId,
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        title: item.title,
        contentVersion: item.version,
      });
      for (const chunk of chunks) {
        const chunkId = `${item.type}_${item.id}_chk_${chunk.metadata.chunkIndex}`;
        textToEmbed.push({
          chunkText: chunk.text,
          recMeta: {
            id: chunkId, documentId: item.id, chunkIndex: chunk.metadata.chunkIndex,
            totalChunks: chunk.metadata.totalChunks, sourceType: item.type, userId: normalizedUserId,
            subjectId: item.subjectId, subjectCode: item.subjectCode, subjectName: item.subjectName,
            title: item.title, contentChunk: chunk.text, contentVersion: item.version,
            embeddingModel: EMBEDDING_MODEL, createdAt: now, updatedAt: now,
          },
        });
      }
    }

    if (textToEmbed.length === 0) {
      res.json({ indexedCount: 0, vectorCount: 0, message: 'No valid content chunks extracted.' });
      return;
    }

    const { embeddings, dimension } = await generateEmbeddings(textToEmbed.map(t => t.chunkText));
    if (embeddings.length !== textToEmbed.length) throw new Error('Embedding count mismatch.');

    for (let i = 0; i < textToEmbed.length; i++) {
      allRecords.push({ ...textToEmbed[i].recMeta, embedding: embeddings[i], embeddingDimension: dimension });
    }
    await vectorDb.upsertRecords(allRecords);

    res.json({ success: true, indexedCount: validItems.length, vectorCount: allRecords.length, dimension, model: EMBEDDING_MODEL });
  } catch (err) {
    sendInternalError(res, 'Failed to index items into vector database.', err);
  }
});

async function performSearch(req: Request, res: Response, hybrid: boolean): Promise<void> {
  try {
    const { query, userId, sourceType, subjectId, limit, minSimilarity, semanticWeight } = req.body as Record<string, unknown>;
    const normalizedUserId = requireUserId(userId, res);
    if (!normalizedUserId) return;
    if (typeof query !== 'string' || !query.trim() || query.length > MAX_QUERY_LENGTH) {
      res.status(400).json({ error: `Search query is required and must be at most ${MAX_QUERY_LENGTH} characters.` });
      return;
    }
    if (!validSourceType(sourceType)) {
      res.status(400).json({ error: 'Invalid sourceType.' });
      return;
    }
    if (subjectId !== undefined && (typeof subjectId !== 'string' || subjectId.length > 256)) {
      res.status(400).json({ error: 'Invalid subjectId.' });
      return;
    }

    const normalizedQuery = query.trim();
    const normalizedLimit = normalizeLimit(limit);
    const normalizedSimilarity = normalizeSimilarity(minSimilarity, hybrid ? 0.25 : 0.35);
    const { embedding, dimension } = await generateQueryEmbedding(normalizedQuery);
    const options = {
      userId: normalizedUserId,
      sourceType: sourceType as IndexItemPayload['type'] | undefined,
      subjectId: subjectId as string | undefined,
      limit: normalizedLimit,
      minSimilarity: normalizedSimilarity,
    };

    const results = hybrid
      ? vectorDb.hybridSearch(normalizedQuery, embedding, { ...options, semanticWeight: normalizeSimilarity(semanticWeight, 0.65) })
      : vectorDb.searchSimilar(embedding, options);

    res.json({ success: true, query: normalizedQuery, results, model: EMBEDDING_MODEL, ...(hybrid ? {} : { dimension }), count: results.length });
  } catch (err) {
    sendInternalError(res, hybrid ? 'Failed to perform hybrid search.' : 'Failed to perform semantic search.', err);
  }
}

vectorRouter.post('/search', (req, res) => { void performSearch(req, res, false); });
vectorRouter.post('/hybrid-search', (req, res) => { void performSearch(req, res, true); });

vectorRouter.delete('/document/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const normalizedUserId = requireUserId(req.query.userId ?? req.body?.userId, res);
    if (!normalizedUserId) return;
    const documentId = typeof req.params.id === 'string' ? req.params.id.trim() : '';
    if (!documentId || documentId.length > 256) {
      res.status(400).json({ error: 'A valid document id is required.' });
      return;
    }
    const deletedCount = await vectorDb.deleteDocument(documentId, normalizedUserId);
    res.json({ success: true, deletedCount, documentId });
  } catch (err) {
    sendInternalError(res, 'Failed to delete document vectors.', err);
  }
});

vectorRouter.post('/sync-diff', async (req: Request, res: Response): Promise<void> => {
  try {
    const { activeIds, userId } = req.body as { activeIds?: unknown; userId?: unknown };
    const normalizedUserId = requireUserId(userId, res);
    if (!normalizedUserId) return;
    if (!Array.isArray(activeIds) || activeIds.length > MAX_ACTIVE_IDS || activeIds.some(id => typeof id !== 'string' || id.length > 256)) {
      res.status(400).json({ error: 'activeIds must be an array of valid IDs within the request limit.' });
      return;
    }
    const deletedCount = await vectorDb.syncDiff(new Set(activeIds), normalizedUserId);
    res.json({ success: true, purgedCount: deletedCount });
  } catch (err) {
    sendInternalError(res, 'Failed to sync vector differences.', err);
  }
});

vectorRouter.get('/status', (_req: Request, res: Response): void => {
  try {
    const status = vectorDb.getStatus();
    res.json({ ...status, isOperational: true });
  } catch (err) {
    sendInternalError(res, 'Failed to retrieve vector status.', err);
  }
});
