import { Product } from '../types';

export const CATALOGUE_DB: Product[] = [
  {
    id: "p1",
    code: "RIZ-001",
    description: "Sac Riz Mega (25kg)",
    price: 3500,
    category: "Céréales & Grains",
    imageUrl: "https://picsum.photos/400/400?random=1",
    summary: "Riz blanc américain de qualité supérieure. Grain long, parfait pour le riz collé."
  },
  {
    id: "p2",
    code: "HUI-001",
    description: "Huile Gourmet (1 Gallon)",
    price: 1200,
    category: "Huiles & Condiments",
    imageUrl: "https://picsum.photos/400/400?random=2",
    summary: "Huile végétale pure, idéale pour la friture et la cuisine de tous les jours."
  },
  {
    id: "p3",
    code: "PAS-001",
    description: "Spaghetti Bongu (Paquet)",
    price: 85,
    category: "Pâtes",
    imageUrl: "https://picsum.photos/400/400?random=3",
    summary: "Pâtes alimentaires enrichies. Cuisson rapide 8 minutes."
  },
  {
    id: "p4",
    code: "LAI-001",
    description: "Lait Évaporé Carnation (Boîte)",
    price: 150,
    category: "Produits Laitiers",
    imageUrl: "https://picsum.photos/400/400?random=4",
    summary: "Lait évaporé riche et crémeux, indispensable pour les smoothies et le café."
  },
  {
    id: "p5",
    code: "POI-001",
    description: "Pois Noirs Secs (Marmite)",
    price: 400,
    category: "Céréales & Grains",
    imageUrl: "https://picsum.photos/400/400?random=5",
    summary: "Pois noirs locaux, parfaits pour la sauce pois traditionnelle."
  },
  {
    id: "p6",
    code: "SUC-001",
    description: "Sucre Brun (Sac 5 lbs)",
    price: 600,
    category: "Épicerie Sucrée",
    imageUrl: "https://picsum.photos/400/400?random=6",
    summary: "Sucre de canne naturel, idéal pour les jus et la pâtisserie."
  },
  {
    id: "p7",
    code: "EPI-001",
    description: "Cube Bouillon Maggi (Tablette)",
    price: 25,
    category: "Épices",
    imageUrl: "https://picsum.photos/400/400?random=7",
    summary: "Assaisonnement complet pour relever le goût de vos plats."
  },
  {
    id: "p8",
    code: "SAU-001",
    description: "Pâte de Tomate (Petite boîte)",
    price: 60,
    category: "Conserves",
    imageUrl: "https://picsum.photos/400/400?random=8",
    summary: "Concentré de tomate pour colorer et parfumer vos sauces et riz."
  },
  {
    id: "p9",
    code: "BOI-001",
    description: "Cola Couronne (Bouteille verre)",
    price: 75,
    category: "Boissons",
    imageUrl: "https://picsum.photos/400/400?random=9",
    summary: "Le soda fruité classique d'Haïti. À servir très frais."
  },
  {
    id: "p10",
    code: "DIV-001",
    description: "Corn Flakes (Boîte)",
    price: 450,
    category: "Petit-Déjeuner",
    imageUrl: "https://picsum.photos/400/400?random=10",
    summary: "Céréales de maïs croustillantes pour un petit-déjeuner énergétique."
  }
];

export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CATALOGUE_DB);
    }, 800);
  });
};

export const searchProductsLocal = (query: string, products: Product[]): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.description.toLowerCase().includes(lowerQuery) || 
    p.category.toLowerCase().includes(lowerQuery) ||
    p.code.toLowerCase().includes(lowerQuery)
  );
};