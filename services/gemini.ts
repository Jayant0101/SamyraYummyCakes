import { AIConcept } from '../types';

const MOCK_CONCEPT: AIConcept = {
  name: "Enchanted Forest Whispers",
  description: "A whimsical three-tier masterpiece covered in moss-green velvet texture, adorned with edible gold leaf, fondant woodland creatures, and sugar-spun fairy wings. The base layer features a tree-bark texture chocolate ganache.",
  suggestedFlavors: ["Dark Chocolate & Raspberry", "Pistachio & Rosewater", "Wild Berry & Vanilla Bean"],
  visualPrompt: "A professional high-end food photography shot of a 3-tier forest themed cake with edible moss, gold leaf, and fondant fairies, cinematic lighting, photorealistic 8k"
};

const MOCK_IMAGE = "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80";

export const generateCakeConcept = async (userPrompt: string): Promise<AIConcept> => {
  try {
    const response = await fetch('/api/concept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (!response.ok) throw new Error('API call failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      ...MOCK_CONCEPT,
      description: `[DEMO MODE] ${MOCK_CONCEPT.description}`
    };
  }
};

export const generateCakeImage = async (visualPrompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: visualPrompt })
    });

    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error(error);
    return MOCK_IMAGE;
  }
};

export const sendChatMessage = async (history: {sender: 'user' | 'bot', text: string}[], message: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message })
    });

    if (!response.ok) throw new Error('Chat API failed');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error(error);
    return "Oops! My oven timer just went off. Can you say that again?";
  }
};