import React, { useState } from 'react';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ShoppingBasket, X, MessageCircle } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const PHONE_NUMBER = "50936620118";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E";

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, onClose, items, onUpdateQuantity, onRemove 
}) => {
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const executeWhatsAppRedirect = () => {
    let message = `*🛒 COMMANDE DE PROVISIONS - PROVIZ-YON*\n\n`;
    items.forEach(item => {
      const priceDisplay = item.price > 0 ? `${item.price} G` : "Sur Devis";
      message += `▪️ ${item.quantity}x ${item.description}\n`;
    });
    message += `\n*TOTAL ESTIMÉ: ${total.toLocaleString('fr-HT')} HTG*\n`;
    message += `_Merci de confirmer la disponibilité et la livraison._`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowCheckoutConfirmation(false);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-brand-50">
            <div className="flex items-center gap-2 text-brand-900">
              <ShoppingBasket />
              <h2 className="font-bold">Mon Panier</h2>
            </div>
            <button onClick={onClose}><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <ShoppingBasket size={48} className="mx-auto mb-3 opacity-20" />
                <p>Votre panier est vide.</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <div className="w-12 h-16 bg-slate-100 flex items-center justify-center">
                    <img src={item.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" onError={(e)=>e.currentTarget.src=PLACEHOLDER_IMAGE} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2">{item.description}</h4>
                    <p className="text-brand-600 font-bold text-xs">{item.price > 0 ? `${item.price} G` : 'Sur Devis'}</p>
                    <div className="flex justify-between items-center mt-2">
                       <div className="flex gap-2 items-center bg-slate-100 rounded px-1">
                         <button onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity<=1}><Minus size={12}/></button>
                         <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                         <button onClick={() => onUpdateQuantity(item.id, 1)}><Plus size={12}/></button>
                       </div>
                       <button onClick={() => setItemToRemove(item.id)} className="text-red-400"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t bg-slate-50">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total</span><span>{total.toLocaleString('fr-HT')} G</span>
            </div>
            <button onClick={() => items.length > 0 && setShowCheckoutConfirmation(true)} className="w-full py-3 bg-whatsapp text-white rounded-xl font-bold shadow-lg hover:bg-whatsappHover">
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      </div>

      {showCheckoutConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
            <MessageCircle className="mx-auto text-whatsapp mb-4" size={32} />
            <h3 className="font-bold text-lg mb-2">Envoyer la commande ?</h3>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowCheckoutConfirmation(false)} className="flex-1 py-2 bg-slate-100 rounded-lg">Annuler</button>
              <button onClick={executeWhatsAppRedirect} className="flex-1 py-2 bg-whatsapp text-white rounded-lg">Confirmer</button>
            </div>
          </div>
        </div>
      )}
       {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
            <h3 className="font-bold text-lg mb-4">Retirer cet article ?</h3>
            <div className="flex gap-2">
              <button onClick={() => setItemToRemove(null)} className="flex-1 py-2 bg-slate-100 rounded-lg">Non</button>
              <button onClick={() => {onRemove(itemToRemove); setItemToRemove(null)}} className="flex-1 py-2 bg-red-500 text-white rounded-lg">Oui</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;