import React from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { ShieldCheck, Heart, Lock, Phone, MessageCircle, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { pharmacyInfo, categories, setSelectedCategory, setIsAdminLoginOpen, isAdmin, setIsAdminViewOpen } =
    usePharmacy();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                +
              </div>
              <span className="font-bold text-white text-base">{pharmacyInfo.name}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {pharmacyInfo.tagline}. Atendimento humanizado, orientações farmacêuticas e entrega ágil para o seu bem-estar.
            </p>
            <div className="text-[11px] text-slate-500">
              CNPJ: {pharmacyInfo.cnpj}
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categorias Populares
            </h4>
            <ul className="space-y-2">
              {categories.slice(1, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      const el = document.getElementById('catalogo-produtos');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contato */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Central de Atendimento
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pharmacyInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${pharmacyInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
                  <span>WhatsApp: {pharmacyInfo.whatsappDisplay}</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {pharmacyInfo.addressStreet}, {pharmacyInfo.addressNumber} · {pharmacyInfo.addressCity}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmacêutico & Gestão */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Responsabilidade Técnica
            </h4>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-3">
              <span className="font-semibold text-white block">
                {pharmacyInfo.responsiblePharmacist}
              </span>
              <span className="text-emerald-400 text-[11px] block">
                {pharmacyInfo.crf}
              </span>
            </div>

            <button
              onClick={() => (isAdmin ? setIsAdminViewOpen(true) : setIsAdminLoginOpen(true))}
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>{isAdmin ? 'Painel Administrativo (Conectado)' : 'Acesso do Administrador'}</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright and legal note */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {pharmacyInfo.name}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Desenvolvido para atendimento e entrega farmacêutica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
