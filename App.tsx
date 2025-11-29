import React, { useState, useEffect } from 'react';
import { Product, CartItem, Message, AppView } from './types';
import { fetchProducts, searchProductsLocal } from './services/data';
import { parseUserMessage } from './services/geminiService';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ChatInterface from './components/ChatInterface';
import { LayoutGrid, MessageSquare, ShoppingCart, Search, Loader2, Store } from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('proviz_cart') || '[]'));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [messages, setMessages] = useState<Message[]>(() => JSON.parse(localStorage.getItem('proviz_chat') || '[]'));
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetchProducts().then(data => { setProducts(data); setIsCatalogLoading(false); });
  }, []);

  useEffect(() => { localStorage.setItem('proviz_cart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('proviz_chat', JSON.stringify(messages)); }, [messages]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing 
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const aiResponse = await parseUserMessage(text, products);
      let replyContent = aiResponse.message || "Compris.";
      const relatedProducts: Product[] = [];

      if (aiResponse.items) {
        aiResponse.items.forEach(item => {
          if (aiResponse.intent === 'SPECIAL_REQUEST') {
            const special: Product = { id: `sp-${Date.now()}`, code: 'SPEC', description: `Commande Spéciale: ${item.productCode}`, price: 0, category: 'Sur Commande', imageUrl: '' };
            addToCart(special, item.quantity);
            relatedProducts.push(special);
          } else {
            const p = products.find(prod => prod.code === item.productCode);
            if (p) { addToCart(p, item.quantity); relatedProducts.push(p); }
          }
        });
      }
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: replyContent, timestamp: new Date(), relatedProducts: relatedProducts.length ? relatedProducts : undefined }]);
    } catch {
      // Fallback Local
      const matches = searchProductsLocal(text, products);
      if (matches.length > 0) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `J'ai trouvé ${matches.length} produits.`, timestamp: new Date(), relatedProducts: matches.slice(0,3) }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Désolé, je ne trouve pas ce produit.", timestamp: new Date() }]);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.description.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'Tout' || p.category === selectedCategory)
  );
  const categories = ['Tout', ...Array.from(new Set(products.map(p => p.category)))];

  if (isCatalogLoading) return <div className="flex h-screen items-center justify-center text-brand-600"><Loader2 className="animate-spin mr-2"/> Chargement du marché...</div>;

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-col w-20 bg-white border-r items-center py-6 gap-6 z-20">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">PY</div>
        <button onClick={() => setCurrentView(AppView.CHAT)} className={`p-3 rounded-xl ${currentView === AppView.CHAT ? 'bg-brand-50 text-brand-600' : 'text-slate-400'}`}><MessageSquare /></button>
        <button onClick={() => setCurrentView(AppView.CATALOG)} className={`p-3 rounded-xl ${currentView === AppView.CATALOG ? 'bg-brand-50 text-brand-600' : 'text-slate-400'}`}><LayoutGrid /></button>
        <div className="mt-auto">
          <button onClick={() => setIsCartOpen(true)} className="relative p-3 text-slate-400 hover:text-brand-600"><ShoppingCart />{cartItems.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full"></span>}</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 z-10">
          <div className="font-bold text-brand-900 text-lg flex items-center gap-2"><Store size={20}/> PROVIZ-YON</div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView(v => v === AppView.CHAT ? AppView.CATALOG : AppView.CHAT)} className="p-2 bg-slate-50 rounded-lg">{currentView === AppView.CHAT ? <LayoutGrid size={20} /> : <MessageSquare size={20} />}</button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 bg-slate-50 rounded-lg relative"><ShoppingCart size={20} />{cartItems.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>}</button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {/* CATALOG */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${currentView === AppView.CATALOG ? 'translate-x-0' : '-translate-x-full hidden'}`}>
             <div className="p-4 md:p-6 overflow-y-auto h-full pb-20 scrollbar-hide">
                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                  <div><h1 className="text-2xl font-bold text-slate-900">Rayons</h1><p className="text-slate-500">Provisions et Produits Frais</p></div>
                  <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input type="text" placeholder="Chercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border rounded-full text-sm focus:outline-none focus:border-brand-500"/></div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === cat ? 'bg-brand-900 text-white' : 'bg-white border'}`}>{cat}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
                </div>
             </div>
          </div>

          {/* CHAT */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${currentView === AppView.CHAT ? 'translate-x-0' : 'translate-x-full hidden'}`}>
            <ChatInterface messages={messages} isLoading={isAiLoading} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
    </div>
  );
};

export default App;