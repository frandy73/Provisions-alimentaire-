export interface Product {
  id: string;
  code: string;
  description: string; // Nom du produit
  price: number; // En HTG
  category: string;
  imageUrl: string;
  summary?: string; // Détails (Poids, Marque, Usage)
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  relatedProducts?: Product[]; 
}

export enum AppView {
  CATALOG = 'CATALOG',
  CHAT = 'CHAT'
}

export interface AiResponse {
  intent: 'ADD_TO_CART' | 'SEARCH' | 'GREETING' | 'SPECIAL_REQUEST' | 'UNKNOWN';
  items: {
    productCode: string; 
    quantity: number;
  }[];
  message?: string;
}