import { evaluate } from 'mathjs';

/**
 * Math Cluster Worker
 * Responsible for parsing and solving mathematical expressions.
 */

export interface MathResult {
  expression: string;
  result: any;
  error?: string;
  confidence: number;
}

export const processMathTask = (input: string): MathResult | null => {
  // Pre-process: convert words to symbols
  let processedInput = input.toLowerCase()
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/puta|puta/g, '*')
    .replace(/podeljeno|kroz/g, '/')
    .replace(/na kvadrat/g, '^2');

  const mathChars = /[0-9+\-*/^%().\s]/g;
  const chars = processedInput.split('');
  
  // Find the continuous sequence of math-related characters
  let bestSequence = "";
  let currentSequence = "";
  
  for (const char of chars) {
    if (char.match(mathChars)) {
      currentSequence += char;
    } else {
      if (currentSequence.trim().length > bestSequence.trim().length) {
        bestSequence = currentSequence;
      }
      currentSequence = "";
    }
  }
  if (currentSequence.trim().length > bestSequence.trim().length) {
    bestSequence = currentSequence;
  }

  const expression = bestSequence.trim();
  
  // Must contain at least one operator and some numbers to be a valid expression
  if (!expression || !/[+\-*/^%]/.test(expression) || !/[0-9]/.test(expression)) return null;

  try {
    // mathjs.evaluate is a full-blown parser
    const result = evaluate(expression);
    return {
      expression,
      result: typeof result === 'number' ? Number(result.toFixed(4)).toString() : result.toString(),
      confidence: 0.95
    };
  } catch (error) {
    return {
      expression,
      result: "?",
      error: "Parsing error",
      confidence: 0.2
    };
  }
};
