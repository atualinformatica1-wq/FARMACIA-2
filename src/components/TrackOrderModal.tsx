import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  X,
  Search,
  ClipboardList,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Store,
  AlertCircle,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { OrderStatus } from '../types/pharmacy';
import { DEFAULT_PIX_QR_CODE } from '../data/initialData';

export const TrackOrderModal: React.FC = () => {
  const { trackOrderModalOpen, setTrackOrderModalOpen, orders, pharmacyInfo, paymentMethods } = usePharmacy();
  const [searchInput, setSearchInput] = useState('');
  const [searchedId, setSearchedId] = useState<string | null>(null);

  if (!trackOrderModalOpen) return null;

  const foundOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === (searchedId || searchInput).trim().toLowerCase() ||
      o.id === (searchedId || searchInput).trim()
  );

  const getStatusStep = (status: OrderStatus, fulfillment: 'delivery' | 'pickup') => {
    switch (status) {
      case 'pending':
        return 1;
      case 'preparing':
      case 'waiting_payment':
        return 2;
      case 'out_for_delivery':
      case 'ready_for_pickup':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const getStatusLabel = (status: OrderStatus, fulfillment: 'delivery' | 'pickup') => {
    switch (status) {
      case 'pending':
        return { title: 'Pedido Recebido', desc: 'Aguardando validação da equipe farmacêutica' };
      case 'preparing':
        return { title: 'Em Separação', desc: 'Farmacêutico separando e conferindo os itens' };
      case 'waiting_payment':
        return { title: 'Aguardando Pagamento', desc: 'Aguardando envio ou confirmação do comprovante' };
      case 'out_for_delivery':
        return { title: 'Saiu para Entrega', desc: 'Motoboy a caminho do seu endereço' };
      case 'ready_for_pickup':
        return { title: 'Pronto para Retirada', desc: 'Seu pedido já pode ser retirado no balcão' };
      case 'completed':
        return { title: 'Concluído', desc: 'Pedido entregue com sucesso' };
      case 'cancelled':
        return { title: 'Cancelado', desc: 'Pedido cancelado' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Acompanhar Pedido
              </h3>
              <p className="text-xs text-slate-500">
                Consulte o status do seu pedido em tempo real
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setTrackOrderModalOpen(false);
              setSearchedId(null);
            }}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Digite o número do pedido (ex: FVS-8492)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ex: FVS-8492"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSearchedId(searchInput);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none uppercase font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchedId(searchInput)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Quick Click Recent Orders */}
          {orders.length > 0 && !foundOrder && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Pedidos Registrados Neste Dispositivo:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {orders.slice(0, 4).map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSearchInput(ord.orderNumber);
                      setSearchedId(ord.orderNumber);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <strong className="font-mono text-slate-800">#{ord.orderNumber}</strong>
                      <span className="text-slate-500 ml-2">({ord.customerName})</span>
                    </div>
                    <span className="font-semibold text-emerald-800">{formatCurrency(ord.total)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Order Details Found */}
          {foundOrder ? (
            <div className="space-y-4 pt-2">
              {/* Order Status Badge & Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status Atual</span>
                    <h4 className="text-sm font-bold text-emerald-900">
                      {getStatusLabel(foundOrder.status, foundOrder.fulfillmentType).title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(foundOrder.createdAt)}</span>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {getStatusLabel(foundOrder.status, foundOrder.fulfillmentType).desc}
                </p>

                {/* Visual Progress Steps */}
                {foundOrder.status !== 'cancelled' && (
                  <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-[10px] font-semibold">
                    {[
                      { step: 1, label: 'Recebido' },
                      { step: 2, label: 'Em Separação' },
                      {
                        step: 3,
                        label: foundOrder.fulfillmentType === 'delivery' ? 'A Caminho' : 'Pronto',
                      },
                      { step: 4, label: 'Concluído' },
                    ].map(({ step, label }) => {
                      const currentStep = getStatusStep(foundOrder.status, foundOrder.fulfillmentType);
                      const isDone = currentStep >= step;
                      return (
                        <div key={step} className="flex flex-col items-center gap-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {isDone ? '✓' : step}
                          </div>
                          <span className={isDone ? 'text-emerald-800' : 'text-slate-400'}>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-slate-800 mb-2">Itens do Pedido:</div>
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {foundOrder.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center text-slate-700">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-semibold">{formatCurrency(item.totalItemPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total</span>
                  <span className="text-emerald-900">{formatCurrency(foundOrder.total)}</span>
                </div>
              </div>

              {/* Fulfillment & Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Recebimento
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {foundOrder.fulfillmentType === 'delivery' ? '🛵 Entrega em Domicílio' : '🏪 Retirada na Loja'}
                  </span>
                  {foundOrder.deliveryAddress && (
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      {foundOrder.deliveryAddress.street}, {foundOrder.deliveryAddress.number} - {foundOrder.deliveryAddress.neighborhood}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Forma de Pagamento
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {foundOrder.paymentMethodName}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                    {foundOrder.paymentStatus === 'paid'
                      ? '✓ Confirmado pelo atendente'
                      : 'Pagamento na entrega / Em conferência'}
                  </span>
                </div>
              </div>

              {/* If Pix and not yet confirmed as paid */}
              {(() => {
                const pixCfg = paymentMethods.find((p) => p.id === foundOrder.paymentMethodId);
                const isPix = pixCfg?.type === 'pix' || foundOrder.paymentMethodId === 'pay-pix';
                if (!isPix || foundOrder.paymentStatus === 'paid') return null;
                return (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={pixCfg?.pixQrCodeImage || DEFAULT_PIX_QR_CODE}
                        alt="QR Code Pix"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold text-emerald-950 block">Pagar com Pix:</span>
                      <span className="font-mono text-[11px] text-slate-800 font-semibold block truncate">
                        Chave: {pixCfg?.pixKey || pharmacyInfo.cnpj}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Envie o comprovante no WhatsApp da farmácia para validação.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Talk to Pharmacy on WhatsApp */}
              <a
                href={`https://wa.me/${pharmacyInfo.whatsappNumber}?text=${encodeURIComponent(
                  `Olá! Gostaria de informações sobre o meu pedido #${foundOrder.orderNumber}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com o Farmacêutico sobre este Pedido</span>
              </a>
            </div>
          ) : searchedId ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-800 mb-1">Pedido não encontrado</p>
              <p>Verifique se o código do pedido está correto (ex: FVS-8492).</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
