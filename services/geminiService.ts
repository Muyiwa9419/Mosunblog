
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client using the environment variable directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContentAdvice = async (title: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Title: ${title}\nContent: ${content}\n\nAnalyze this article. Provide a short 1-paragraph summary, suggest 3 relevant tags, and give one tip to improve the tone.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvementTip: { type: Type.STRING }
          },
          required: ["summary", "tags", "improvementTip"]
        }
      }
    });

    // Directly access the text property from GenerateContentResponse as per standard guidelines.
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
