import fs from 'fs';
import path from 'path';

export interface VectorRecord {
  id: string; // e.g. "note_101_chk_0"
  documentId: string;
  chunkIndex: number;
  totalChunks: number;
  sourceType: 'topic' | 'note' | 'question' | 'resource';
  userId: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  title: string;
  contentChunk: string;
  contentVersion: number;
  embedding: number[];
  embeddingModel: string;
  embeddingDimension: number;
  createdAt: string;
  updatedAt: string;
}

export interface VectorSearchOptions {
  userId: string;
  sourceType?: 'topic' | 'note' | 'question' | 'resource';
  subjectId?: string;
  limit?: number;
  minSimilarity?: number; // Minimum cosine similarity threshold (e.g., 0.40)
}

export interface VectorSearchResult {
  id: string;
  documentId: string;
  chunkIndex: number;
  totalChunks: number;
  sourceType: 'topic' | 'note' | 'question' | 'resource';
  userId: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  title: string;
  contentChunk: string;
  similarityScore: number;
  hybridScore?: number;
  keywordScore?: number;
  embeddingModel: string;
  embeddingDimension: number;
}

export interface VectorIndexStatus {
  totalVectors: number;
  totalDocuments: number;
  sourceTypeBreakdown: Record<string, number>;
  activeModel: string;
  activeDimension: number;
  storageFilePath: string;
  lastPersistedAt: string;
}

