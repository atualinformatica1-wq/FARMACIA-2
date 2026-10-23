import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Package,
  Building2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCartOpen, setIsCheckoutOpen } = usePharmacy();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!quickViewProduct) return null;

  const currentPrice = quickViewProduct.promotionalPrice || quickViewProduct.price;
  const hasDiscount = !!quickViewProduct.promotionalPrice && quickViewProduct.promotionalPrice < quickViewProduct.price;
  const discountPercent = hasDiscount
    ? Math.round(((quickViewProduct.price - quickViewProduct.promotionalPrice!) / quickViewProduct.price) * 100)
    : 0;

  const handleAdd = (openCart = true) => {
    if (!quickViewProduct.inStock) return;
    addToCart(quickViewProduct, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      if (openCart) {
        setQuickViewProduct(null);
        setIsCartOpen(true);
      }
    }, 500);
  };

  const handleBuyNow = () => {
    if (!quickViewProduct.inStock) return;
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={() => setQuickViewProduct(null)}
      className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="shrink-0 p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
              Detalhes do Produto
            </span>
            <span className="text-xs text-slate-500 truncate hidden sm:inline">
              {quickViewProduct.manufacturer || 'Farmácia'}
            </span>
          </div>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="w-8 h-8 rounded-lg bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            {/* Image Box */}
            <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-4 relative border border-slate-100 h-48 sm:h-64">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />

              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs">
                  -{discountPercent}% OFF
                </span>
              )}

              {quickViewProduct.isFeatured && (
                <span className="absolute top-3 right-3 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Destaque
                </span>
              )}
            </div>

            {/* Title & Specs */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {quickViewProduct.manufacturer || 'Farmácia'}
                </span>
                {quickViewProduct.dosageOrVolume && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{quickViewProduct.dosageOrVolume}</span>
                  </>
                )}
              </div>

              <h2 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h2>

              {quickViewProduct.activeIngredient && (
                <div className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono inline-block">
                  Princípio Ativo: <strong className="text-slate-900">{quickViewProduct.activeIngredient}</strong>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                {hasDiscount && (
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    {formatCurrency(quickViewProduct.price)}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black text-emerald-900">
                  {formatCurrency(currentPrice)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">/ un.</span>
              </div>

              {/* Stock Status */}
              <div className="text-xs">
                {quickViewProduct.inStock ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Em estoque para entrega rápida ou retirada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <Package className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Produto indisponível no momento</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prescription Warning Box if applicable */}
          {quickViewProduct.requiresPrescription && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Medicamento com Retenção de Receita Médica</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Este medicamento requer apresentação da receita médica válida. Envie a foto pelo WhatsApp após confirmar o pedido para validação pelo farmacêutico.
              </p>
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descrição do Produto:
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>
        </div>

        {/* Action Bottom Bar - ALWAYS VISIBLE AND PINNED TO BOTTOM */}
        <div className="shrink-0 p-3 sm:p-4 bg-slate-50 border-t border-slate-200 z-30">
          {quickViewProduct.inStock ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border-2 border-emerald-600 rounded-xl bg-white h-11 px-1.5 shrink-0 w-32 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ backgroundColor: 'var(--color-emerald-600, #059669)', color: '#ffffff' }}
                    className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center font-bold disabled:opacity-40 transition-colors cursor-pointer"
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-sm font-black text-slate-900 px-2 min-w-[24px] text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ backgroundColor: 'var(--color-emerald-600, #059669)', color: '#ffffff' }}
                    className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Botão AO LADO DE QUANTIDADE (Add to Cart) */}
                <button
                  type="button"
                  onClick={() => handleAdd(true)}
                  style={{ backgroundColor: 'var(--color-emerald-600, #059669)', color: '#ffffff', minHeight: '44px' }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black h-11 px-3 sm:px-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0 text-white" />
                  <span className="text-white font-black">{addedSuccess ? 'Adicionado!' : 'Adicionar ao Carrinho'}</span>
                  <span className="font-bold text-white/95">
                    ({formatCurrency(currentPrice * quantity)})
                  </span>
                </button>
              </div>

              {/* Botão Concluir no WhatsApp */}
              <button
                type="button"
                onClick={handleBuyNow}
                style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '44px' }}
                className="flex bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold h-11 px-4 rounded-xl text-xs sm:text-sm items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                title="Concluir venda agora e enviar pedido pelo WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-bold">Concluir no WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-slate-200/80 rounded-xl text-center text-xs font-semibold text-slate-600">
              Produto indisponível para pedidos no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
