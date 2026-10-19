import React, { useState, useEffect, useRef } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';
import { getWhatsAppUrl } from '../utils/whatsapp';
import confetti from 'canvas-confetti';
import {
  X,
  Truck,
  Store,
  CreditCard,
  QrCode,
  Banknote,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { DEFAULT_PIX_QR_CODE } from '../data/initialData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliverySettings,
    paymentMethods,
    pharmacyInfo,
    createOrder,
    hasPrescriptionItemsInCart
  } = usePharmacy();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [enlargedQrModal, setEnlargedQrModal] = useState<string | null>(null);

  // Form State with LocalStorage memory
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('fvs_customer_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('fvs_customer_phone') || '';
  });
  const [customerCpf, setCustomerCpf] = useState(() => {
    return localStorage.getItem('fvs_customer_cpf') || '';
  });

  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [street, setStreet] = useState(() => localStorage.getItem('fvs_customer_street') || '');
  const [number, setNumber] = useState(() => localStorage.getItem('fvs_customer_num') || '');
  const [complement, setComplement] = useState(() => localStorage.getItem('fvs_customer_comp') || '');
  const [neighborhood, setNeighborhood] = useState(() => localStorage.getItem('fvs_customer_neigh') || '');
  const [city, setCity] = useState(pharmacyInfo.addressCity || 'São Paulo');
  const [referencePoint, setReferencePoint] = useState('');

  const enabledPaymentMethods = paymentMethods.filter((p) => p.enabled);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(
    enabledPaymentMethods[0]?.id || 'pay-pix'
  );
  const [cashChangeFor, setCashChangeFor] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [prescriptionAcknowledged, setPrescriptionAcknowledged] = useState(false);

  // Validation Error state
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (enabledPaymentMethods.length > 0 && !enabledPaymentMethods.some((p) => p.id === selectedPaymentMethodId)) {
      setSelectedPaymentMethodId(enabledPaymentMethods[0].id);
    }
  }, [enabledPaymentMethods, selectedPaymentMethodId]);

  if (!isCheckoutOpen) return null;

  const isFreeDelivery = cartSubtotal >= deliverySettings.freeDeliveryThreshold;
  const deliveryFee = fulfillmentType === 'delivery' ? (isFreeDelivery ? 0 : deliverySettings.deliveryFee) : 0;
  const total = cartSubtotal + deliveryFee;

  const selectedPaymentMethod = paymentMethods.find((p) => p.id === selectedPaymentMethodId);

  const handleSubmitOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    // Validations
    if (!customerName.trim()) {
      setFormError('Por favor, informe seu nome completo para o pedido.');
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      nameInputRef.current?.focus();
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || cleanPhone.length < 8) {
      setFormError('Por favor, informe seu WhatsApp com DDD para contato.');
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      phoneInputRef.current?.focus();
      return;
    }

    if (fulfillmentType === 'delivery') {
      if (!street.trim()) {
        setFormError('Por favor, informe a Rua/Avenida para entrega.');
        return;
      }
      if (!number.trim()) {
        setFormError('Por favor, informe o número da residência.');
        return;
      }
      if (!neighborhood.trim()) {
        setFormError('Por favor, informe o bairro para entrega.');
        return;
      }
    }

    if (hasPrescriptionItemsInCart && !prescriptionAcknowledged) {
      setFormError('Atenção: confirme o aviso de receita médica na caixinha.');
      return;
    }

    // Save for convenience
    try {
      localStorage.setItem('fvs_customer_name', customerName.trim());
      localStorage.setItem('fvs_customer_phone', customerPhone.trim());
      if (customerCpf) localStorage.setItem('fvs_customer_cpf', customerCpf.trim());
      if (street) localStorage.setItem('fvs_customer_street', street.trim());
      if (number) localStorage.setItem('fvs_customer_num', number.trim());
      if (complement) localStorage.setItem('fvs_customer_comp', complement.trim());
      if (neighborhood) localStorage.setItem('fvs_customer_neigh', neighborhood.trim());
    } catch {
      // ignore
    }

    const orderItems = cart.map((item) => {
      const unitPrice = item.product.promotionalPrice || item.product.price;
      return {
        productId: item.product.id,
        productName: item.product.name,
        unitPrice,
        quantity: item.quantity,
        totalItemPrice: unitPrice * item.quantity,
        requiresPrescription: item.product.requiresPrescription,
      };
    });

    const changeVal =
      selectedPaymentMethod?.type === 'cash' && cashChangeFor.trim()
        ? parseFloat(cashChangeFor.replace(',', '.'))
        : undefined;

    // Create Order Record
    const newOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCpf: customerCpf.trim() || undefined,
      fulfillmentType,
      deliveryAddress:
        fulfillmentType === 'delivery'
          ? {
              street: street.trim(),
              number: number.trim(),
              complement: complement.trim() || undefined,
              neighborhood: neighborhood.trim(),
              city: city.trim(),
              referencePoint: referencePoint.trim() || undefined,
            }
          : undefined,
      paymentMethodId: selectedPaymentMethodId,
      paymentMethodName: selectedPaymentMethod?.name || 'Pix',
      cashChangeFor: changeVal,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total,
      notes: notes.trim() || undefined,
      hasPrescriptionItems: hasPrescriptionItemsInCart,
      prescriptionAcknowledged: hasPrescriptionItemsInCart ? prescriptionAcknowledged : true,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Close checkout modal (OrderSuccessModal will show automatically)
    setIsCheckoutOpen(false);

    // Launch WhatsApp
    const waUrl = getWhatsAppUrl(newOrder, pharmacyInfo);
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Browser blocked popup
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-1 sm:p-3 bg-slate-950/75 backdrop-blur-xs overflow-hidden animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full h-[96vh] max-h-[96vh] sm:h-[92vh] sm:max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed & compact */}
        <div className="shrink-0 p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                Finalizar Venda & Enviar pelo WhatsApp
              </h2>
              <p className="text-[11px] text-slate-500">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'} · Total: <strong className="text-emerald-800">{formatCurrency(total)}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Fechar checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Customer Data */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              1. Seus Dados de Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Nome Completo *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  WhatsApp com DDD *
                </label>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="Ex: (11) 98765-4321"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  CPF (Opcional, para nota/cupom fiscal)
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={customerCpf}
                  onChange={(e) => setCustomerCpf(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fulfillment */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              2. Forma de Recebimento
            </h3>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">Entrega em Casa</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {isFreeDelivery ? 'Frete Grátis' : formatCurrency(deliverySettings.deliveryFee)} · {deliverySettings.estimatedDeliveryTime}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Store className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">Retirada na Loja</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Grátis no balcão · {deliverySettings.pickupEstimatedTime}
                </p>
              </button>
            </div>

            {/* Address fields */}
            {fulfillmentType === 'delivery' ? (
              <div className="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Rua das Flores"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      Número *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 120"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jardim Paulista"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
                      Complemento (Apto, Bloco)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Apto 42"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-slate-700">
                <span className="font-semibold text-emerald-900 block mb-0.5">Local da Retirada:</span>
                <p className="text-[11px] text-slate-700 font-medium">
                  {pharmacyInfo.name} · {pharmacyInfo.addressStreet}, {pharmacyInfo.addressNumber} - {pharmacyInfo.addressNeighborhood}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Payment */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              3. Forma de Pagamento
            </h3>

            <div className="space-y-1.5">
              {enabledPaymentMethods.map((method) => {
                const isSelected = selectedPaymentMethodId === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => setSelectedPaymentMethodId(method.id)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {method.type === 'pix' && <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {method.type === 'credit_card' && <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {method.type === 'cash' && <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {method.type === 'payment_link' && <LinkIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        <span className="text-xs font-bold text-slate-900">{method.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{method.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Pix Interactive Payment & QR Code Box */}
            {selectedPaymentMethod?.type === 'pix' && (
              <div className="mt-2.5 p-3 sm:p-4 bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    Pagamento via Pix (QR Code Oficial)
                  </span>
                  <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Total: {formatCurrency(total)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                  {/* QR Code Image */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      onClick={() => setEnlargedQrModal(selectedPaymentMethod.pixQrCodeImage || DEFAULT_PIX_QR_CODE)}
                      className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl border-2 border-slate-200 p-1.5 flex items-center justify-center shadow-xs cursor-pointer hover:border-emerald-500 transition-colors"
                      title="Clique para ampliar o QR Code"
                    >
                      <img
                        src={selectedPaymentMethod.pixQrCodeImage || DEFAULT_PIX_QR_CODE}
                        alt="QR Code Pix"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnlargedQrModal(selectedPaymentMethod.pixQrCodeImage || DEFAULT_PIX_QR_CODE)}
                      className="text-[10px] text-emerald-700 font-bold block text-center mt-1 hover:underline cursor-pointer"
                    >
                      🔍 Clique para Ampliar
                    </button>
                  </div>

                  {/* Pix details & Copy Key */}
                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Chave Pix ({selectedPaymentMethod.pixKeyType?.toUpperCase() || 'CNPJ'}):
                      </span>
                      <span className="font-mono text-xs font-extrabold text-slate-900 break-all select-all block bg-slate-50 px-2 py-1 rounded border border-slate-200 mt-0.5">
                        {selectedPaymentMethod.pixKey || pharmacyInfo.cnpj}
                      </span>
                    </div>

                    {selectedPaymentMethod.pixReceiverName && (
                      <p className="text-[11px] text-slate-600">
                        Beneficiário: <strong className="text-slate-800">{selectedPaymentMethod.pixReceiverName}</strong>
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const key = selectedPaymentMethod.pixKey || pharmacyInfo.cnpj;
                        navigator.clipboard.writeText(key);
                        setCopiedPixKey(true);
                        setTimeout(() => setCopiedPixKey(false), 2000);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      {copiedPixKey ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                      <span className="text-white font-bold">{copiedPixKey ? 'Chave Copiada com Sucesso!' : 'Copiar Chave Pix'}</span>
                    </button>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      ✓ Abra o aplicativo do seu banco, escolha <strong>Pix</strong> e aponte a câmera para o QR Code ou cole a chave acima.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod?.type === 'cash' && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Precisa de troco? Para quanto?
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold text-xs">R$</span>
                  <input
                    type="text"
                    placeholder="Ex: 50,00 ou 100,00"
                    value={cashChangeFor}
                    onChange={(e) => setCashChangeFor(e.target.value)}
                    className="w-36 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Prescription Alert Checkbox */}
          {hasPrescriptionItemsInCart && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Medicamento com Receita Médica no Pedido</span>
              </div>
              <label className="flex items-start gap-2 pt-0.5 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={prescriptionAcknowledged}
                  onChange={(e) => setPrescriptionAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-amber-950">
                  Estou ciente e me comprometo a enviar a foto da receita médica pelo WhatsApp.
                </span>
              </label>
            </div>
          )}

          {/* Products Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-1.5">Itens Escolhidos ({cart.length}):</span>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {cart.map((item) => {
                const uPrice = item.product.promotionalPrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex justify-between items-center text-[11px] text-slate-600">
                    <span className="truncate max-w-[260px]">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrency(uPrice * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Bottom Bar - ALWAYS VISIBLE, STICKY & HIGH CONTRAST */}
        <div className="shrink-0 p-3 sm:p-3.5 bg-slate-50 border-t-2 border-emerald-500 z-30 shadow-xl">
          {formError && (
            <div className="mb-2 p-2.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 font-semibold">
              {fulfillmentType === 'delivery' ? 'Entrega:' : 'Retirada:'}{' '}
              <strong className="text-emerald-700">
                {fulfillmentType === 'delivery' ? (isFreeDelivery ? 'Grátis' : formatCurrency(deliveryFee)) : 'Grátis'}
              </strong>
            </span>
            <div className="text-right flex items-baseline gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-900 leading-none">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmitOrder()}
            style={{ backgroundColor: '#059669', color: '#ffffff', minHeight: '48px' }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0 text-white" />
            <span className="text-white font-black">Confirmar e Enviar Pedido via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      {enlargedQrModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setEnlargedQrModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900">QR Code Pix para Pagamento</span>
              <button
                type="button"
                onClick={() => setEnlargedQrModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-inner flex items-center justify-center mb-3">
              <img
                src={enlargedQrModal}
                alt="QR Code Pix"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-xs font-bold text-emerald-900 mb-3">
              Total do Pedido: {formatCurrency(total)}
            </div>
            <button
              type="button"
              onClick={() => setEnlargedQrModal(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
