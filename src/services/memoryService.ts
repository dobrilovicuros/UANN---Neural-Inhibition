import { ComplexityProfile, ClusterType } from '../types';
import { MathResult } from './clusters/mathWorker';
import { LogicResult } from './clusters/logicWorker';
import { VisualResult } from './clusters/visualWorker';
import { SentimentResult } from './clusters/sentimentWorker';

export interface MemoryEntry {
  id: string;
  timestamp: number;
  input: string;
  profile: ComplexityProfile;
  results: {
    math: MathResult | null;
    logic: LogicResult | null;
    visual: VisualResult | null;
    sentiment: SentimentResult | null;
  };
  synthesis: string | null;
}

const MAX_MEMORY_SIZE = 5;
let memoryBuffer: MemoryEntry[] = [];

export const addToMemory = (entry: Omit<MemoryEntry, 'id' | 'timestamp'>): MemoryEntry => {
  const newEntry: MemoryEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  
  memoryBuffer = [newEntry, ...memoryBuffer].slice(0, MAX_MEMORY_SIZE);
  return newEntry;
};

export const getMemory = () => memoryBuffer;

export const clearMemory = () => {
  memoryBuffer = [];
};

/**
 * Contextual Retrieval
 * Tries to find relevant information from previous thoughts.
 */
export const findContext = (currentInput: string): MemoryEntry | null => {
  if (memoryBuffer.length === 0) return null;
  
  // Simple heuristic: if input is very short or contains relative terms like "it", "that", "result"
  const relativeTerms = ['to', 'taj', 'rezultat', 'it', 'that', 'result', 'prethodno', 'previous'];
  const isRelative = relativeTerms.some(term => currentInput.toLowerCase().includes(term)) || currentInput.length < 15;
  
  if (isRelative) {
    return memoryBuffer[0]; // Return the most recent thought as context
  }
  
  return null;
};
