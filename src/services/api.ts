import { AIConcept } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Graceful fallback data for when API is unavailable
const MOCK_CONCEPT: AIConcept = {
    name: "Enchanted Forest Whispers",
    description: "[DEMO MODE] A whimsical three-tier masterpiece covered in moss-green velvet texture, adorned with edible gold leaf, fondant woodland creatures, and sugar-spun fairy wings.",
    suggestedFlavors: ["Dark Chocolate & Raspberry", "Pistachio & Rosewater", "Wild Berry & Vanilla Bean"],
    visualPrompt: "A professional 3-tier forest themed cake with edible moss, gold leaf, and fondant fairies"
};

const MOCK_IMAGE = "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80";

export const generateCakeConcept = async (userPrompt: string): Promise<AIConcept> => {
    try {
        const response = await fetch(`${API_BASE}/concept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt })
        });
        if (!response.ok) throw new Error('API call failed');
        return await response.json();
    } catch (error) {
        console.warn('AI Concept API unavailable, using demo mode:', error);
        return MOCK_CONCEPT;
    }
};

export const generateCakeImage = async (visualPrompt: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE}/image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: visualPrompt })
        });
        if (!response.ok) throw new Error('API call failed');
        const data = await response.json();
        return data.image;
    } catch (error) {
        console.warn('Image API unavailable, using placeholder:', error);
        return MOCK_IMAGE;
    }
};

export const sendChatMessage = async (history: { sender: 'user' | 'bot', text: string }[], message: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, message })
        });
        if (!response.ok) throw new Error('Chat API failed');
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.warn('Chat API unavailable:', error);
        return "I'm currently in demo mode! For real responses, please contact us on WhatsApp. 🎂";
    }
};
