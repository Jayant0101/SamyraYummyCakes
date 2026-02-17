export interface Cake {
  id: number;
  name: string;
  category: 'Birthday' | 'Wedding' | 'Anniversary' | 'Cupcakes' | 'Custom';
  priceRange: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number; // 1-5
}

export interface OrderFormData {
  name: string;
  phone: string;
  date: string;
  flavor: string;
  occasion: string;
  weight: string;
  details: string;
}

export interface AIConcept {
  name: string;
  description: string;
  suggestedFlavors: string[];
  visualPrompt: string;
}
