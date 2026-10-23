import React, { useState, useEffect } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { THEME_PRESETS, ThemeColorPreset, applyTheme } from '../../utils/theme';
import {
  Store,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  KeyRound,
  RotateCcw,
  AlertTriangle,
  Palette,
  Sparkles
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    pharmacyInfo,
    updatePharmacyInfo,
    changeAdminPassword,
    resetToDefaults
  } = usePharmacy();

  const [formData, setFormData] = useState(pharmacyInfo);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(pharmacyInfo);
  }, [pharmacyInfo]);

  const handleChange = (field: keyof typeof pharmacyInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPreset = (preset: typeof THEME_PRESETS[0]) => {
    const updated = {
      ...formData,
      themePreset: preset.id,
      primaryColorHex: preset.primaryHex,
    };
    setFormData(updated);
    // Instant preview across the app
    applyTheme(preset.id, preset.primaryHex);
  };

  const handleCustomColorChange = (hex: string) => {
    const updated = {
      ...formData,
      primaryColorHex: hex,
    };
    setFormData(updated);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      applyTheme(formData.themePreset, hex);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePharmacyInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setPasswordFeedback('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback('As senhas não coincidem.');
      return;
    }
    changeAdminPassword(newPassword);
    setPasswordFeedback('Senha alterada com sucesso!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Informações da farmácia atualizadas com sucesso!</span>
        </div>
      )}

      {/* Main Pharmacy Info Form */}
      <form onSubmit={handleSaveInfo} className="space-y-6">
        {/* Identidade Visual & Cores da Loja */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Identidade Visual & Cores da Loja
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Novo
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Personalize a cor predominante do site (botões, carrinho, badges, destaques e preços)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Preview em tempo real</span>
            </div>
          </div>

          {/* Presets Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Temas Pré-definidos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected =
                  formData.themePreset === preset.id &&
                  (!formData.primaryColorHex || formData.primaryColorHex.toLowerCase() === preset.primaryHex.toLowerCase());

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 group ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm bg-slate-50/80'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-7 h-7 rounded-lg shadow-sm border border-black/10 flex items-center justify-center"
                        style={{ backgroundColor: preset.primaryHex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                          Ativo
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5" title={preset.description}>
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Selector & Live Preview Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Custom Hex Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Ou use uma Cor Personalizada (Hexadecimal)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColorHex || '#059669'}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shrink-0"
                  title="Clique para escolher qualquer cor personalizada"
                />
                <input
                  type="text"
                  placeholder="#059669"
                  maxLength={7}
                  value={formData.primaryColorHex || ''}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleSelectPreset(THEME_PRESETS[0])}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Restaurar Verde Padrão
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Digite o código hexadecimal da sua marca ou use o seletor acima para testar qualquer cor.
              </p>
            </div>

            {/* Live Visual Element Preview */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">
                Demonstração dos Elementos na Loja:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Botão de Exemplo */}
                <button
                  type="button"
                  style={{ backgroundColor: 'var(--color-emerald-600, #059669)' }}
                  className="text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 pointer-events-none"
                >
                  <Store className="w-3.5 h-3.5 text-white" />
                  <span>Botão Principal</span>
                </button>

                {/* Badge de Exemplo */}
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black px-2.5 py-1 rounded-full">
                  Badge de Oferta
                </span>

                {/* Preço de Exemplo */}
                <span className="text-emerald-700 font-black text-sm">
                  R$ 39,90
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificação & Contatos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Identificação e Contato da Farmácia
              </h3>
              <p className="text-xs text-slate-500">
                Nome, CNPJ, telefone e número de WhatsApp para recebimento dos pedidos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nome da Farmácia *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Slogan / Subtítulo
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Telefone Fixo / Central
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp de Recebimento de Pedidos (DDI + DDD + Número) *
              </label>
              <input
                type="text"
                required
                placeholder="5511987654321"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-emerald-50/50 border border-emerald-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Apenas números com código do país (55 para Brasil) e DDD. Ex: 5511987654321
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Formatado para Exibição
              </label>
              <input
                type="text"
                placeholder="(11) 98765-4321"
                value={formData.whatsappDisplay}
                onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Responsável Técnico Farmacêutico */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Responsabilidade Técnica (Farmacêutico & CRF)
              </h3>
              <p className="text-xs text-slate-500">
                Informações regulatórias exigidas pela ANVISA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Farmacêutico(a) Responsável Técnico(a) *
              </label>
              <input
                type="text"
                required
                value={formData.responsiblePharmacist}
                onChange={(e) => handleChange('responsiblePharmacist', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número do CRF (Conselho Regional de Farmácia) *
              </label>
              <input
                type="text"
                required
                value={formData.crf}
                onChange={(e) => handleChange('crf', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Aviso Legal sobre Medicamentos com Receita Médica
              </label>
              <textarea
                rows={2}
                value={formData.prescriptionNotice}
                onChange={(e) => handleChange('prescriptionNotice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Endereço & Localização */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Endereço Físico e Localização no Mapa
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Logradouro (Rua, Avenida) *
              </label>
              <input
                type="text"
                required
                value={formData.addressStreet}
                onChange={(e) => handleChange('addressStreet', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número *
              </label>
              <input
                type="text"
                required
                value={formData.addressNumber}
                onChange={(e) => handleChange('addressNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                required
                value={formData.addressNeighborhood}
                onChange={(e) => handleChange('addressNeighborhood', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                required
                value={formData.addressCity}
                onChange={(e) => handleChange('addressCity', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                UF (Estado) *
              </label>
              <input
                type="text"
                required
                value={formData.addressState}
                onChange={(e) => handleChange('addressState', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={formData.addressCep}
                onChange={(e) => handleChange('addressCep', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Link do Google Maps (Opcional)
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Horários de Atendimento */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Horários de Funcionamento
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Segunda a Sexta-Feira *
              </label>
              <input
                type="text"
                required
                value={formData.openingHoursWeekdays}
                onChange={(e) => handleChange('openingHoursWeekdays', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sábados *
              </label>
              <input
                type="text"
                required
                value={formData.openingHoursSaturday}
                onChange={(e) => handleChange('openingHoursSaturday', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Domingos e Feriados *
              </label>
              <input
                type="text"
                required
                value={formData.openingHoursSunday}
                onChange={(e) => handleChange('openingHoursSunday', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Save Info Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Salvar Dados da Farmácia
          </button>
        </div>
      </form>

      {/* Security & Password Change */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Segurança do Painel Administrativo
            </h3>
            <p className="text-xs text-slate-500">
              Altere a senha de acesso da gerência
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md text-xs">
          {passwordFeedback && (
            <p className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold">
              {passwordFeedback}
            </p>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nova Senha
            </label>
            <input
              type="password"
              required
              placeholder="Mínimo 4 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              required
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Atualizar Senha
          </button>
        </form>
      </div>

      {/* Reset System to Factory Defaults */}
      <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Restaurar Dados Padrão da Farmácia</span>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Esta opção restaura todo o catálogo com os produtos iniciais, fotos, banners e configurações originais.
        </p>
        <button
          onClick={() => {
            if (confirm('Tem certeza? Isso restaurará o catálogo e configurações aos padrões iniciais.')) {
              resetToDefaults();
              alert('Dados restaurados com sucesso!');
              window.location.reload();
            }
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Catálogo de Demonstração</span>
        </button>
      </div>
    </div>
  );
};
