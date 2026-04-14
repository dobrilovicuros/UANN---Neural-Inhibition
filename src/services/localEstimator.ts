/**
 * Local Complexity Estimator based on Statistical Heuristics (Pristup A)
 * From the UANN Project Diary.
 */

export interface ComplexityProfile {
  default: number;
  math: number;
  language: number;
  visual: number;
  logic: number;
  sentiment: number;
}

import { applyInteractions } from './interactionMatrix';

export interface EstimationResult {
  raw: ComplexityProfile;
  final: ComplexityProfile;
}

export const estimateComplexityLocally = (input: string): EstimationResult => {
  const text = input.trim();
  if (!text) {
    const empty = { default: 1, math: 0, language: 0, visual: 0, logic: 0, sentiment: 0 };
    return { raw: empty, final: empty };
  }

  // --- RAW SCORE CALCULATION ---
  // ... (rest of the logic remains same)

  // 1. Math Complexity (Heuristic-based)
  const mathSymbols = /[\+\-\*\/\=\^\%\(\)\[\]\{\}\<\>\√\π\Σ\∫\∂\∆]/g;
  const numbers = /[0-9]/g;
  const mathWords = ['plus', 'minus', 'puta', 'podeljeno', 'kroz', 'kvadrat', 'koren', 'zbir', 'razlika', 'proizvod', 'količnik', 'times', 'divided', 'sum', 'difference', 'product', 'quotient', 'root', 'square'];
  
  const symbolMatches = (text.match(mathSymbols) || []).length;
  const numberMatches = (text.match(numbers) || []).length;
  const wordMatches = mathWords.filter(word => text.toLowerCase().includes(word)).length;

  // Increased weights: symbols 0.25, numbers 0.1, words 0.2
  const rawMathScore = Math.min(1, (symbolMatches * 0.25) + (numberMatches * 0.1) + (wordMatches * 0.2));

  // 2. Language Complexity (Entropy-based)
  const cleanText = text.replace(mathSymbols, '').replace(numbers, '').trim();
  const charMap: Record<string, number> = {};
  let rawLanguageScore = 0;
  if (cleanText.length > 0) {
    for (const char of cleanText) {
      charMap[char] = (charMap[char] || 0) + 1;
    }
    const entropy = Object.values(charMap).reduce((acc, count) => {
      const p = count / cleanText.length;
      return acc - p * Math.log2(p);
    }, 0);
    rawLanguageScore = Math.min(1, entropy / 4.5);
  }

  // 3. Visual Complexity
  const visualKeywords = ['boja', 'oblik', 'prostor', 'slika', 'videti', 'izgled', 'veličina', 'pozicija', 'levo', 'desno', 'gore', 'dole', 'color', 'shape', 'visual', 'image', 'see', 'look', 'size', 'position', 'left', 'right', 'kocka', 'sfera', 'krug', 'kvadrat', 'trougao', 'cube', 'sphere', 'circle', 'square', 'triangle'];
  const visualMatches = visualKeywords.filter(word => text.toLowerCase().includes(word)).length;
  const rawVisualScore = Math.min(1, visualMatches * 0.3);

  // 4. Logic Complexity
  const logicKeywords = ['ako', 'onda', 'zato', 'dakle', 'paradoks', 'problem', 'rešenje', 'plan', 'if', 'then', 'because', 'therefore', 'paradox', 'problem', 'solution', 'plan', 'why', 'how', 'zašto', 'kako'];
  const logicMatches = logicKeywords.filter(word => text.toLowerCase().includes(word)).length;
  const sentenceCount = text.split(/[.!?]/).filter(s => s.length > 0).length;
  const rawLogicScore = Math.min(1, (logicMatches * 0.15) + (sentenceCount * 0.1));

  // 5. Sentiment Complexity
  const sentimentKeywords = ['super', 'odlično', 'bravo', 'hvala', 'volim', 'dobro', 'lepo', 'great', 'love', 'good', 'loše', 'mrzim', 'ne valja', 'error', 'problem', 'teško', 'bad', 'hate', 'wrong', 'hitno', 'odmah', 'brzo', 'sad', 'urgent', 'now', 'fast', 'asap'];
  const sentimentMatches = sentimentKeywords.filter(word => text.toLowerCase().includes(word)).length;
  const rawSentimentScore = Math.min(1, sentimentMatches * 0.25);

  // --- INTERACTION PHASE (Dynamic Inhibition/Excitation) ---
  const rawScores = {
    default: 1.0,
    math: rawMathScore,
    language: rawLanguageScore,
    visual: rawVisualScore,
    logic: rawLogicScore,
    sentiment: rawSentimentScore
  };

  const finalScores = applyInteractions(rawScores);

  return {
    raw: rawScores as ComplexityProfile,
    final: finalScores as ComplexityProfile
  };
};
