/**
 * Logic Cluster Worker
 * Responsible for logical decomposition, identifying premises, 
 * and inhibiting redundant information.
 */

export interface LogicResult {
  premises: string[];
  goal: string;
  simplifiedInput: string;
  redundancyDetected: boolean;
  confidence: number;
  reasoningTree: {
    premise: string;
    inference: string;
    conclusion: string;
  };
}

export const processLogicTask = (input: string): LogicResult => {
  const text = input.toLowerCase();
  const result: LogicResult = {
    premises: [],
    goal: input,
    simplifiedInput: input,
    redundancyDetected: false,
    confidence: 0.3,
    reasoningTree: {
      premise: 'Nije detektovana jasna premisa',
      inference: 'Direktna analiza ulaza',
      conclusion: 'Izvršiti operaciju nad celim ulazom'
    }
  };

  // 1. Identify common logical structures
  // Pattern: "if [premise] then/is [goal]" or "[goal] if [premise]"
  const ifPatterns = [
    /ako je (.*?) onda (.*)/,
    /ako je (.*?), (.*)/,
    /(.*?) ako je (.*)/,
    /if (.*?) then (.*)/,
    /(.*?) if (.*)/
  ];

  for (const pattern of ifPatterns) {
    const match = text.match(pattern);
    if (match) {
      // We found a logical structure
      const part1 = match[1].trim();
      const part2 = match[2].trim();
      
      // Determine which is premise and which is goal
      // Usually "ako je [premise] [goal]"
      if (text.startsWith('ako') || text.startsWith('if')) {
        result.premises.push(part1);
        result.goal = part2;
      } else {
        result.goal = part1;
        result.premises.push(part2);
      }
      
      result.redundancyDetected = true;
      result.confidence = 0.85;
      result.reasoningTree = {
        premise: part1,
        inference: 'Deduktivno razdvajanje uslova od cilja',
        conclusion: `Fokusirati resurse na: ${part2}`
      };
      break;
    }
  }

  // 2. Check for identities in premises (e.g., "12*4=48")
  // If a premise is a simple identity, we can "inhibit" it from the math task
  // by marking it as known.
  if (result.redundancyDetected) {
    // For now, simplification means focusing only on the goal
    result.simplifiedInput = result.goal;
  }

  return result;
};
