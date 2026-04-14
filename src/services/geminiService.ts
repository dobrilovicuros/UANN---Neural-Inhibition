import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
// Note: The API key is provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface GeminiResponse {
  text: string;
  usage: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
}

/**
 * Core Gemini Bridge for UANN Clusters
 * Used when a cluster requires "Deep Intelligence" beyond local heuristics.
 */
export const callGeminiCluster = async (
  clusterName: string,
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using Flash for speed and efficiency (UANN philosophy)
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are the ${clusterName} cluster of the UANN (Universal Adaptive Neural Network). ${systemInstruction}`,
        temperature: 0.2, // Low temperature for consistent cluster behavior
      },
    });

    return response.text || "No response from cluster.";
  } catch (error) {
    console.error(`Gemini Cluster Error (${clusterName}):`, error);
    return `Error in ${clusterName} processing.`;
  }
};

/**
 * Neural Synthesis (The Oracle)
 * Combines outputs from all active clusters into a final coherent thought.
 */
export const synthesizeWithGemini = async (
  input: string,
  clusterResults: Record<string, any>
): Promise<string> => {
  const activeClusters = Object.keys(clusterResults).filter(k => clusterResults[k]);
  
  const prompt = `
    USER INPUT: "${input}"
    
    ACTIVE CLUSTER OUTPUTS:
    ${activeClusters.map(c => `[${c.toUpperCase()}]: ${JSON.stringify(clusterResults[c])}`).join('\n')}
    
    TASK: Synthesize these specialized outputs into a final, helpful response. 
    If a cluster provided a specific result (like a math calculation), ensure it is the core of your answer.
    Maintain the "Oracle" persona: wise, efficient, and precise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are the UANN Oracle. Your job is to synthesize specialized neural cluster outputs into a single coherent response.",
      }
    });

    return response.text || "Synthesis failed.";
  } catch (error) {
    console.error("Synthesis Error:", error);
    return "The Oracle is currently offline. Local heuristics suggest a processing error.";
  }
};
