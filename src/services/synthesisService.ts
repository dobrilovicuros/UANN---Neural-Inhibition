import { MathResult } from './clusters/mathWorker';
import { LogicResult } from './clusters/logicWorker';
import { VisualResult } from './clusters/visualWorker';
import { SentimentResult } from './clusters/sentimentWorker';

export interface SynthesisInput {
  math?: MathResult | null;
  logic?: LogicResult | null;
  visual?: VisualResult | null;
  sentiment?: SentimentResult | null;
  input: string;
  contextUsed?: boolean;
}

export const synthesizeNeuralOutput = ({ math, logic, visual, sentiment, input, contextUsed }: SynthesisInput): string => {
  let parts: string[] = [];
  let tonePrefix = "";
  let toneSuffix = "";

  if (contextUsed) {
    tonePrefix = "[KONTEKST AKTIVAN] ";
  }

  // Apply Sentiment Tone
  if (sentiment) {
    if (sentiment.tone === 'Urgent') {
      tonePrefix = "HITNA ANALIZA: ";
      toneSuffix = " !!!";
    } else if (sentiment.tone === 'Positive') {
      tonePrefix = "Sa zadovoljstvom potvrđujem: ";
      toneSuffix = " :)";
    } else if (sentiment.tone === 'Negative') {
      tonePrefix = "Nažalost, detektovan je problem: ";
      toneSuffix = " ...";
    }
  }

  // Combine Cluster Outputs
  if (math) {
    parts.push(`Matematički proračun za "${math.expression}" iznosi tačno ${math.result}.`);
  }

  if (logic) {
    parts.push(`Logička dedukcija ukazuje na sledeće: ${logic.reasoningTree.conclusion}.`);
  }

  if (visual) {
    parts.push(`Vizuelna rekonstrukcija scene: ${visual.sceneDescription}`);
  }

  // Fallback if no specific cluster output
  if (parts.length === 0) {
    if (input.length > 0) {
      parts.push(`Procesiram opšti jezički upit: "${input.substring(0, 50)}${input.length > 50 ? '...' : ''}"`);
    } else {
      parts.push("Sistem je u stanju mirovanja. Čekam neuronsku pobudu.");
    }
  }

  const mainBody = parts.join(" ");
  return `${tonePrefix}${mainBody}${toneSuffix}`;
};
