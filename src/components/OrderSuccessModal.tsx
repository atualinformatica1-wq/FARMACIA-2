import React, { useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getWhatsAppUrl, buildWhatsAppOrderMessage } from '../utils/whatsapp';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  CreditCard,
  Banknote,
  Link as LinkIcon,
  X,
  ExternalLink,
  Truck,
  Store,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { DEFAULT_PIX_QR_CODE } from '../data/initialData';

export const OrderSuccessModal: React.FC = () => {
  const { lastCreatedOrder, setLastCreatedOrder, pharmacyInfo, paymentMethods, setTrackOrderModalOpen } =
    usePharmacy();

  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [zoomQrCode, setZoomQrCode] = useState<string | null>(null);

  if (!lastCreatedOrder) return null;

  const orderPaymentConfig = paymentMethods.find((p) => p.id === lastCreatedOrder.paymentMethodId);
  const isPix = orderPaymentConfig?.type === 'pix' || lastCreatedOrder.paymentMethodId === 'pay-pix';
  const isCard = orderPaymentConfig?.type === 'credit_card' || orderPaymentConfig?.type === 'debit_card';
  const isCash = orderPaymentConfig?.type === 'cash';
  const isLink = orderPaymentConfig?.type === 'payment_link';

  const waUrl = getWhatsAppUrl(lastCreatedOrder, pharmacyInfo);

  const handleCopyPix = () => {
    const key = orderPaymentConfig?.pixKey || pharmacyInfo.cnpj;
    navigator.clipboard.writeText(key);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCopyMessage = () => {
    const msg = buildWhatsAppOrderMessage(lastCreatedOrder, pharmacyInfo);
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col my-auto shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top green success banner */}
        <div className="shrink-0 bg-emerald-600 text-white p-5 sm:p-6 text-center relative">
          <button
            onClick={() => setLastCreatedOrder(null)}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-emerald-700/60 hover:bg-emerald-700 p-1.5 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md animate-in zoom-in-75">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-emerald-100 uppercase tracking-widest text-[11px] font-bold">
            Pedido Registrado com Sucesso
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
            Pedido #{lastCreatedOrder.orderNumber}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            O pedido foi gerado e enviado para conferência no WhatsApp da farmácia.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick Actions: Open WhatsApp */}
          <div className="space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              className="w-full hover:bg-[#20ba5a] active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white fill-white/20" />
              <span>Abrir Conversa no WhatsApp</span>
            </a>

            <button
              onClick={handleCopyMessage}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? 'Mensagem do pedido copiada!' : 'Copiar texto completo do pedido'}</span>
            </button>
          </div>

          {/* Payment Instructions Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                {isPix && <QrCode className="w-4 h-4 text-emerald-600" />}
                {isCard && <CreditCard className="w-4 h-4 text-emerald-600" />}
                {isCash && <Banknote className="w-4 h-4 text-emerald-600" />}
                {isLink && <LinkIcon className="w-4 h-4 text-emerald-600" />}
                Instruções de Pagamento ({lastCreatedOrder.paymentMethodName})
              </span>
              <span className="text-xs font-extrabold text-emerald-800">
                {formatCurrency(lastCreatedOrder.total)}
              </span>
            </div>

            {/* Pix Specific Payment Box */}
            {isPix && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Realize a transferência Pix para a chave abaixo. Após o pagamento, basta anexar o comprovante na conversa do WhatsApp.
                </p>

                {/* Pix Key and Copy */}
                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-2.5">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Chave Pix ({orderPaymentConfig?.pixKeyType || 'CNPJ'}):
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 truncate block">
                      {orderPaymentConfig?.pixKey || pharmacyInfo.cnpj}
                    </span>
                    {orderPaymentConfig?.pixReceiverName && (
                      <span className="text-[11px] text-slate-500 block">
                        Beneficiário: {orderPaymentConfig.pixReceiverName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>

                {/* Official Pix QR Code Image Box */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 bg-white rounded-xl border border-emerald-300 shadow-2xs">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      onClick={() => setZoomQrCode(orderPaymentConfig?.pixQrCodeImage || DEFAULT_PIX_QR_CODE)}
                      className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl border-2 border-slate-200 p-1 flex items-center justify-center cursor-pointer hover:border-emerald-500 shadow-xs transition-colors"
                      title="Clique para ampliar o QR Code"
                    >
                      <img
                        src={orderPaymentConfig?.pixQrCodeImage || DEFAULT_PIX_QR_CODE}
                        alt="QR Code Pix"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setZoomQrCode(orderPaymentConfig?.pixQrCodeImage || DEFAULT_PIX_QR_CODE)}
                      className="text-[10px] text-emerald-700 font-bold block text-center mt-1 hover:underline cursor-pointer"
                    >
                      🔍 Clique para Ampliar
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                    <strong className="text-slate-900 block text-xs sm:text-sm">
                      QR Code Pix da Farmácia
                    </strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Aponte a câmera do aplicativo do seu banco para o QR Code ao lado ou use o botão <strong>Copiar</strong> para efetuar a transferência.
                    </p>
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                      ✓ Após pagar, envie o comprovante na conversa do WhatsApp para agilizar o envio!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card on Delivery Box */}
            {isCard && (
              <div className="text-xs text-slate-600 space-y-2">
                <p className="leading-relaxed">
                  {orderPaymentConfig?.instructions ||
                    'O entregador levará a maquininha até seu endereço. Aceitamos cartões de crédito, débito e pagamentos por aproximação (NFC).'}
                </p>
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg font-medium text-[11px]">
                  ✓ Pagamento realizado de forma segura no momento do recebimento.
                </div>
              </div>
            )}

            {/* Cash Box */}
            {isCash && (
              <div className="text-xs text-slate-600 space-y-2">
                <p className="leading-relaxed">
                  Pagamento em dinheiro na entrega ou retirada.
                </p>
                {lastCreatedOrder.cashChangeFor ? (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold">
                    Troco solicitado para: {formatCurrency(lastCreatedOrder.cashChangeFor)} (Troco a receber:{' '}
                    {formatCurrency(Math.max(0, lastCreatedOrder.cashChangeFor - lastCreatedOrder.total))})
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500">
                    Nenhum troco solicitado (pagamento com valor exato).
                  </div>
                )}
              </div>
            )}

            {/* Payment Link Box */}
            {isLink && (
              <div className="text-xs text-slate-600 space-y-3">
                <p className="leading-relaxed">
                  {orderPaymentConfig?.instructions ||
                    'Clique no botão abaixo para efetuar o pagamento via link seguro de cartão de crédito.'}
                </p>
                {orderPaymentConfig?.paymentLinkUrl && (
                  <a
                    href={orderPaymentConfig.paymentLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                  >
                    <span>Acessar Link de Pagamento</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Prescription Warning if applicable */}
          {lastCreatedOrder.hasPrescriptionItems && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5">Lembrete de Receita Médica</strong>
                Não se esqueça de enviar a foto da receita no WhatsApp para que o farmacêutico possa validar e liberar os medicamentos controlados do seu pedido.
              </div>
            </div>
          )}

          {/* Delivery & Pharmacy Summary */}
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {lastCreatedOrder.fulfillmentType === 'delivery'
                ? `Previsão: ${pharmacyInfo.addressCity} (${formatDate(lastCreatedOrder.createdAt)})`
                : 'Retirada no balcão da farmácia'}
            </span>
            <button
              onClick={() => {
                setLastCreatedOrder(null);
                setTrackOrderModalOpen(true);
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              Acompanhar status deste pedido
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={() => setLastCreatedOrder(null)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Fechar e Continuar Navegando na Farmácia
          </button>
        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      {zoomQrCode && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setZoomQrCode(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900">QR Code Pix para Pagamento</span>
              <button
                type="button"
                onClick={() => setZoomQrCode(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl border-2 border-emerald-400 shadow-inner flex items-center justify-center mb-3">
              <img
                src={zoomQrCode}
                alt="QR Code Pix"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-xs font-bold text-emerald-900 mb-3">
              Pedido #{lastCreatedOrder.orderNumber} · Total: {formatCurrency(lastCreatedOrder.total)}
            </div>
            <button
              type="button"
              onClick={() => setZoomQrCode(null)}
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
