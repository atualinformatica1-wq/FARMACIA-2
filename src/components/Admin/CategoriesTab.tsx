import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Category } from '../../types/pharmacy';
import {
  Plus,
  Trash2,
  FolderTree,
  Tag,
  Pill,
  Sparkles,
  Activity,
  HeartHandshake,
  Baby,
  ShieldPlus,
  ShoppingBag,
  Heart,
  Droplets,
  Thermometer,
  Stethoscope,
  X,
  Check,
  AlertCircle,
  Package,
  Layers
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Tag', label: 'Etiqueta', icon: Tag },
  { name: 'Pill', label: 'Remédio', icon: Pill },
  { name: 'Sparkles', label: 'Beleza', icon: Sparkles },
  { name: 'Activity', label: 'Saúde', icon: Activity },
  { name: 'HeartHandshake', label: 'Cuidado', icon: HeartHandshake },
  { name: 'Baby', label: 'Bebê', icon: Baby },
  { name: 'ShieldPlus', label: 'Proteção', icon: ShieldPlus },
  { name: 'ShoppingBag', label: 'Loja', icon: ShoppingBag },
  { name: 'Heart', label: 'Coração', icon: Heart },
  { name: 'Droplets', label: 'Líquido / Pele', icon: Droplets },
  { name: 'Thermometer', label: 'Termômetro', icon: Thermometer },
  { name: 'Stethoscope', label: 'Médico', icon: Stethoscope },
  { name: 'Layers', label: 'Camadas', icon: Layers },
];

export const CategoriesTab: React.FC = () => {
  const { categories, products, addCategory, deleteCategory, setSelectedCategory, setIsAdminViewOpen } = usePharmacy();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [iconName, setIconName] = useState('Tag');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  // Confirmation modal for deletion
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug if not manually customized
    const autoSlug = val
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(autoSlug);
  };

  const handleOpenModal = () => {
    setName('');
    setSlug('');
    setIconName('Tag');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addCategory({
      name: name.trim(),
      slug: slug.trim() || undefined,
      iconName,
      description: description.trim() || undefined,
    });

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    await deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
  };

  const filteredCategories = categories.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const getCategoryIcon = (name: string) => {
    const opt = ICON_OPTIONS.find((o) => o.name === name);
    const IconComp = opt ? opt.icon : Tag;
    return <IconComp className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="space-y-5">
      {/* Top Banner and Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-600" />
            <span>Categorias de Produtos</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie e crie as seções exibidas na barra de navegação da sua farmácia.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const isDefaultAll = cat.id === 'todos';
          const count = isDefaultAll
            ? products.length
            : products.filter((p) => p.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isDefaultAll
                  ? 'border-emerald-200 bg-emerald-50/20 ring-1 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  <div className="flex items-center gap-1">
                    {isDefaultAll ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                        Filtro Geral
                      </span>
                    ) : (
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir categoria"
                        aria-label={`Excluir categoria ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                  {cat.name}
                </h4>

                <div className="text-[11px] text-slate-400 font-mono mb-2">
                  slug: <span className="text-slate-600 font-medium">{cat.slug}</span>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{count}</strong> {count === 1 ? 'produto' : 'produtos'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsAdminViewOpen(false);
                    const el = document.getElementById('catalogo-produtos');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                >
                  Ver na loja →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Adicionar Categoria */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Nova Categoria de Produtos
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ortopedia & Curativos, Higiene Bucal..."
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Identificador / Slug (Automático)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: ortopedia-curativos"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 font-mono text-[11px] focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Usado para filtros e links internos.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Escolha um Ícone:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconC = opt.icon;
                    const isSelected = iconName === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setIconName(opt.name)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                        title={opt.label}
                      >
                        <IconC className="w-4 h-4" />
                        <span className="text-[9px] truncate max-w-full">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve descrição dos itens desta categoria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Categoria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Excluir Categoria?
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Você tem certeza que deseja excluir a categoria{' '}
              <strong className="text-slate-900 font-bold">"{deletingCategory.name}"</strong>?
              {products.filter((p) => p.category === deletingCategory.id).length > 0 && (
                <span className="block text-rose-600 font-semibold mt-1">
                  Atenção: existem {products.filter((p) => p.category === deletingCategory.id).length} produtos vinculados a esta categoria.
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
