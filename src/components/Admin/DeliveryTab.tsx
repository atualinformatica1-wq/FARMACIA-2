import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Truck, Store, Check, Plus, X } from 'lucide-react';

export const DeliveryTab: React.FC = () => {
  const { deliverySettings, updateDeliverySettings } = usePharmacy();

  const [deliveryFee, setDeliveryFee] = useState(deliverySettings.deliveryFee.toString());
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(
    deliverySettings.freeDeliveryThreshold.toString()
  );
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(
    deliverySettings.estimatedDeliveryTime
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    deliverySettings.deliveryInstructions
  );
  const [coverageAreas, setCoverageAreas] = useState<string[]>(deliverySettings.coverageAreas);
  const [newAreaInput, setNewAreaInput] = useState('');

  const [pickupEstimatedTime, setPickupEstimatedTime] = useState(
    deliverySettings.pickupEstimatedTime
  );
  const [pickupInstructions, setPickupInstructions] = useState(
    deliverySettings.pickupInstructions
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddArea = () => {
    if (newAreaInput.trim() && !coverageAreas.includes(newAreaInput.trim())) {
      setCoverageAreas([...coverageAreas, newAreaInput.trim()]);
      setNewAreaInput('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setCoverageAreas(coverageAreas.filter((a) => a !== area));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliverySettings({
      deliveryFee: parseFloat(deliveryFee.replace(',', '.')) || 0,
      freeDeliveryThreshold: parseFloat(freeDeliveryThreshold.replace(',', '.')) || 0,
      estimatedDeliveryTime: estimatedDeliveryTime.trim(),
      deliveryInstructions: deliveryInstructions.trim(),
      coverageAreas,
      pickupEstimatedTime: pickupEstimatedTime.trim(),
      pickupInstructions: pickupInstructions.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configurações de entrega e retirada salvas com sucesso!</span>
        </div>
      )}

      {/* Section 1: Entrega em Domicílio */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Configurações de Entrega em Domicílio (Delivery)
            </h3>
            <p className="text-xs text-slate-500">
              Taxa de frete, tempo estimado e regras de frete grátis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Taxa de Entrega Padrão (R$) *
            </label>
            <input
              type="text"
              required
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Valor para Frete Grátis (R$) *
            </label>
            <input
              type="text"
              required
              value={freeDeliveryThreshold}
              onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Pedidos a partir deste valor não pagam frete
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tempo Estimado de Entrega *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 30 a 60 minutos"
              value={estimatedDeliveryTime}
              onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Coverage Areas Tags */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Bairros / Regiões Atendidas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Adicionar bairro (Ex: Moema, Centro...)"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArea();
                }
              }}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddArea}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {coverageAreas.map((area) => (
              <span
                key={area}
                className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs font-medium flex items-center gap-1.5"
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArea(area)}
                  className="text-emerald-700 hover:text-rose-600 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Delivery Instructions */}
        <div className="text-xs">
          <label className="block font-semibold text-slate-700 mb-1">
            Instruções e Avisos de Entrega para o Cliente
          </label>
          <textarea
            rows={2}
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Section 2: Retirada no Balcão */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Configurações de Retirada na Loja (Balcão)
            </h3>
            <p className="text-xs text-slate-500">
              Instruções e tempo de preparação para o cliente retirar pessoalmente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tempo Estimado de Separação para Retirada *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pronto em 15 a 30 minutos"
              value={pickupEstimatedTime}
              onChange={(e) => setPickupEstimatedTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Instruções de Retirada
            </label>
            <input
              type="text"
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Salvar Configurações de Recebimento
        </button>
      </div>
    </form>
  );
};
