import React from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const PrescriptionAlert: React.FC = () => {
  const { pharmacyInfo } = usePharmacy();

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 my-4 max-w-7xl mx-auto text-slate-800">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-amber-900 uppercase tracking-wide text-[11px] sm:text-xs flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Aviso Importante sobre Medicamentos com Receita
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-800 font-medium text-[11px] sm:text-xs">
              Resoluções ANVISA & RDC
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            {pharmacyInfo.prescriptionNotice}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Envie a foto da receita pelo WhatsApp
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Validação ágil pelo farmacêutico
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Retenção física no ato da entrega ou balcão
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
