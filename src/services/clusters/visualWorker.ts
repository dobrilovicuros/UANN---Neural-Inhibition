import { ClusterType } from '../../types';

export interface VisualElement {
  type: 'shape' | 'line' | 'point';
  color: string;
  position: string;
  label: string;
}

export interface VisualResult {
  sceneDescription: string;
  elements: VisualElement[];
  spatialCoherence: number;
  confidence: number;
}

export const processVisualTask = (input: string): VisualResult | null => {
  const text = input.toLowerCase();
  
  // Simple heuristic parser for the "Maketa"
  const elements: VisualElement[] = [];
  
  if (text.includes('kocka') || text.includes('cube')) {
    elements.push({ type: 'shape', color: text.includes('crven') ? 'red' : 'gray', position: 'center', label: 'Cube' });
  }
  
  if (text.includes('sfera') || text.includes('sphere') || text.includes('krug')) {
    elements.push({ type: 'shape', color: text.includes('plav') ? 'blue' : 'gray', position: 'bottom', label: 'Sphere' });
  }

  if (elements.length === 0) return null;

  return {
    sceneDescription: `Generisana vizuelna scena sa ${elements.length} elemenata.`,
    elements,
    spatialCoherence: 0.85,
    confidence: Math.min(0.9, elements.length * 0.45)
  };
};
