/**
 * StudyOS Vector Database Client
 * Interacts with the server-side Vector Database and Gemini Embedding Pipeline.
 */

export interface VectorSearchResultItem {
  id: string;
  documentId: string;
  chunkIndex: number;
  totalChunks: number;
  sourceType: 'topic' | 'note' | 'question' | 'resource' | 'document' | 'paper' | 'concept';
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

export interface VectorIndexStatusResponse {
  totalVectors: number;
  totalDocuments: number;
  sourceTypeBreakdown: Record<string, number>;
  activeModel: string;
  activeDimension: number;
  storageFilePath: string;
  lastPersistedAt: string;
  hasApiKey: boolean;
  isOperational: boolean;
}

export interface IndexItemPayload {
  id: string;
  type: 'topic' | 'note' | 'question' | 'resource' | 'document' | 'paper' | 'concept';
  title: string;
  content: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  tags?: string[];
  version?: number;
}

export async function searchSemantic(
  query: string,
  userId: string,
  options?: {
    sourceType?: 'topic' | 'note' | 'question' | 'resource';
    subjectId?: string;
    limit?: number;
    minSimilarity?: number;
  }
): Promise<{ success: boolean; results: VectorSearchResultItem[]; error?: string }> {
  try {
    const res = await fetch('/api/vector/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userId,
        sourceType: options?.sourceType,
        subjectId: options?.subjectId,
        limit: options?.limit ?? 8,
        minSimilarity: options?.minSimilarity ?? 0.35,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        results: [],
        error: errData.details || errData.error || `HTTP error ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      results: data.results || [],
    };
  } catch (err: any) {
    return {
      success: false,
      results: [],
      error: err?.message || 'Network error connecting to vector search.',
    };
  }
}

export async function searchHybrid(
  query: string,
  userId: string,
  options?: {
    sourceType?: 'topic' | 'note' | 'question' | 'resource';
    subjectId?: string;
    limit?: number;
    minSimilarity?: number;
    semanticWeight?: number;
  }
): Promise<{ success: boolean; results: VectorSearchResultItem[]; error?: string }> {
  try {
    const res = await fetch('/api/vector/hybrid-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userId,
        sourceType: options?.sourceType,
        subjectId: options?.subjectId,
        limit: options?.limit ?? 8,
        minSimilarity: options?.minSimilarity ?? 0.25,
        semanticWeight: options?.semanticWeight ?? 0.65,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        results: [],
        error: errData.details || errData.error || `HTTP error ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      results: data.results || [],
    };
  } catch (err: any) {
    return {
      success: false,
      results: [],
      error: err?.message || 'Network error connecting to hybrid search.',
    };
  }
}

export async function indexItems(
  items: IndexItemPayload[],
  userId: string
): Promise<{ success: boolean; indexedCount?: number; vectorCount?: number; error?: string }> {
  try {
    const res = await fetch('/api/vector/index-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, userId }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.details || errData.error || `HTTP error ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      indexedCount: data.indexedCount,
      vectorCount: data.vectorCount,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during vector indexing.',
    };
  }
}

export async function deleteDocumentVector(
  documentId: string,
  userId: string
): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const res = await fetch(`/api/vector/document/${encodeURIComponent(documentId)}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errData.details || errData.error || `HTTP error ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      deletedCount: data.deletedCount,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during vector deletion.',
    };
  }
}

export async function getVectorStatus(): Promise<VectorIndexStatusResponse | null> {
  try {
    const res = await fetch('/api/vector/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
