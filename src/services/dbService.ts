import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'UANN_Local_Intelligence';
const DB_VERSION = 1;

export interface KnowledgeEntry {
  id: string;
  input: string;
  output: string;
  timestamp: number;
  clusters: string[];
}

export interface SessionStat {
  id: string;
  timestamp: number;
  savings: number;
  uannUnits: number;
  standardUnits: number;
}

let dbPromise: Promise<IDBPDatabase>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('knowledge_base')) {
          db.createObjectStore('knowledge_base', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('session_stats')) {
          db.createObjectStore('session_stats', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

/**
 * Safe ID generation for Unicode strings
 */
const generateId = (input: string): string => {
  const normalized = input.toLowerCase().trim();
  // Use a simple but robust hash for the ID to avoid btoa Unicode issues
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + normalized.length.toString(36);
};

/**
 * Knowledge Distillation: Store cloud wisdom locally
 */
export const storeKnowledge = async (input: string, output: string, clusters: string[]) => {
  const db = await initDB();
  const id = generateId(input);
  await db.put('knowledge_base', {
    id,
    input,
    output,
    timestamp: Date.now(),
    clusters
  });
};

/**
 * Local Retrieval: Check if we already know this
 */
export const getLocalKnowledge = async (input: string): Promise<KnowledgeEntry | null> => {
  const db = await initDB();
  const id = generateId(input);
  return await db.get('knowledge_base', id) || null;
};

/**
 * Stats Persistence
 */
export const saveStat = async (savings: number, uannUnits: number, standardUnits: number) => {
  const db = await initDB();
  await db.put('session_stats', {
    id: Date.now().toString(),
    timestamp: Date.now(),
    savings,
    uannUnits,
    standardUnits
  });
};

export const getAllStats = async (): Promise<SessionStat[]> => {
  const db = await initDB();
  return await db.getAll('session_stats');
};

export const getAllKnowledge = async (): Promise<KnowledgeEntry[]> => {
  const db = await initDB();
  return await db.getAll('knowledge_base');
};
