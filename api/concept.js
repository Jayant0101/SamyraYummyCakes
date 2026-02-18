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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing API Key' });

    try {
        const { prompt } = req.body;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are a creative cake designer. Generate a unique cake concept based on the user's request.
    Return strictly JSON with the following structure:
    {
      "name": "Creative Name",
      "description": "Detailed description of the cake design and texture.",
      "suggestedFlavors": ["Flavor 1", "Flavor 2", "Flavor 3"],
      "visualPrompt": "A detailed prompt for an image generator to visualize this cake"
    }`;

        const result = await model.generateContent([systemPrompt, `User Request: ${prompt}`]);
        const responseText = result.response.text();

        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const concept = JSON.parse(cleanedText);

        return res.status(200).json(concept);
    } catch (error) {
        console.error('Concept Gen Error:', error);
        return res.status(500).json({ error: 'Failed to generate concept' });
    }
}
