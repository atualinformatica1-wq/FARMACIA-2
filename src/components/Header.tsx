import React from 'react';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Search,
  Lock,
  UserCheck,
  Sparkles,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';

export const Header: React.FC = () => {
  const {
    pharmacyInfo,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    setIsAdminLoginOpen,
    isAdmin,
    setIsAdminViewOpen,
    setTrackOrderModalOpen
  } = usePharmacy();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-800 text-white py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm border-b border-emerald-700/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
          {/* Horário & Responsável Técnico */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {/* Status Aberto Agora */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/40 px-2.5 py-1 rounded-full text-white shadow-xs">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
              </span>
              <span className="font-extrabold tracking-wide uppercase text-[11px] sm:text-xs text-emerald-200">
                Aberto Agora
              </span>
              <span className="text-emerald-400 font-bold hidden sm:inline">·</span>
              <span className="font-semibold text-white hidden sm:inline">
                {pharmacyInfo.openingHoursWeekdays}
              </span>
            </div>

            {/* Horário no mobile */}
            <span className="sm:hidden text-white/95 font-semibold text-[11px]">
              {pharmacyInfo.openingHoursWeekdays}
            </span>

            <span className="hidden md:inline-block text-emerald-400/60 font-light">|</span>

            {/* Farmacêutica Responsável e CRF */}
            <div className="flex items-center gap-1.5 text-emerald-100 font-medium text-xs sm:text-sm bg-emerald-900/50 px-2.5 py-1 rounded-lg border border-emerald-600/40">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                <strong className="font-bold text-white">{pharmacyInfo.responsiblePharmacist}</strong>{' '}
                <span className="text-emerald-300 text-[11px] sm:text-xs">({pharmacyInfo.crf})</span>
              </span>
            </div>
          </div>

          {/* Telefones de Contato & WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0 flex-wrap">
            {pharmacyInfo.phone && (
              <a
                href={`tel:${pharmacyInfo.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 bg-emerald-900/70 hover:bg-emerald-700/80 text-white border border-emerald-500/50 px-2.5 py-1 rounded-lg font-bold text-xs sm:text-sm transition-all hover:scale-[1.02]"
                title="Ligue para nossa farmácia"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                <span>{pharmacyInfo.phone}</span>
              </a>
            )}

            <a
              href={`https://wa.me/${pharmacyInfo.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              className="inline-flex items-center gap-1.5 hover:bg-[#20ba5a] active:scale-95 px-3 py-1 rounded-lg text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm border border-white/20 cursor-pointer"
              title="Fale conosco direto pelo WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0 fill-white/20" />
              <span>WhatsApp: {pharmacyInfo.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {pharmacyInfo.name}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {pharmacyInfo.tagline}
              </p>
            </div>
          </div>

          {/* Search Input (Desktop & Tablet) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar medicamento, protetor, vitamina, marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm pl-10 pr-9 py-2 rounded-lg border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions: Track order, Admin button & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTrackOrderModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 hover:bg-slate-100 px-3 py-2 rounded-lg font-medium transition-colors"
              title="Acompanhar status do seu pedido"
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Acompanhar Pedido</span>
            </button>

            {isAdmin ? (
              <button
                onClick={() => setIsAdminViewOpen(true)}
                className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg font-semibold transition-colors"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Painel Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-2 rounded-lg font-medium transition-colors"
                title="Acesso restrito ao administrador"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ backgroundColor: 'var(--color-emerald-600, #059669)' }}
              className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 rounded-xl font-medium shadow-sm transition-all border border-emerald-400/40 cursor-pointer"
              aria-label="Abrir carrinho de compras"
              title={cartCount > 0 ? `${cartCount} itens no carrinho` : 'Carrinho de compras (Vazio)'}
            >
              <div className="relative shrink-0">
                <ShoppingBag className="w-4 h-4 text-white" />
                {cartCount > 0 ? (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-75">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-2 -right-2.5 bg-emerald-950/85 text-emerald-100 font-extrabold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-emerald-300/70 shadow-xs">
                    0
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">
                  Carrinho
                </span>
                <span className="text-xs font-black text-white flex items-center gap-1 mt-0.5">
                  {cartCount > 0 ? (
                    formatCurrency(cartSubtotal)
                  ) : (
                    <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
                      Vazio · R$ 0,00
                    </span>
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar medicamentos, cosméticos, marcas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-sm pl-9 pr-8 py-2 rounded-lg border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
