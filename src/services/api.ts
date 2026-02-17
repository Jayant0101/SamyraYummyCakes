import { AIConcept } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const generateCakeConcept = async (userPrompt: string): Promise<AIConcept> => {
    const response = await fetch(`${API_BASE}/concept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
    });
    if (!response.ok) throw new Error('Failed to generate concept');
    return await response.json();
};

export const generateCakeImage = async (visualPrompt: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: visualPrompt })
    });
    if (!response.ok) throw new Error('Failed to generate image');
    const data = await response.json();
    return data.image;
};

export const sendChatMessage = async (history: { sender: 'user' | 'bot', text: string }[], message: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message })
    });
    if (!response.ok) throw new Error('Failed to send message');
    const data = await response.json();
    return data.text;
};
