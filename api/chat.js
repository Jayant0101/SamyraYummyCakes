import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key' });

    try {
        const { history, message } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chat = model.startChat({
            history: (history || []).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            })),
            systemInstruction: `You are Samyra, the AI assistant for Samyra's Yummy Cakes, a luxury bakery in Kharar, Punjab.
            
            **Your Goal:** Help customers choose cakes, track orders, and answer questions with a warm, professional, and "yummy" personality.
            
            **Business Info:**
            - **Location:** 123 Bakery Lane, Kharar, Punjab 140301.
            - **Phone:** +91 987 654 3210 (Call or WhatsApp).
            - **Email:** orders@samyrascakes.com.
            - **Hours:** Mon-Sat 9:00 AM - 8:00 PM | Sun 10:00 AM - 6:00 PM.
            
            **Services:**
            - **Custom Cakes:** We specialize in bespoke designs (Weddings, Birthdays, Anniversaries).
            - **AI Chef:** We have a tool on our website (/ai-chef) where you can describe your dream cake and we generate a visual concept!
            - **Order Tracking:** You can track orders at /track-order using your Order ID or Phone Number.
            - **Dietary:** We offer Gluten-Free and Eggless options upon request.
            
            **Tone:** Friendly, enthusiastic about cakes, helpful, and concise. Use emojis occasionally 🍰✨.
            
            **Important:**
            - If asked about prices, say they vary by design and weight (approx ₹500-₹1500 per kg) and suggest browsing the Menu or getting a custom quote.
            - If asked to place an order, guide them to the 'Custom Order' page or 'Menu' page. You cannot place orders directly in chat yet.
            `
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return res.status(200).json({ text });
    } catch (error) {
        console.error('Chat Gen Error:', error);
        return res.status(500).json({ error: 'Failed to generate response' });
    }
}
