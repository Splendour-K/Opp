
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with named parameter and direct environment variable access.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOpportunityMatch = async (opportunityTitle: string, userDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Profile: ${userDescription}\nOpportunity: ${opportunityTitle}\n\nExplain why this is a good match and provide 3 tips to improve the application. Keep it concise.`,
      config: {
        systemInstruction: "You are an AI career and funding advisor. Your goal is to help users understand why an opportunity fits their profile and how to win it.",
      },
    });
    // Correct: text is a property, not a method.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to analyze at this moment. Please try again later.";
  }
};

export interface SyncResult {
  opportunities: any[];
  groundingChunks?: any[];
}

export const syncExternalSources = async (): Promise<SyncResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Find the 5 most recent opportunities from opportunitydesk.org and opportunitiesforyouth.org. For each, extract the title, organization, type (Grant, Investment, Internship, Growth, Accelerator, or Fellowship), amount/benefit, a short description, the full content of the post, the deadline, and the original URL. Format the output as a JSON array of objects.",
      config: {
        tools: [{ googleSearch: {} }],
        // Note: Do not use responseMimeType: "application/json" with googleSearch to ensure grounding metadata is correctly included.
      },
    });

    const text = response.text || "";
    // ALWAYS extract URLs from groundingChunks when using googleSearch tool.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Safety check: The output response.text may not be in pure JSON format when search is used.
    // We attempt to extract a JSON block if present.
    let jsonStr = text;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    } else {
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        jsonStr = text.substring(firstBracket, lastBracket + 1);
      }
    }

    let rawData = [];
    try {
      rawData = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Could not parse JSON from search result, falling back to empty list.", e);
    }
    
    const opportunities = Array.isArray(rawData) ? rawData.map((item: any, index: number) => ({
      id: `ext-${Date.now()}-${index}`,
      title: item.title,
      organization: item.organization,
      type: item.type as any,
      amount: item.amount || 'See details',
      description: item.description,
      content: item.content,
      deadline: item.deadline,
      matchScore: Math.floor(Math.random() * 30) + 60,
      source: {
        name: item.sourceName || "External Hub",
        url: item.sourceUrl || "#"
      }
    })) : [];

    return { opportunities, groundingChunks };
  } catch (error) {
    console.error("Sync Error:", error);
    return { opportunities: [], groundingChunks: [] };
  }
};
