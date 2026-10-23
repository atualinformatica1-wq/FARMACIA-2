import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartSubtotal, isCartOpen, isCheckoutOpen, setIsCheckoutOpen } = usePharmacy();

  if (cartCount === 0 || isCartOpen || isCheckoutOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-800/80 flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
              {cartCount}
            </span>
          </div>

          <div className="truncate">
            <span className="text-[11px] text-slate-400 block leading-tight">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'} no carrinho
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white leading-tight">
              {formatCurrency(cartSubtotal)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCheckoutOpen(true)}
          style={{ backgroundColor: 'var(--color-emerald-600, #059669)', color: '#ffffff' }}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="text-white font-bold">Concluir Venda</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};
