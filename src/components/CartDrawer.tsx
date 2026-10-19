import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  AlertCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    deliverySettings,
    setIsCheckoutOpen,
    hasPrescriptionItemsInCart
  } = usePharmacy();

  if (!isCartOpen) return null;

  const freeShippingThreshold = deliverySettings.freeDeliveryThreshold;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header - Fixed & shrink-0 */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  Seu Carrinho de Compras
                </h3>
                <p className="text-xs text-slate-500">
                  {cartCount} {cartCount === 1 ? 'item adicionado' : 'itens adicionados'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress - shrink-0 */}
          {cart.length > 0 && (
            <div className="shrink-0 px-4 py-3 bg-emerald-50/90 border-b border-emerald-100 text-xs">
              <div className="flex items-center justify-between text-emerald-950 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {isFreeShipping ? (
                    <strong className="text-emerald-800">Parabéns! Você ganhou Frete Grátis 🛵</strong>
                  ) : (
                    <span>
                      Faltam <strong>{formatCurrency(remainingForFreeShipping)}</strong> para frete grátis
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-emerald-700">{progressPercent}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Prescription Alert if relevant - shrink-0 */}
          {hasPrescriptionItemsInCart && (
            <div className="shrink-0 px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-tight text-[11px]">
                Medicamento com receita médica no carrinho. Validação pelo farmacêutico no WhatsApp.
              </p>
            </div>
          )}

          {/* Cart Item List - flex-1 min-h-0 overflow-y-auto */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-700 text-base mb-1">
                  Seu carrinho está vazio
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Navegue pelo nosso catálogo de medicamentos e produtos de cuidados e adicione seus itens.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice = item.product.promotionalPrice || item.product.price;
                const totalItemPrice = unitPrice * item.quantity;

                return (
                  <div key={item.product.id} className="py-3.5 flex gap-3 first:pt-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remover do carrinho"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.product.requiresPrescription && (
                        <span className="inline-block text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded mb-1">
                          Receita Obrigatória
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-emerald-300 rounded-lg bg-emerald-50/50 p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                            className="w-6 h-6 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-md transition-all cursor-pointer"
                            title="Diminuir"
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-xs font-black text-slate-900 px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            style={{ backgroundColor: '#059669', color: '#ffffff' }}
                            className="w-6 h-6 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-md transition-all cursor-pointer"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-900">
                            {formatCurrency(totalItemPrice)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-slate-400">
                              {item.quantity}x {formatCurrency(unitPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Actions - ALWAYS VISIBLE with shrink-0 sticky bottom-0 */}
          {cart.length > 0 && (
            <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 bg-white shadow-xl space-y-3 z-20">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega Estimada</span>
                  <span className="text-emerald-700 font-semibold">
                    {isFreeShipping ? 'Grátis' : `a partir de ${formatCurrency(deliverySettings.deliveryFee)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Parcial</span>
                  <span className="text-emerald-900 text-base">
                    {formatCurrency(cartSubtotal + (isFreeShipping ? 0 : deliverySettings.deliveryFee))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: '#059669', color: '#ffffff' }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <span className="text-white font-black">Concluir Venda e Enviar Pedido</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Envio direto para o WhatsApp da farmácia para validação e entrega.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
