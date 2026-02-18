import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conceptHandler from './api/concept.js';
import chatHandler from './api/chat.js';
import generateHandler from './api/generate.js';
import imageHandler from './api/image.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Vercel/Next.js handler adapter for Express
// The existing handlers use res.status().json() which is standard Express
// But they might use other properties. The current code looks compatible.

app.all('/api/concept', (req, res) => conceptHandler(req, res));
app.all('/api/chat', (req, res) => chatHandler(req, res));
app.all('/api/generate', (req, res) => generateHandler(req, res));
app.all('/api/image', (req, res) => imageHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
