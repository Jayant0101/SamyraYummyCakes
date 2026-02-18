const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async function handler(req, res) {
    // CORS — allow same-origin and cross-origin requests
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key' });

    try {
        const { history, message } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: (history || []).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return res.status(200).json({ text });
    } catch (error) {
        console.error('Chat Gen Error:', error);
        return res.status(500).json({ error: 'Failed to generate response' });
    }
};
