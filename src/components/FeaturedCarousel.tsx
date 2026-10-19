import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Eye, Plus, Check, ShoppingBag, ShoppingCart } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { formatCurrency } from '../utils/formatters';

export const FeaturedCarousel: React.FC = () => {
  const { banners, products, setSelectedCategory, setQuickViewProduct, addToCart, setIsCheckoutOpen } = usePharmacy();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const featuredProducts = products.filter((p) => p.isFeatured && p.inStock).slice(0, 8);

  const handleQuickAdd = (prod: any) => {
    addToCart(prod, 1);
    setAddedNoticeId(prod.id);
    setTimeout(() => setAddedNoticeId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Carousel */}
      {activeBanners.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md">
          <div className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[340px] flex items-center">
            {activeBanners.map((banner, index) => {
              const isCurrent = index === currentSlide;
              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Background Image with Gradient Overlay */}
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

                  {/* Banner Content */}
                  <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl py-8">
                    {banner.discountBadge && (
                      <div className="mb-2.5">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          {banner.discountBadge}
                        </span>
                      </div>
                    )}
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                      {banner.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 mb-5 max-w-lg">
                      {banner.subtitle}
                    </p>
                    <div>
                      <button
                        onClick={() => {
                          if (banner.categoryFilter) {
                            setSelectedCategory(banner.categoryFilter);
                            const el = document.getElementById('catalogo-produtos');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
                      >
                        <span>{banner.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {activeBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ir para banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Featured Products Carousel Row */}
      {featuredProducts.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Seleção Especial
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Produtos em Destaque
              </h3>
            </div>
            <span className="text-xs text-slate-500 hidden sm:block">
              Mais procurados e com preços especiais
            </span>
          </div>

          {/* Horizontal scrollable row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => {
              const currentPrice = product.promotionalPrice || product.price;
              const hasDiscount = !!product.promotionalPrice && product.promotionalPrice < product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.price - product.promotionalPrice!) / product.price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => setQuickViewProduct(product)}
                  className="group relative bg-slate-50/70 hover:bg-white rounded-xl p-3 border border-slate-200/60 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  {/* Badges & Image */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-2.5 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}

                    {product.requiresPrescription && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                        Receita
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-[11px] text-slate-500 mb-0.5 line-clamp-1">
                      {product.manufacturer || 'Farmácia'}
                    </div>
                    <h4
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight mb-2 cursor-pointer"
                    >
                      {product.name}
                    </h4>

                    {/* Price */}
                    <div className="mt-auto mb-3">
                      {hasDiscount && (
                        <span className="text-[11px] text-slate-400 line-through block leading-tight">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-extrabold text-emerald-800">
                        {formatCurrency(currentPrice)}
                      </span>
                    </div>

                    {/* Buttons: Comprar & Carrinho */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                          setIsCheckoutOpen(true);
                        }}
                        style={{ backgroundColor: '#047857', color: '#ffffff' }}
                        className="flex items-center justify-center gap-1 py-2 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        title="Comprar agora"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>Comprar</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(product);
                        }}
                        style={{
                          backgroundColor: addedNoticeId === product.id ? '#047857' : '#059669',
                          color: '#ffffff',
                        }}
                        className={`flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          addedNoticeId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                        title="Carrinho"
                      >
                        {addedNoticeId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>Adicionado</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                            <span>Carrinho</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
