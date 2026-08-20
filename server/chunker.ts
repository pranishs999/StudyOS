/**
 * StudyOS Document Chunker
 * Normalizes user-authored academic content, notes, formulas, and syllabus topics
 * into meaningful semantic chunks while preserving context, hierarchy, and metadata.
 */

export interface ChunkMetadata {
  documentId: string;
  chunkIndex: number;
  totalChunks: number;
  sourceType: 'topic' | 'note' | 'question' | 'resource';
  userId: string;
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  title: string;
  contentVersion: number;
}

export interface ChunkResult {
  text: string;
  metadata: ChunkMetadata;
}

const DEFAULT_CHUNK_SIZE = 400; // characters per chunk (~80-100 tokens)
const DEFAULT_OVERLAP = 60;

export function normalizeContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Splits document content into structured chunks, respecting markdown headers and sentence boundaries.
 */
export function chunkDocument(
  content: string,
  meta: Omit<ChunkMetadata, 'chunkIndex' | 'totalChunks'>,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  overlap: number = DEFAULT_OVERLAP
): ChunkResult[] {
  const clean = normalizeContent(content);
  if (!clean) {
    return [];
  }

  // If text is short, return a single chunk with full metadata
  if (clean.length <= chunkSize) {
    return [
      {
        text: clean,
        metadata: {
          ...meta,
          chunkIndex: 0,
          totalChunks: 1,
        },
      },
    ];
  }

  const rawChunks: string[] = [];
  let startIndex = 0;

  while (startIndex < clean.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex >= clean.length) {
      const chunk = clean.slice(startIndex).trim();
      if (chunk.length > 0) {
        rawChunks.push(chunk);
      }
      break;
    }

    // Try to find natural break point (paragraph, sentence, or space)
    const sub = clean.slice(startIndex, endIndex);
    const lastParagraph = sub.lastIndexOf('\n\n');
    const lastNewline = sub.lastIndexOf('\n');
    const lastSentence = Math.max(sub.lastIndexOf('. '), sub.lastIndexOf('? '), sub.lastIndexOf('! '));
    const lastSpace = sub.lastIndexOf(' ');

    let breakOffset = chunkSize;
    if (lastParagraph > chunkSize * 0.5) {
      breakOffset = lastParagraph + 2;
    } else if (lastNewline > chunkSize * 0.6) {
      breakOffset = lastNewline + 1;
    } else if (lastSentence > chunkSize * 0.6) {
      breakOffset = lastSentence + 2;
    } else if (lastSpace > chunkSize * 0.7) {
      breakOffset = lastSpace + 1;
    }

    const chunk = clean.slice(startIndex, startIndex + breakOffset).trim();
    if (chunk.length > 0) {
      rawChunks.push(chunk);
    }

    startIndex += Math.max(1, breakOffset - overlap);
  }

  const totalChunks = rawChunks.length;
  return rawChunks.map((text, idx) => ({
    text,
    metadata: {
      ...meta,
      chunkIndex: idx,
      totalChunks,
    },
  }));
}
