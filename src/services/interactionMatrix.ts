/**
 * Interaction Matrix Service (The "DNA" of UANN)
 * Manages dynamic inhibition and excitation between clusters.
 */

import { ClusterType } from '../types';

export type InteractionMatrix = Record<ClusterType, Record<ClusterType, number>>;

// Initial heuristic weights (The starting point for learning)
const DEFAULT_MATRIX: InteractionMatrix = {
  math: {
    math: 0,
    language: -0.8,
    visual: -0.2,
    logic: 0.4,
    sentiment: -0.4,
    default: 0
  },
  language: {
    math: -0.3,
    language: 0,
    visual: 0.4,
    logic: 0.2,
    sentiment: 0.5,
    default: 0
  },
  visual: {
    math: -0.1,
    language: 0.4,
    visual: 0,
    logic: 0.2,
    sentiment: 0.1,
    default: 0
  },
  logic: {
    math: 0.5,
    language: -0.7,
    visual: 0.1,
    logic: 0,
    sentiment: -0.2,
    default: 0
  },
  sentiment: {
    math: -0.5,
    language: 0.6,
    visual: 0.2,
    logic: -0.3,
    sentiment: 0,
    default: 0
  },
  default: {
    math: 0,
    language: 0,
    visual: 0,
    logic: 0,
    sentiment: 0,
    default: 0
  }
};

// Load matrix from localStorage or use default
const savedMatrix = typeof window !== 'undefined' ? localStorage.getItem('uann_interaction_matrix') : null;
let matrix: InteractionMatrix = savedMatrix ? JSON.parse(savedMatrix) : DEFAULT_MATRIX;

const saveMatrix = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('uann_interaction_matrix', JSON.stringify(matrix));
  }
};

export const getInteractionMatrix = () => matrix;

export const exportMatrixAsJSON = () => {
  return JSON.stringify(matrix, null, 2);
};

/**
 * Apply Cross-Cluster Inhibition/Excitation
 * Formula: s_final_j = ReLU( s_j + sum( omega_ij * s_i^2 ) )
 */
export const applyInteractions = (rawScores: Record<ClusterType, number>): Record<ClusterType, number> => {
  const finalScores: Record<ClusterType, number> = { ...rawScores };
  const types: ClusterType[] = ['math', 'language', 'visual', 'logic', 'sentiment'];

  types.forEach(target => {
    if (target === 'default') return;

    let interactionSum = 0;
    types.forEach(source => {
      if (source === target) return;
      
      const weight = matrix[source][target] || 0;
      const confidence = Math.pow(rawScores[source], 2); // Quadratic confidence function
      interactionSum += weight * confidence;
    });

    // Apply ReLU and Clamp to [0, 1]
    finalScores[target] = Math.max(0, Math.min(1, rawScores[target] + interactionSum));
  });

  return finalScores;
};

/**
 * Dynamic Adaptation (Learning)
 * Adjusts weights based on utility feedback.
 */
export let learningHistory: { source: ClusterType, target: ClusterType, delta: number, timestamp: number }[] = [];

export const adjustInteractionWeight = (source: ClusterType, target: ClusterType, delta: number) => {
  if (matrix[source] && matrix[source][target] !== undefined) {
    matrix[source][target] += delta;
    // Keep weights within reasonable bounds [-1.5, 1.5]
    matrix[source][target] = Math.max(-1.5, Math.min(1.5, matrix[source][target]));
    
    // Persist learning
    saveMatrix();

    // Track history
    learningHistory.push({ source, target, delta, timestamp: Date.now() });
    if (learningHistory.length > 50) learningHistory.shift();
  }
};

/**
 * Autonomous Learning Feedback
 * If a cluster was active but provided no utility, we increase inhibition 
 * from the clusters that WERE confident.
 */
export const provideFeedback = (
  activeClusters: ClusterType[], 
  rawScores: Record<ClusterType, number>,
  utilityMap: Record<ClusterType, boolean>
) => {
  const types: ClusterType[] = ['math', 'language', 'visual', 'logic', 'sentiment'];
  const learningRate = 0.02;

  types.forEach(target => {
    // If a cluster was active but had NO utility
    if (activeClusters.includes(target) && utilityMap[target] === false) {
      // Find who could have inhibited it better
      types.forEach(source => {
        if (source === target) return;
        
        // If the source was very confident (high raw score)
        if (rawScores[source] > 0.6) {
          // Increase inhibition (make the negative weight more negative)
          adjustInteractionWeight(source, target, -learningRate);
        }
      });
    }
    
    // If a cluster was NOT active but SHOULD have been (Utility was needed)
    if (!activeClusters.includes(target) && utilityMap[target] === true) {
      types.forEach(source => {
        if (source === target) return;
        // Decrease inhibition (make the negative weight less negative)
        adjustInteractionWeight(source, target, learningRate);
      });
    }
  });
};
