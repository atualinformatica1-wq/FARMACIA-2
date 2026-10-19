import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PaymentMethodConfig, PaymentType } from '../../types/pharmacy';
import {
  CreditCard,
  QrCode,
  Banknote,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

import { compressImage } from '../../utils/imageCompressor';

export const PaymentsTab: React.FC = () => {
  const { paymentMethods, updatePaymentMethod, addPaymentMethod, deletePaymentMethod } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodConfig | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<PaymentType>('pix');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'>('cnpj');
  const [pixReceiverName, setPixReceiverName] = useState('');
  const [pixQrCodeImage, setPixQrCodeImage] = useState('');
  const [paymentLinkUrl, setPaymentLinkUrl] = useState('');
  const [acceptsChangeForCash, setAcceptsChangeForCash] = useState(false);

  // State for viewing QR code image enlarged
  const [previewQrModalImage, setPreviewQrModalImage] = useState<string | null>(null);
  const [quickUploadSuccessId, setQuickUploadSuccessId] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleCardQrFileUpload = async (method: PaymentMethodConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.85);
        await updatePaymentMethod({
          ...method,
          pixQrCodeImage: compressed,
        });
        setQuickUploadSuccessId(method.id);
        setSaveSuccessMessage('Imagem do QR Code Pix salva com sucesso no banco de dados!');
        setTimeout(() => {
          setQuickUploadSuccessId(null);
          setSaveSuccessMessage(null);
        }, 3500);
      } catch (err) {
        console.error('Falha ao processar imagem:', err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingMethod(null);
    setName('');
    setType('pix');
    setDescription('');
    setInstructions('');
    setEnabled(true);
    setPixKey('');
    setPixKeyType('cnpj');
    setPixReceiverName('');
    setPixQrCodeImage('');
    setPaymentLinkUrl('');
    setAcceptsChangeForCash(false);
    setIsModalOpen(true);
  };

  const openEditModal = (method: PaymentMethodConfig) => {
    setEditingMethod(method);
    setName(method.name);
    setType(method.type);
    setDescription(method.description);
    setInstructions(method.instructions);
    setEnabled(method.enabled);
    setPixKey(method.pixKey || '');
    setPixKeyType(method.pixKeyType || 'cnpj');
    setPixReceiverName(method.pixReceiverName || '');
    setPixQrCodeImage(method.pixQrCodeImage || '');
    setPaymentLinkUrl(method.paymentLinkUrl || '');
    setAcceptsChangeForCash(!!method.acceptsChangeForCash);
    setIsModalOpen(true);
  };

  const handleQrCodeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.85);
        setPixQrCodeImage(compressed);
      } catch (err) {
        console.error('Erro ao processar QR Code:', err);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      type,
      description: description.trim(),
      instructions: instructions.trim(),
      enabled,
      pixKey: type === 'pix' ? pixKey.trim() : undefined,
      pixKeyType: type === 'pix' ? pixKeyType : undefined,
      pixReceiverName: type === 'pix' ? pixReceiverName.trim() : undefined,
      pixQrCodeImage: type === 'pix' && pixQrCodeImage ? pixQrCodeImage.trim() : undefined,
      paymentLinkUrl: type === 'payment_link' ? paymentLinkUrl.trim() : undefined,
      acceptsChangeForCash: type === 'cash' ? acceptsChangeForCash : undefined,
    };

    if (editingMethod) {
      updatePaymentMethod({
        ...payload,
        id: editingMethod.id,
      });
      setSaveSuccessMessage(`Forma de pagamento "${payload.name}" salva com sucesso!`);
    } else {
      addPaymentMethod(payload);
      setSaveSuccessMessage(`Nova forma de pagamento "${payload.name}" cadastrada com sucesso!`);
    }
    setTimeout(() => setSaveSuccessMessage(null), 3500);

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {saveSuccessMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top action row */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Formas de Pagamento
          </h3>
          <p className="text-xs text-slate-500">
            Configure opções de Pix (com upload de QR Code), cartão na entrega, dinheiro e links
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Forma de Pagamento</span>
        </button>
      </div>

      {/* Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          return (
            <div
              key={method.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                method.enabled ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 bg-slate-50/50 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {method.type === 'pix' && <QrCode className="w-4 h-4" />}
                      {method.type === 'credit_card' && <CreditCard className="w-4 h-4" />}
                      {method.type === 'cash' && <Banknote className="w-4 h-4" />}
                      {method.type === 'payment_link' && <LinkIcon className="w-4 h-4" />}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{method.name}</h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      method.enabled ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {method.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3">{method.description}</p>

                {/* Specifics */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-3">
                  {method.type === 'pix' && (
                    <>
                      <div>
                        Chave Pix: <strong className="font-mono text-slate-800">{method.pixKey || 'Não configurada'}</strong> ({method.pixKeyType})
                      </div>
                      {method.pixReceiverName && (
                        <div>Beneficiário: <strong className="text-slate-800">{method.pixReceiverName}</strong></div>
                      )}

                      {/* Pix QR Code Upload & Display on Card */}
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                            Imagem do QR Code Pix:
                          </span>
                          {quickUploadSuccessId === method.id && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                              ✓ QR Code Atualizado!
                            </span>
                          )}
                        </div>

                        {method.pixQrCodeImage ? (
                          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-200">
                            <button
                              type="button"
                              onClick={() => setPreviewQrModalImage(method.pixQrCodeImage || null)}
                              className="relative group w-14 h-14 bg-slate-50 rounded-lg p-1 border border-slate-200 shrink-0 overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors"
                              title="Clique para ampliar o QR Code"
                            >
                              <img
                                src={method.pixQrCodeImage}
                                alt="QR Code Pix"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity">
                                Ver
                              </div>
                            </button>

                            <div className="flex-1 min-w-0">
                              <span className="text-[11px] font-bold text-emerald-800 block leading-tight">
                                QR Code Personalizado Ativo
                              </span>
                              <span className="text-[10px] text-slate-500 block mb-1.5">
                                Exibido ao cliente no checkout e no recibo Pix.
                              </span>

                              <div className="flex items-center gap-2">
                                <label className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 cursor-pointer transition-colors">
                                  <Upload className="w-3 h-3" />
                                  <span>Trocar Imagem</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleCardQrFileUpload(method, e)}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Deseja remover a imagem personalizada deste QR Code?')) {
                                      updatePaymentMethod({ ...method, pixQrCodeImage: undefined });
                                    }
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Remover imagem"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white p-2.5 rounded-xl border-2 border-dashed border-emerald-300 text-center">
                            <p className="text-[10px] text-slate-500 mb-1.5">
                              Nenhuma imagem de QR Code enviada para esta conta.
                            </p>
                            <label className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Subir Imagem do QR Code Pix</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCardQrFileUpload(method, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {method.type === 'payment_link' && (
                    <div className="truncate">
                      Link URL: <strong className="text-emerald-700 font-mono">{method.paymentLinkUrl || 'Sem link configurado'}</strong>
                    </div>
                  )}
                  {method.type === 'cash' && (
                    <div>Aceita cálculo de troco: <strong className="text-slate-800">{method.acceptsChangeForCash ? 'Sim' : 'Não'}</strong></div>
                  )}
                  {method.instructions && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      Instruções: {method.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => updatePaymentMethod({ ...method, enabled: !method.enabled })}
                  className={`font-semibold text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    method.enabled ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {method.enabled ? 'Desativar' : 'Ativar'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(method)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Editar forma de pagamento"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja excluir a forma de pagamento "${method.name}"?`)) {
                        deletePaymentMethod(method.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingMethod ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tipo de Pagamento *
                  </label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pix">Pix Instantâneo</option>
                    <option value="credit_card">Cartão na Entrega / Retirada</option>
                    <option value="cash">Dinheiro em Espécie</option>
                    <option value="payment_link">Link de Pagamento Online</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome de Exibição *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pix Instantâneo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Breve Descrição para o Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aprovação imediata com chave ou QR Code"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Pix specific configuration */}
              {type === 'pix' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="font-bold text-emerald-950 block text-xs">Configurações do Pix:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tipo de Chave</label>
                      <select
                        value={pixKeyType}
                        onChange={(e: any) => setPixKeyType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                      >
                        <option value="cnpj">CNPJ</option>
                        <option value="cpf">CPF</option>
                        <option value="email">E-mail</option>
                        <option value="telefone">Celular</option>
                        <option value="aleatoria">Chave Aleatória</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Chave Pix</label>
                      <input
                        type="text"
                        placeholder="Ex: 12.345.678/0001-90"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Nome do Titular / Beneficiário</label>
                    <input
                      type="text"
                      placeholder="Ex: Farmácia Vida & Saúde Ltda"
                      value={pixReceiverName}
                      onChange={(e) => setPixReceiverName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
                    />
                  </div>

                  {/* QR Code Image Upload Area */}
                  <div className="pt-2 border-t border-emerald-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-950">
                        Imagem do QR Code Pix (Banco / App)
                      </span>
                      {pixQrCodeImage && (
                        <button
                          type="button"
                          onClick={() => setPixQrCodeImage('')}
                          className="text-rose-600 hover:text-rose-800 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remover Imagem
                        </button>
                      )}
                    </div>

                    {pixQrCodeImage ? (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center gap-3">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                          <img
                            src={pixQrCodeImage}
                            alt="QR Code Pix"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            QR Code Oficial Carregado!
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Esta imagem será exibida para o cliente escanear e pagar via Pix.
                          </p>
                          <label className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Substituir imagem</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrCodeFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-xl border-2 border-dashed border-emerald-300 text-center space-y-2">
                        <div className="flex items-center justify-center">
                          <label className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-colors shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-white" />
                            <span>Subir Imagem do QR Code (do seu Banco)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrCodeFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Envie um print ou foto do QR Code Pix gerado na conta bancária da sua farmácia.
                        </p>
                        <div className="pt-1 text-[10px] text-slate-400">
                          Ou cole o link direto da imagem:
                          <input
                            type="url"
                            placeholder="https://... (URL da imagem)"
                            value={pixQrCodeImage}
                            onChange={(e) => setPixQrCodeImage(e.target.value)}
                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Link specific */}
              {type === 'payment_link' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-semibold text-slate-700">Link de Checkout / Gateway URL</label>
                  <input
                    type="url"
                    placeholder="https://pagamento.exemplo.com.br/checkout"
                    value={paymentLinkUrl}
                    onChange={(e) => setPaymentLinkUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-[11px]"
                  />
                </div>
              )}

              {/* Cash specific */}
              {type === 'cash' && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptsChangeForCash}
                      onChange={(e) => setAcceptsChangeForCash(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Perguntar ao cliente se precisa de troco no pedido</span>
                  </label>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instruções para o Cliente (exibidas após confirmar o pedido)
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções de pagamento..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Disponível para seleção no checkout</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Zoom Preview Modal */}
      {previewQrModalImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewQrModalImage(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-800">Visualização do QR Code Pix</span>
              <button
                type="button"
                onClick={() => setPreviewQrModalImage(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center mb-4">
              <img
                src={previewQrModalImage}
                alt="QR Code Pix"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Esta é a imagem oficial que seus clientes verão na finalização da compra e no comprovante.
            </p>

            <button
              type="button"
              onClick={() => setPreviewQrModalImage(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
