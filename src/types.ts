export type ClusterType = 'default' | 'math' | 'language' | 'visual' | 'logic' | 'sentiment';

export interface Neuron {
  id: string;
  x: number;
  y: number;
  importance: number; // 0-1, learned importance
  isActive: boolean;
  sensitivity: number; // How reactive it is to gating
  lastActivity: number; // For decay simulation
}

export interface ComplexityProfile {
  default: number;
  math: number;
  language: number;
  visual: number;
  logic: number;
  sentiment: number;
}

export interface BrainState {
  profile: ComplexityProfile;
  activeClusters: ClusterType[];
  totalNeurons: number;
  activeNeurons: number;
  flopsSaved: number;
  isTraining: boolean;
  learningRate: number;
}
