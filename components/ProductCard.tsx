import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Utensils } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-40 w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
        {hasImage && !imageError ? (
          <img 
            src={product.imageUrl} 
            alt={product.description}
            className="h-full w-auto object-contain mix-blend-multiply"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <Utensils size={32} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-brand-900/80 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full backdrop-blur-sm">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-slate-800 text-sm mb-1 leading-tight line-clamp-2">
          {product.description}
        </h3>
        <p className="text-xs text-slate-500 mb-3 truncate">{product.summary}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-brand-600 text-lg">
            {product.price.toLocaleString('fr-HT')} G
          </span>
          <button 
            onClick={() => onAdd(product)}
            className="p-2 bg-accent-500 text-white rounded-full hover:bg-accent-600 transition-colors active:scale-95 shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;