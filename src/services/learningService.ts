import { ClusterType, ComplexityProfile, Neuron } from '../types';

/**
 * Learning Service (Pristup B)
 * Implements a simple feedback loop to adjust neuron sensitivity and cluster weights.
 */

export interface LearnedWeights {
  [key: string]: {
    weights: ComplexityProfile;
    bias: number;
  };
}

// Simple Sigmoid activation
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const trainCluster = (
  clusterType: ClusterType,
  features: ComplexityProfile,
  target: number, // 1 for active, 0 for inhibited
  currentWeights: LearnedWeights,
  learningRate: number
): LearnedWeights => {
  const newWeights = { ...currentWeights };
  const cluster = newWeights[clusterType];
  
  if (!cluster) return currentWeights;

  // 1. Calculate current activation (prediction)
  let dotProduct = cluster.bias;
  (Object.keys(features) as Array<keyof ComplexityProfile>).forEach(key => {
    dotProduct += features[key] * cluster.weights[key];
  });
  
  const prediction = sigmoid(dotProduct);
  const error = target - prediction;

  // 2. Update weights using Gradient Descent
  (Object.keys(features) as Array<keyof ComplexityProfile>).forEach(key => {
    cluster.weights[key] += learningRate * error * features[key];
  });
  cluster.bias += learningRate * error;

  return newWeights;
};

export const updateNeuronImportance = (
  neurons: Neuron[],
  isActive: boolean,
  learningRate: number
): Neuron[] => {
  return neurons.map(n => {
    // Hebbian-like update: neurons that are active when the cluster is active gain importance
    const delta = isActive ? learningRate * (1 - n.importance) : -learningRate * 0.1 * n.importance;
    return {
      ...n,
      importance: Math.max(0, Math.min(1, n.importance + delta)),
      lastActivity: isActive ? Date.now() : n.lastActivity
    };
  });
};
