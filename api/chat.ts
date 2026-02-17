import { GoogleGenAI } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { message, history } = await req.json();

    if (!process.env.API_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';

    const pastContent = history.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const currentContent = {
      role: 'user',
      parts: [{ text: message }]
    };

    const response = await ai.models.generateContent({
      model,
      contents: [...pastContent, currentContent],
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
          - If a user wants to order, guide them to the 'Custom Order' page.
        `,
      }
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Chat failed' }), { status: 500 });
  }
}