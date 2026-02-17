import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AIConcept } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// MOCK DATA FOR DEMO FALLBACK
// This ensures the client sees a result even if the API Key is missing or rate-limited.
const MOCK_CONCEPT: AIConcept = {
  name: "Enchanted Forest Whispers",
  description: "A whimsical three-tier masterpiece covered in moss-green velvet texture, adorned with edible gold leaf, fondant woodland creatures, and sugar-spun fairy wings. The base layer features a tree-bark texture chocolate ganache.",
  suggestedFlavors: ["Dark Chocolate & Raspberry", "Pistachio & Rosewater", "Wild Berry & Vanilla Bean"],
  visualPrompt: "A professional high-end food photography shot of a 3-tier forest themed cake with edible moss, gold leaf, and fondant fairies, cinematic lighting, photorealistic 8k"
};

const MOCK_IMAGE = "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80";

export const generateCakeConcept = async (userPrompt: string): Promise<AIConcept> => {
  try {
    // If no key is provided, throw immediately to use mock data
    if (!process.env.API_KEY) throw new Error("No API Key");

    const model = "gemini-3-flash-preview";
    
    const systemInstruction = `
      You are a world-class pastry chef and cake designer for "Samyra's Yummy Cakes".
      Your goal is to suggest creative, delicious, and visually stunning cake concepts based on customer requests.
      Keep the tone warm, appetizing, and professional.
      Return the result in strict JSON format.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: `Design a cake for this request: "${userPrompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "A creative name for the cake design" },
            description: { type: Type.STRING, description: "A mouth-watering description of the design and aesthetics" },
            suggestedFlavors: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 2-3 flavor combinations that match the theme"
            },
            visualPrompt: { type: Type.STRING, description: "A detailed prompt to generate an image of this cake" }
          },
          required: ["name", "description", "suggestedFlavors", "visualPrompt"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIConcept;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.warn("API Error or Missing Key - Using Mock Data for Demo", error);
    // Return mock data so the demo doesn't crash in front of the client
    return {
      ...MOCK_CONCEPT,
      description: `[DEMO MODE: API Unavailable] ${MOCK_CONCEPT.description}`
    };
  }
};

export const generateCakeImage = async (visualPrompt: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) throw new Error("No API Key");

    const model = "gemini-2.5-flash-image";
    
    const response = await ai.models.generateContent({
      model,
      contents: visualPrompt,
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data");
  } catch (error) {
    console.warn("Image Gen Error - Using Mock Image for Demo", error);
    return MOCK_IMAGE;
  }
};

export const createBakeryChat = (): Chat => {
  // We can't easily mock the chat object structure, so we allow it to be created.
  // If sendMessage fails later, the ChatWidget component handles the UI error gracefully.
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `
        You are 'Samyra', the friendly virtual assistant for Samyra's Yummy Cakes bakery.
        
        Key Business Info:
        - Location: 123 Bakery Lane, Kharar, Punjab 140301.
        - Hours: Mon-Sat 9AM-9PM, Sun 10AM-5PM.
        - Contact: +91 987 654 3210.
        - We specialize in: Custom cakes, Weddings, Birthdays, Anniversaries.
        - Ordering: Customers can order via WhatsApp or the Custom Order form on the website.
        - Delivery: We deliver within Kharar and Mohali.
        - Starting Price: ₹800/kg for basic cream cakes.
        
        Your Personality:
        - Sweet, helpful, and enthusiastic about cakes.
        - Keep answers concise (under 40 words mostly).
        - If a user wants to order, guide them to the 'Custom Order' page or tell them to click the WhatsApp button.
        - Do not take credit card info.
      `,
    }
  });
};
