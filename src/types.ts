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
  rating: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  date: string;
  flavor: string;
  occasion: string;
  weight: string;
  details: string;
  referenceImage?: string;
}

export interface AIConcept {
  name: string;
  description: string;
  suggestedFlavors: string[];
  visualPrompt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'baking' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  event_date: string;
  cake_flavor: string;
  cake_weight: string;
  occasion: string;
  details: string;
  reference_image_url?: string;
  ai_concept?: AIConcept;
  ai_image_url?: string;
  status: OrderStatus;
  owner_notes?: string;
  created_at: string;
  updated_at: string;
}
