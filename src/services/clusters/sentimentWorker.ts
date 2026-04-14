/**
 * Sentiment Cluster Worker
 * Detects emotional tone and intent.
 */

export interface SentimentResult {
  tone: 'Positive' | 'Negative' | 'Neutral' | 'Urgent';
  score: number;
  confidence: number;
  detectedKeywords: string[];
}

export const processSentimentTask = (input: string): SentimentResult => {
  const text = input.toLowerCase();
  
  const positive = ['super', 'odlično', 'bravo', 'hvala', 'volim', 'dobro', 'lepo', 'great', 'love', 'good'];
  const negative = ['loše', 'mrzim', 'ne valja', 'error', 'problem', 'teško', 'bad', 'hate', 'wrong'];
  const urgent = ['hitno', 'odmah', 'brzo', 'sad', 'urgent', 'now', 'fast', 'asap'];

  const foundPos = positive.filter(w => text.includes(w));
  const foundNeg = negative.filter(w => text.includes(w));
  const foundUrg = urgent.filter(w => text.includes(w));

  let tone: SentimentResult['tone'] = 'Neutral';
  let score = 0.5;

  if (foundPos.length > foundNeg.length) {
    tone = 'Positive';
    score = 0.8;
  } else if (foundNeg.length > foundPos.length) {
    tone = 'Negative';
    score = 0.2;
  }

  if (foundUrg.length > 0) {
    tone = 'Urgent';
    score = 0.9;
  }

  return {
    tone,
    score,
    confidence: Math.min(0.9, (foundPos.length + foundNeg.length + foundUrg.length) * 0.3 + 0.2),
    detectedKeywords: [...foundPos, ...foundNeg, ...foundUrg]
  };
};
