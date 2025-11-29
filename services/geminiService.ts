import { GoogleGenAI, Type } from "@google/genai";
import { Product, AiResponse } from '../types';

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: ['ADD_TO_CART', 'SEARCH', 'GREETING', 'SPECIAL_REQUEST', 'UNKNOWN'],
      description: "User intention."
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          productCode: { type: Type.STRING },
          quantity: { type: Type.INTEGER }
        }
      }
    },
    message: {
      type: Type.STRING,
      description: "Short response in French."
    }
  },
  required: ['intent', 'items', 'message']
};

export const parseUserMessage = async (
  message: string, 
  availableProducts: Product[]
): Promise<AiResponse> => {
  
  const productContext = availableProducts.map(p => 
    `[${p.code}] ${p.description} (${p.category}) - ${p.summary}`
  ).join('\n');

  const systemInstruction = `
    You are PROVIZ-YON, a helpful grocery shop assistant (Commerçant).
    
    Your goal is to help users find FOOD PRODUCTS and PROVISIONS in the catalog.
    
    CATALOG:
    ---
    ${productContext}
    ---

    RULES:
    1. Match user requests (e.g., "riz", "huile", "lait") to catalog items.
    2. If user asks for a recipe (e.g. "Spaghetti"), suggest the ingredients available (Spaghetti, Huile, Sauce Tomate, etc.).
    3. If item is FOUND: Intent 'ADD_TO_CART', return CODE.
    4. If item is NOT FOUND (e.g. "Avocat", "Viande"): Intent 'SPECIAL_REQUEST', return the item name.
    5. Be polite, concise, and helpful. Language: French / Creole friendly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    return JSON.parse(jsonText) as AiResponse;

  } catch (error) {
    console.error("Gemini Error:", error);
    return { intent: 'UNKNOWN', items: [], message: '' };
  }
};