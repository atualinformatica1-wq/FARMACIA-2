import React, { useState } from 'react';
import { Product } from '../types/pharmacy';
import { formatCurrency } from '../utils/formatters';
import { usePharmacy } from '../context/PharmacyContext';
import { Eye, Plus, Minus, Check, AlertCircle, PackageX, Sparkles, ShoppingBag, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, updateCartQuantity, cart, setQuickViewProduct, setIsCheckoutOpen } = usePharmacy();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentPrice = product.promotionalPrice || product.price;
  const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.promotionalPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
        product.inStock
          ? 'border-slate-200/80 hover:border-emerald-400 hover:shadow-lg'
          : 'border-slate-200/50 bg-slate-50/50 opacity-80'
      }`}
    >
      {/* Image Container with Badges */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setQuickViewProduct(product);
        }}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ${
            product.inStock ? 'group-hover:scale-105' : 'grayscale'
          }`}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {hasDiscount && product.inStock && (
            <span className="bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-xs uppercase">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && product.inStock && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              Destaque
            </span>
          )}
        </div>

        {/* Prescription Indicator */}
        {product.requiresPrescription && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span
              className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1"
              title="Medicamento sujeito a retenção de receita médica"
            >
              <AlertCircle className="w-3 h-3" />
              Receita
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-3 text-center pointer-events-none">
            <span className="bg-white/95 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
              <PackageX className="w-3.5 h-3.5 text-rose-500" />
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 leading-none">
            <span className="font-semibold text-emerald-700 truncate max-w-[120px]">
              {product.manufacturer || 'Farmácia'}
            </span>
            {product.dosageOrVolume && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="truncate">{product.dosageOrVolume}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="font-bold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1.5 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Action Section */}
        <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through block leading-none mb-0.5">
                  {formatCurrency(product.price)}
                </span>
              )}
              <div className="text-base sm:text-lg font-black text-emerald-900 leading-tight">
                {formatCurrency(currentPrice)}
              </div>
            </div>

            {product.inStock ? (
              <span className="text-[10px] text-emerald-700 font-medium">Em estoque</span>
            ) : (
              <span className="text-[10px] text-slate-400">Esgotado</span>
            )}
          </div>

          {/* Action Row - COMPRAR e CARRINHO */}
          <div className="flex items-center gap-1.5">
            {/* Botão Comprar */}
            <button
              type="button"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                if (!product.inStock) return;
                addToCart(product, 1);
                setIsCheckoutOpen(true);
              }}
              style={{
                backgroundColor: !product.inStock ? '#f1f5f9' : '#047857',
                color: !product.inStock ? '#94a3b8' : '#ffffff',
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-xl transition-all h-9 ${
                !product.inStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white shadow-xs cursor-pointer'
              }`}
              title="Comprar agora"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Comprar</span>
            </button>

            {/* Se já está no carrinho: mostra contador rápido */}
            {cartItem && cartItem.quantity > 0 ? (
              <div
                className="flex items-center justify-between border-2 border-emerald-600 rounded-xl bg-emerald-50 p-0.5 h-9 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                  style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  className="w-6 h-6 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-90 text-white rounded-lg font-black transition-transform cursor-pointer"
                  title="Diminuir"
                >
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="text-xs font-black text-emerald-950 px-1.5 min-w-[16px] text-center">
                  {cartItem.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                  style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  className="w-6 h-6 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-90 text-white rounded-lg font-black transition-transform cursor-pointer"
                  title="Aumentar"
                >
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              /* Botão Carrinho */
              <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                style={{
                  backgroundColor: !product.inStock ? '#f1f5f9' : justAdded ? '#047857' : '#059669',
                  color: !product.inStock ? '#94a3b8' : '#ffffff',
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-xl transition-all h-9 ${
                  !product.inStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs cursor-pointer'
                }`}
                title="Adicionar ao carrinho"
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Adicionado</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>Carrinho</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
