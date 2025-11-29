import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Bot, User, Sparkles, ShoppingBasket } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const SUGGESTIONS = ["Prix sac riz", "Huile 1 gallon", "Spaghetti", "Lait et sucre", "Ingrédients Soupe Joumou"];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = React.useState('');

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-20 text-slate-400">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBasket size={32} />
            </div>
            <h3 className="font-medium text-slate-700">Bienvenue chez PROVIZ-YON</h3>
            <p className="text-sm mt-1">Je peux prendre votre commande ou chercher des produits.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => onSendMessage(s)} className="px-3 py-1 bg-white border rounded-full text-xs hover:border-brand-500 hover:text-brand-600">{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200' : 'bg-brand-600 text-white'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white border' : 'bg-brand-600 text-white'}`}>
                {msg.content}
              </div>
            </div>
            {msg.relatedProducts && msg.relatedProducts.length > 0 && (
              <div className={`mt-2 space-y-2 w-[70%] ${msg.role === 'user' ? 'mr-10' : 'ml-10'}`}>
                {msg.relatedProducts.map(p => (
                  <div key={p.id} className="bg-white p-2 rounded-lg border shadow-sm flex gap-2">
                    <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded"><ShoppingBasket size={16} className="text-slate-400"/></div>
                    <div>
                      <p className="font-bold text-xs">{p.description}</p>
                      <p className="text-brand-600 text-xs font-bold">{p.price > 0 ? p.price + ' G' : 'Sur Devis'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="ml-10 text-slate-400 text-xs animate-pulse">Recherche en rayon...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Riz, Huile, Lait..." className="flex-1 bg-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500" disabled={isLoading}/>
          <button type="submit" disabled={!inputText.trim() || isLoading} className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50"><Send size={20} /></button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;