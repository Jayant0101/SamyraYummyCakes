import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    if (!process.env.API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: `Design a cake for this request: "${prompt}"`,
      config: {
        systemInstruction: `
          You are a world-class pastry chef and cake designer for "Samyra's Yummy Cakes".
          Your goal is to suggest creative, delicious, and visually stunning cake concepts based on customer requests.
          Keep the tone warm, appetizing, and professional.
          Return the result in strict JSON format.
        `,
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

    return new Response(response.text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to generate concept' }), { status: 500 });
  }
}