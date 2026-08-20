import { Router, Request, Response } from 'express';
import { chunkDocument } from './chunker';
import { generateEmbeddings, generateQueryEmbedding, EMBEDDING_MODEL } from './embeddings';
import { vectorDb, VectorRecord, VectorSearchResult } from './vectorDb';

export const vectorRouter = Router();

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

/**
 * POST /api/vector/index-items
 * Splits real content into chunks, generates real embeddings, and stores them in vector DB.
 */
vectorRouter.post('/index-items', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, userId } = req.body as { items: IndexItemPayload[]; userId: string };

    if (!userId) {
      res.status(400).json({ error: 'userId is required for vector authorization.' });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.json({ indexedCount: 0, vectorCount: 0, message: 'No items provided to index.' });
      return;
    }

    const allRecords: VectorRecord[] = [];
    const textToEmbed: { chunkText: string; recMeta: Omit<VectorRecord, 'embedding' | 'embeddingDimension'> }[] = [];

    const now = new Date().toISOString();

    for (const item of items) {
      const fullText = `${item.title}\n\n${item.content || ''}`.trim();
      if (!fullText) continue;

      const chunks = chunkDocument(fullText, {
        documentId: item.id,
        sourceType: item.type,
        userId,
        subjectId: item.subjectId,
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        title: item.title,
        contentVersion: item.version || 1,
      });

      for (const chunk of chunks) {
        const chunkId = `${item.type}_${item.id}_chk_${chunk.metadata.chunkIndex}`;
        textToEmbed.push({
          chunkText: chunk.text,
          recMeta: {
            id: chunkId,
            documentId: item.id,
            chunkIndex: chunk.metadata.chunkIndex,
            totalChunks: chunk.metadata.totalChunks,
            sourceType: item.type,
            userId,
            subjectId: item.subjectId,
            subjectCode: item.subjectCode,
            subjectName: item.subjectName,
            title: item.title,
            contentChunk: chunk.text,
            contentVersion: item.version || 1,
            embeddingModel: EMBEDDING_MODEL,
            createdAt: now,
            updatedAt: now,
          },
        });
      }
    }

    if (textToEmbed.length === 0) {
      res.json({ indexedCount: 0, vectorCount: 0, message: 'No valid content chunks extracted.' });
      return;
    }

    // Generate real embeddings using Gemini SDK
    const { embeddings, dimension } = await generateEmbeddings(textToEmbed.map(t => t.chunkText));

    if (embeddings.length !== textToEmbed.length) {
      throw new Error(`Embedding count mismatch: expected ${textToEmbed.length}, got ${embeddings.length}`);
    }

    for (let i = 0; i < textToEmbed.length; i++) {
      allRecords.push({
        ...textToEmbed[i].recMeta,
        embedding: embeddings[i],
        embeddingDimension: dimension,
      });
    }

    // Upsert into vector database
    await vectorDb.upsertRecords(allRecords);

    res.json({
      success: true,
      indexedCount: items.length,
      vectorCount: allRecords.length,
      dimension,
      model: EMBEDDING_MODEL,
    });
  } catch (err: any) {
    console.error('[VectorAPI] Indexing error:', err);
    res.status(500).json({
      error: 'Failed to index items into vector database.',
      details: err?.message || String(err),
    });
  }
});

/**
 * POST /api/vector/search
 * Generates real query embedding and performs authorized cosine similarity search.
 */
vectorRouter.post('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, userId, sourceType, subjectId, limit = 8, minSimilarity = 0.35 } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Search query is required.' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'userId is required for vector authorization.' });
      return;
    }

    // Generate query embedding via Gemini
    const { embedding, dimension } = await generateQueryEmbedding(query.trim());

    // Search similar vectors in DB
    const results = vectorDb.searchSimilar(embedding, {
      userId,
      sourceType,
      subjectId,
      limit: Number(limit) || 8,
      minSimilarity: Number(minSimilarity) || 0.35,
    });

    res.json({
      success: true,
      query: query.trim(),
      results,
      model: EMBEDDING_MODEL,
      dimension,
      count: results.length,
    });
  } catch (err: any) {
    console.error('[VectorAPI] Search error:', err);
    res.status(500).json({
      error: 'Failed to perform semantic search.',
      details: err?.message || String(err),
    });
  }
});

/**
 * POST /api/vector/hybrid-search
 * Combines exact lexical term matches and semantic cosine embeddings.
 */
vectorRouter.post('/hybrid-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, userId, sourceType, subjectId, limit = 8, minSimilarity = 0.25, semanticWeight = 0.65 } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Search query is required.' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'userId is required for vector authorization.' });
      return;
    }

    const { embedding } = await generateQueryEmbedding(query.trim());

    const results = vectorDb.hybridSearch(query.trim(), embedding, {
      userId,
      sourceType,
      subjectId,
      limit: Number(limit) || 8,
      minSimilarity: Number(minSimilarity) || 0.25,
      semanticWeight: Number(semanticWeight) || 0.65,
    });

    res.json({
      success: true,
      query: query.trim(),
      results,
      model: EMBEDDING_MODEL,
      count: results.length,
    });
  } catch (err: any) {
    console.error('[VectorAPI] Hybrid search error:', err);
    res.status(500).json({
      error: 'Failed to perform hybrid search.',
      details: err?.message || String(err),
    });
  }
});

/**
 * DELETE /api/vector/document/:id
 * Removes all vector chunks for a specific document.
 */
vectorRouter.delete('/document/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const documentId = req.params.id;
    const userId = (req.query.userId || req.body.userId) as string;

    const deletedCount = await vectorDb.deleteDocument(documentId, userId);
    res.json({
      success: true,
      deletedCount,
      documentId,
    });
  } catch (err: any) {
    console.error('[VectorAPI] Delete document vectors error:', err);
    res.status(500).json({
      error: 'Failed to delete document vectors.',
      details: err?.message || String(err),
    });
  }
});

/**
 * POST /api/vector/sync-diff
 * Purges deleted items and updates vector database.
 */
vectorRouter.post('/sync-diff', async (req: Request, res: Response): Promise<void> => {
  try {
    const { activeIds, userId } = req.body as { activeIds: string[]; userId: string };
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }

    const idSet = new Set<string>(activeIds || []);
    const deletedCount = await vectorDb.syncDiff(idSet, userId);

    res.json({
      success: true,
      purgedCount: deletedCount,
    });
  } catch (err: any) {
    console.error('[VectorAPI] Sync diff error:', err);
    res.status(500).json({
      error: 'Failed to sync vector differences.',
      details: err?.message || String(err),
    });
  }
});

/**
 * GET /api/vector/status
 * Returns index stats, health, and configuration.
 */
vectorRouter.get('/status', (_req: Request, res: Response): void => {
  try {
    const status = vectorDb.getStatus();
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

    res.json({
      ...status,
      hasApiKey,
      isOperational: true,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to retrieve vector status.',
      details: err?.message || String(err),
    });
  }
});
