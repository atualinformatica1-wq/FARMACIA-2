import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { CarouselBanner } from '../../types/pharmacy';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Image as ImageIcon } from 'lucide-react';

const BANNER_PRESETS = [
  {
    name: 'Atendimento & Farmácia Geral',
    url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dermocosméticos & Skincare',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vitaminas & Imunidade',
    url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mamãe & Bebê',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&auto=format&fit=crop&q=80',
  },
];

export const BannersTab: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, categories } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CarouselBanner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonText, setButtonText] = useState('Ver Produtos');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [discountBadge, setDiscountBadge] = useState('');
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImageUrl(BANNER_PRESETS[0].url);
    setButtonText('Conferir Ofertas');
    setCategoryFilter('todos');
    setDiscountBadge('');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: CarouselBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setImageUrl(banner.imageUrl);
    setButtonText(banner.buttonText);
    setCategoryFilter(banner.categoryFilter || 'todos');
    setDiscountBadge(banner.discountBadge || '');
    setActive(banner.active);
    setIsModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const bannerPayload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      buttonText: buttonText.trim() || 'Ver Produtos',
      categoryFilter,
      discountBadge: discountBadge.trim() || undefined,
      active,
    };

    if (editingBanner) {
      updateBanner({
        ...bannerPayload,
        id: editingBanner.id,
      });
    } else {
      addBanner(bannerPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Carrossel e Banners Promocionais
          </h3>
          <p className="text-xs text-slate-500">
            Gerencie os destaques visuais exibidos no topo da página inicial
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {/* Banner preview */}
            <div className="relative h-44 bg-slate-900">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              <div className="absolute top-3 left-3 flex gap-2">
                {banner.discountBadge && (
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                    {banner.discountBadge}
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    banner.active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {banner.active ? 'Ativo' : 'Oculto'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="text-sm font-bold leading-tight">{banner.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{banner.subtitle}</p>
              </div>
            </div>

            {/* Banner details & actions */}
            <div className="p-3.5 flex items-center justify-between text-xs bg-slate-50 border-t border-slate-100">
              <span className="text-slate-500">
                Ação: <strong>{banner.buttonText}</strong> ({banner.categoryFilter})
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateBanner({ ...banner, active: !banner.active })}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  title={banner.active ? 'Ocultar banner' : 'Ativar banner'}
                >
                  {banner.active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Editar banner"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Deseja excluir este banner?')) {
                      deleteBanner(banner.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Excluir banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingBanner ? 'Editar Banner Promocional' : 'Novo Banner Promocional'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título Principal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cuidando de Você e da Sua Família"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtítulo / Descrição *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Medicamentos e cuidados diários com entrega rápida..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Selo de Destaque (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Até 25% OFF"
                    value={discountBadge}
                    onChange={(e) => setDiscountBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Direcionar para Categoria ao Clicar
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="todos">Todos os Produtos</option>
                  {categories.slice(1).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Imagem de Fundo (URL ou Preset)
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {BANNER_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="p-1.5 border border-slate-200 hover:border-emerald-500 rounded-lg text-left text-[11px] truncate"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Banner Ativo na Página Inicial</span>
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
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
