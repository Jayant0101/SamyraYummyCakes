module.exports = async function handler(req, res) {
    // CORS — allow same-origin and cross-origin requests
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Mock response for now as we don't have Imagen access configured
    const MOCK_IMAGE = "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80";

    return res.status(200).json({ image: MOCK_IMAGE });
};