class VectorDatabase {
  private records: Map<string, VectorRecord> = new Map();
  private storageFile: string;
  private isLoaded: boolean = false;
  private lastPersistedAt: string = new Date().toISOString();

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create data directory for vector db:', err);
      }
    }
    this.storageFile = path.join(dataDir, 'vector_store.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const raw = fs.readFileSync(this.storageFile, 'utf-8');
        const list: VectorRecord[] = JSON.parse(raw);
        this.records.clear();
        for (const item of list) {
          this.records.set(item.id, item);
        }
        this.isLoaded = true;
        this.lastPersistedAt = new Date().toISOString();
        console.log(`[VectorDB] Loaded ${this.records.size} vector records from disk storage.`);
      } else {
        this.isLoaded = true;
      }
    } catch (err) {
      console.error('[VectorDB] Error loading vector storage from disk:', err);
      this.isLoaded = true;
    }
  }

  private async persistToDisk(): Promise<void> {
    try {
      const dataDir = path.dirname(this.storageFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const list = Array.from(this.records.values());
      await fs.promises.writeFile(this.storageFile, JSON.stringify(list, null, 2), 'utf-8');
      this.lastPersistedAt = new Date().toISOString();
    } catch (err) {
      console.error('[VectorDB] Failed to persist vector store to disk:', err);
    }
  }

  /**
   * Calculates cosine similarity between two float vectors.
   * Cosine Similarity = dot(A, B) / (||A|| * ||B||)
   */
  public cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length || a.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      const valA = a[i];
      const valB = b[i];
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    // Clamp within [-1, 1] to guard precision issues
    return Math.max(-1, Math.min(1, similarity));
  }

  /**
   * Calculates lexical keyword score (term overlap / BM25 style).
   */
  private calculateKeywordScore(query: string, text: string, title: string): number {
    const cleanQuery = query.toLowerCase().trim();
    const cleanText = text.toLowerCase();
    const cleanTitle = title.toLowerCase();

    if (!cleanQuery) return 0;

    const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) return 0;

    let matchedTerms = 0;
    let titleBonus = 0;

    for (const term of terms) {
      if (cleanTitle.includes(term)) {
        titleBonus += 0.4;
      }
      if (cleanText.includes(term)) {
        matchedTerms += 1;
      }
    }

    const termOverlap = matchedTerms / terms.length;
    return Math.min(1, termOverlap * 0.7 + Math.min(0.3, titleBonus));
  }

  /**
   * Upserts vector records into the vector database.
   */
  public async upsertRecords(records: VectorRecord[]): Promise<void> {
    for (const rec of records) {
      this.records.set(rec.id, rec);
    }
    await this.persistToDisk();
  }

  /**
   * Deletes all vector chunks for a specific documentId.
   */
  public async deleteDocument(documentId: string, userId?: string): Promise<number> {
    let deletedCount = 0;
    for (const [id, rec] of this.records.entries()) {
      if (rec.documentId === documentId) {
        if (!userId || rec.userId === userId) {
          this.records.delete(id);
          deletedCount++;
        }
      }
    }
    if (deletedCount > 0) {
      await this.persistToDisk();
    }
    return deletedCount;
  }

  /**
   * Purges all vectors not present in the active document IDs set for a user.
   */
  public async syncDiff(activeDocumentIds: Set<string>, userId: string): Promise<number> {
    let deletedCount = 0;
    for (const [id, rec] of this.records.entries()) {
      if (rec.userId === userId && !activeDocumentIds.has(rec.documentId)) {
        this.records.delete(id);
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      await this.persistToDisk();
    }
    return deletedCount;
  }

  /**
   * Real Vector Similarity Search with User Authorization Scoping.
   */
  public searchSimilar(
    queryVector: number[],
    options: VectorSearchOptions
  ): VectorSearchResult[] {
    const { userId, sourceType, subjectId, limit = 10, minSimilarity = 0.35 } = options;

    const results: VectorSearchResult[] = [];

    for (const record of this.records.values()) {
      // 1. Mandatory Authorization & Tenant Isolation check
      if (record.userId !== userId) {
        continue;
      }

      // 2. Optional filters
      if (sourceType && record.sourceType !== sourceType) {
        continue;
      }
      if (subjectId && record.subjectId !== subjectId) {
        continue;
      }

      // 3. Dimension match check
      if (record.embedding.length !== queryVector.length) {
        continue;
      }

      // 4. Exact Cosine Similarity
      const similarity = this.cosineSimilarity(queryVector, record.embedding);

      if (similarity >= minSimilarity) {
        results.push({
          id: record.id,
          documentId: record.documentId,
          chunkIndex: record.chunkIndex,
          totalChunks: record.totalChunks,
          sourceType: record.sourceType,
          userId: record.userId,
          subjectId: record.subjectId,
          subjectCode: record.subjectCode,
          subjectName: record.subjectName,
          title: record.title,
          contentChunk: record.contentChunk,
          similarityScore: Number(similarity.toFixed(4)),
          embeddingModel: record.embeddingModel,
          embeddingDimension: record.embeddingDimension,
        });
      }
    }

    // Sort descending by cosine similarity score
    results.sort((a, b) => b.similarityScore - a.similarityScore);

    // Group by documentId and keep the most relevant chunk per document, or top results
    const documentMap = new Map<string, VectorSearchResult>();
    for (const item of results) {
      if (!documentMap.has(item.documentId)) {
        documentMap.set(item.documentId, item);
      }
    }

    return Array.from(documentMap.values()).slice(0, limit);
  }

  /**
   * Hybrid Search: Combines exact keyword ranking with semantic vector cosine similarity.
   */
  public hybridSearch(
    queryText: string,
    queryVector: number[],
    options: VectorSearchOptions & { semanticWeight?: number }
  ): VectorSearchResult[] {
    const { semanticWeight = 0.65, limit = 10, minSimilarity = 0.25 } = options;
    const keywordWeight = 1 - semanticWeight;

    const baseResults = this.searchSimilar(queryVector, { ...options, minSimilarity, limit: 100 });

    const scoredResults: VectorSearchResult[] = baseResults.map((item) => {
      const keywordScore = this.calculateKeywordScore(queryText, item.contentChunk, item.title);
      const hybridScore = Number((item.similarityScore * semanticWeight + keywordScore * keywordWeight).toFixed(4));
      return {
        ...item,
        keywordScore: Number(keywordScore.toFixed(4)),
        hybridScore,
      };
    });

    // Sort descending by blended hybrid score
    scoredResults.sort((a, b) => (b.hybridScore ?? 0) - (a.hybridScore ?? 0));
    return scoredResults.slice(0, limit);
  }

  /**
   * Returns current statistics of the vector database.
   */
  public getStatus(): VectorIndexStatus {
    const docs = new Set<string>();
    const breakdown: Record<string, number> = {};
    let model = 'gemini-embedding-2-preview';
    let dim = 0;

    for (const rec of this.records.values()) {
      docs.add(rec.documentId);
      breakdown[rec.sourceType] = (breakdown[rec.sourceType] || 0) + 1;
      model = rec.embeddingModel;
      dim = rec.embeddingDimension;
    }

    return {
      totalVectors: this.records.size,
      totalDocuments: docs.size,
      sourceTypeBreakdown: breakdown,
      activeModel: model,
      activeDimension: dim,
      storageFilePath: this.storageFile,
      lastPersistedAt: this.lastPersistedAt,
    };
  }
}

export const vectorDb = new VectorDatabase();
