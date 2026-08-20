import { GoogleGenAI } from '@google/genai';

export const EMBEDDING_MODEL = 'gemini-embedding-2-preview';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return genAIClient;
}

/**
 * Generates real vector embeddings for one or more text inputs.
 * Uses `@google/genai` SDK with the `gemini-embedding-2-preview` model.
 */
export async function generateEmbeddings(texts: string[]): Promise<{ embeddings: number[][]; dimension: number }> {
  if (!texts || texts.length === 0) {
    return { embeddings: [], dimension: 0 };
  }

  const ai = getGenAI();
  const results: number[][] = [];

  // Batch process with concurrency limit
  const batchSize = 10;
  for (let i = 0; i < texts.length; i += batchSize) {
    const slice = texts.slice(i, i + batchSize);

    // Call embedContent for each text chunk in parallel within batch
    const batchPromises = slice.map(async (text) => {
      const sanitized = text.trim().slice(0, 4000); // Guard text length
      if (!sanitized) {
        return [];
      }

      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: sanitized,
      });

      // Extract values from response embedding
      const values = response.embeddings?.[0]?.values;
      if (!values || values.length === 0) {
        throw new Error(`Embedding model returned empty vector for text chunk: "${sanitized.slice(0, 40)}..."`);
      }
      return values;
    });

    const batchEmbeddings = await Promise.all(batchPromises);
    for (const vec of batchEmbeddings) {
      if (vec.length > 0) {
        results.push(vec);
      }
    }
  }

  const dimension = results.length > 0 ? results[0].length : 0;
  return { embeddings: results, dimension };
}

/**
 * Generates a single embedding for a user search query.
 */
export async function generateQueryEmbedding(query: string): Promise<{ embedding: number[]; dimension: number }> {
  const clean = query.trim();
  if (!clean) {
    throw new Error('Query cannot be empty for embedding generation.');
  }

  const { embeddings, dimension } = await generateEmbeddings([clean]);
  if (!embeddings || embeddings.length === 0 || embeddings[0].length === 0) {
    throw new Error('Failed to generate embedding for search query.');
  }

  return { embedding: embeddings[0], dimension };
}
