import React, { useState, useRef } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types/pharmacy';
import { formatCurrency } from '../../utils/formatters';
import { IMAGE_PRESETS } from '../../data/initialData';
import { compressImage } from '../../utils/imageCompressor';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Package,
  Image as ImageIcon,
  CheckCircle2,
  Filter,
  Upload,
  Laptop,
  Globe,
  FolderPlus,
  FolderTree,
  Loader2
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    toggleProductFeatured,
    addCategory,
  } = usePharmacy();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('medicamentos');
  const [price, setPrice] = useState('');
  const [promotionalPrice, setPromotionalPrice] = useState('');
  const [image, setImage] = useState('');
  const [inStock, setInStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState('50');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [dosageOrVolume, setDosageOrVolume] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');

  // Image upload from computer state
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Category Add inside modal
  const [isQuickCategoryOpen, setIsQuickCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido (JPG, PNG ou WEBP).');
      return;
    }

    try {
      setIsUploadingImage(true);
      const compressedDataUrl = await compressImage(file, 800, 800, 0.85);
      setImage(compressedDataUrl);
    } catch (err) {
      console.error('Erro ao processar imagem do computador:', err);
      alert('Não foi possível processar esta imagem. Tente uma foto menor ou em formato JPG/PNG.');
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCreateQuickCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreatingCategory(true);
      const cleanName = newCategoryName.trim();
      const slug = cleanName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

      await addCategory({
        name: cleanName,
        slug,
        iconName: 'Tag',
      });

      setCategory(slug);
      setNewCategoryName('');
      setIsQuickCategoryOpen(false);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchMfg = p.manufacturer?.toLowerCase().includes(q);
      if (!matchName && !matchMfg) return false;
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory('medicamentos');
    setPrice('');
    setPromotionalPrice('');
    setImage('');
    setImageSourceMode('upload');
    setInStock(true);
    setStockQuantity('50');
    setRequiresPrescription(false);
    setIsFeatured(false);
    setDosageOrVolume('');
    setManufacturer('');
    setActiveIngredient('');
    setIsQuickCategoryOpen(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setCategory(prod.category);
    setPrice(prod.price.toString());
    setPromotionalPrice(prod.promotionalPrice ? prod.promotionalPrice.toString() : '');
    setImage(prod.image);
    setImageSourceMode(prod.image && prod.image.startsWith('data:image') ? 'upload' : 'url');
    setInStock(prod.inStock);
    setStockQuantity(prod.stockQuantity ? prod.stockQuantity.toString() : '20');
    setRequiresPrescription(prod.requiresPrescription);
    setIsFeatured(prod.isFeatured);
    setDosageOrVolume(prod.dosageOrVolume || '');
    setManufacturer(prod.manufacturer || '');
    setActiveIngredient(prod.activeIngredient || '');
    setIsQuickCategoryOpen(false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;

    const parsedPrice = parseFloat(price.replace(',', '.'));
    const parsedPromo = promotionalPrice.trim()
      ? parseFloat(promotionalPrice.replace(',', '.'))
      : undefined;
    const parsedStock = parseInt(stockQuantity) || 10;

    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: parsedPrice,
      promotionalPrice: parsedPromo,
      image: image.trim() || IMAGE_PRESETS[0].url,
      inStock,
      stockQuantity: parsedStock,
      requiresPrescription,
      isFeatured,
      dosageOrVolume: dosageOrVolume.trim() || undefined,
      manufacturer: manufacturer.trim() || undefined,
      activeIngredient: activeIngredient.trim() || undefined,
    };

    if (editingProduct) {
      updateProduct({
        ...productPayload,
        id: editingProduct.id,
      });
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou fabricante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas Categorias</option>
            {categories.slice(1).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Produto</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Preço</th>
                <th className="p-3.5 text-center">Receita?</th>
                <th className="p-3.5 text-center">Em Estoque?</th>
                <th className="p-3.5 text-center">Destaque Carrossel?</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Photo & Name */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {p.manufacturer || 'Farmácia'} {p.dosageOrVolume ? `· ${p.dosageOrVolume}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 text-slate-600 capitalize">
                    {p.category}
                  </td>

                  {/* Price */}
                  <td className="p-3.5 font-bold text-slate-900">
                    {p.promotionalPrice ? (
                      <div>
                        <span className="text-emerald-700 block">{formatCurrency(p.promotionalPrice)}</span>
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                    ) : (
                      formatCurrency(p.price)
                    )}
                  </td>

                  {/* Prescription */}
                  <td className="p-3.5 text-center">
                    {p.requiresPrescription ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        Sim
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Não</span>
                    )}
                  </td>

                  {/* Stock Toggle */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleProductStock(p.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {p.inStock ? '✓ Em Estoque' : '✕ Esgotado'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleProductFeatured(p.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        p.isFeatured
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {p.isFeatured ? '★ Destaque' : 'Padrão'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir permanentemente o produto "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full my-6 p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dipirona Monoidratada 500mg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Categoria *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsQuickCategoryOpen(!isQuickCategoryOpen)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                      title="Adicionar nova categoria rápida"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nova Categoria</span>
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    {categories.slice(1).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Inline Quick Category Add Form */}
                  {isQuickCategoryOpen && (
                    <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                          <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
                          Criar Nova Categoria
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsQuickCategoryOpen(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Ex: Ortopedia, Higiene Bucal..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          disabled={!newCategoryName.trim() || isCreatingCategory}
                          onClick={handleCreateQuickCategory}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer shrink-0"
                        >
                          {isCreatingCategory ? 'Criando...' : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prices & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço Padrão (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="15,90"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Preço Promocional (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="11,90"
                    value={promotionalPrice}
                    onChange={(e) => setPromotionalPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Qtd em Estoque
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Manufacturer & Active Ingredient */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Laboratório / Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Medley, EMS, CeraVe"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dosagem / Volume
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 20 comprimidos, 150ml"
                    value={dosageOrVolume}
                    onChange={(e) => setDosageOrVolume(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Princípio Ativo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dipirona Monoidratada"
                    value={activeIngredient}
                    onChange={(e) => setActiveIngredient(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição e Orientações de Uso
                </label>
                <textarea
                  rows={3}
                  placeholder="Informações para o cliente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Image Section: Upload do Computador, URL ou Modelos */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700">
                    Foto do Produto *
                  </label>
                  {image && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Foto selecionada
                    </span>
                  )}
                </div>

                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('upload')}
                    className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      imageSourceMode === 'upload'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Do Computador</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceMode('url')}
                    className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      imageSourceMode === 'url'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Link / URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceMode('presets')}
                    className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      imageSourceMode === 'presets'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Modelos</span>
                  </button>
                </div>

                {/* 1. Upload do Computador */}
                {imageSourceMode === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isUploadingImage
                          ? 'border-emerald-400 bg-emerald-50/50'
                          : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20'
                      }`}
                    >
                      {isUploadingImage ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                          <span className="text-xs font-bold text-emerald-800">
                            Compactando e preparando imagem...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Clique aqui para escolher a foto no seu computador
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            Formatos: JPG, PNG ou WEBP. Otimização automática para o banco de dados.
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Link / URL da Web */}
                {imageSourceMode === 'url' && (
                  <div className="space-y-1">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto-produto.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Cole a URL direta da foto na internet.
                    </span>
                  </div>
                )}

                {/* 3. Modelos Farmacêuticos */}
                {imageSourceMode === 'presets' && (
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1.5">
                      Selecione uma foto modelo para o produto:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {IMAGE_PRESETS.slice(0, 6).map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            image === preset.url
                              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-10 object-contain mx-auto"
                          />
                          <span className="text-[9px] text-slate-600 truncate block mt-1 font-medium">
                            {preset.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Image Preview Box */}
                {image && (
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                      <img
                        src={image}
                        alt="Pré-visualização"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          Pré-visualização da foto
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {image.startsWith('data:image') ? 'Upload do PC' : 'URL / Preset'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {image.startsWith('data:image')
                          ? 'Foto armazenada e otimizada com sucesso.'
                          : image}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remover foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Checkboxes: Stock, Prescription, Featured */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Disponível em Estoque</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-amber-900">
                  <input
                    type="checkbox"
                    checked={requiresPrescription}
                    onChange={(e) => setRequiresPrescription(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Medicamento Requer Receita Médica</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-emerald-900">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Destacar no Carrossel da Página Inicial</span>
                </label>
              </div>

              {/* Submit buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
