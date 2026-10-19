import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Truck,
  Store,
  ShieldCheck,
  ExternalLink,
  Heart,
  FileCheck2
} from 'lucide-react';

export const PharmacyInfoSection: React.FC = () => {
  const { pharmacyInfo, deliverySettings } = usePharmacy();

  return (
    <section className="my-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Nossa Estrutura e Atendimento
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Informações da Farmácia
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Estamos prontos para atender você com dedicação, suporte farmacêutico contínuo e agilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Endereço & Localização */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3.5">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Endereço da Loja
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {pharmacyInfo.addressStreet}, nº {pharmacyInfo.addressNumber}
                <br />
                {pharmacyInfo.addressNeighborhood} · {pharmacyInfo.addressCity} - {pharmacyInfo.addressState}
                <br />
                CEP: {pharmacyInfo.addressCep}
              </p>
            </div>

            <a
              href={pharmacyInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors pt-2 border-t border-slate-200"
            >
              <span>Ver no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Horários & Contatos */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3.5">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Horário de Atendimento
              </h3>
              <ul className="text-xs text-slate-600 space-y-1 mb-3">
                <li className="flex items-center justify-between">
                  <span>Dias úteis:</span>
                  <strong className="text-slate-800">{pharmacyInfo.openingHoursWeekdays}</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Sábados:</span>
                  <strong className="text-slate-800">{pharmacyInfo.openingHoursSaturday}</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Domingos/Feriados:</span>
                  <strong className="text-slate-800">{pharmacyInfo.openingHoursSunday}</strong>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <a
                href={`tel:${pharmacyInfo.phone.replace(/\D/g, '')}`}
                className="font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{pharmacyInfo.phone}</span>
              </a>
              <a
                href={`https://wa.me/${pharmacyInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Entrega & Retirada */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3.5">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Políticas de Entrega
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Taxa padrão: <strong>{formatCurrency(deliverySettings.deliveryFee)}</strong> (Frete Grátis acima de{' '}
                <strong>{formatCurrency(deliverySettings.freeDeliveryThreshold)}</strong>).
              </p>
              <p className="text-[11px] text-slate-500 mb-2">
                Tempo estimado: <strong>{deliverySettings.estimatedDeliveryTime}</strong>
              </p>
              {deliverySettings.coverageAreas.length > 0 && (
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Regiões atendidas: </span>
                  {deliverySettings.coverageAreas.join(', ')}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-emerald-800 font-semibold flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Retirada grátis disponível no balcão</span>
            </div>
          </div>
        </div>

        {/* Responsible Pharmacist & Regulatory Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">
                Responsável Técnico: {pharmacyInfo.responsiblePharmacist} · {pharmacyInfo.crf}
              </span>
              <span>CNPJ: {pharmacyInfo.cnpj} · Farmácia autorizada pela ANVISA</span>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            Medicamentos retêm receita original conforme RDC ANVISA.
          </div>
        </div>
      </div>
    </section>
  );
};
