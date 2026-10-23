import React from 'react';
import { MessageCircle } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const FloatingWhatsAppButton: React.FC = () => {
  const { pharmacyInfo, isCartOpen, isCheckoutOpen } = usePharmacy();

  if (isCartOpen || isCheckoutOpen) return null;

  return (
    <a
      href={`https://wa.me/${pharmacyInfo.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre um medicamento ou produto.')}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: '#25D366', color: '#ffffff' }}
      className="fixed bottom-5 right-5 z-40 w-13 h-13 rounded-full flex items-center justify-center shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all group cursor-pointer border-2 border-white/80"
      title="Fale Conosco no WhatsApp"
      aria-label="Fale Conosco no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white/20" />
      <span className="absolute right-full mr-3 bg-slate-900/90 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700/60 hidden sm:block">
        Fale Conosco no WhatsApp
      </span>
    </a>
  );
};
