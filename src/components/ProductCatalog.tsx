import React, { useState, useMemo } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  Search,
  FilterX,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    prescriptionFilterOnly,
    setPrescriptionFilterOnly
  } = usePharmacy();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }

        // Prescription filter
        if (prescriptionFilterOnly && !product.requiresPrescription) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchMfg = product.manufacturer?.toLowerCase().includes(q);
          const matchActive = product.activeIngredient?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchMfg && !matchActive) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.promotionalPrice || a.price;
        const priceB = b.promotionalPrice || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, prescriptionFilterOnly, inStockOnly, searchQuery, sortBy]);

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="catalogo-produtos" className="my-8 scroll-mt-24">
      {/* Catalog Header & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentCategoryObj ? currentCategoryObj.name : 'Catálogo de Produtos'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Exibindo <span className="font-semibold text-slate-800">{filteredProducts.length}</span> produtos disponíveis
            </p>
          </div>

          {/* Quick Filter Toggles & Sorter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="default">Mais Relevantes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name">Nome (A - Z)</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inStockOnly
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apenas em estoque</span>
            </button>

            {/* Prescription Toggle */}
            <button
              onClick={() => setPrescriptionFilterOnly(!prescriptionFilterOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                prescriptionFilterOnly
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Com Receita</span>
            </button>
          </div>
        </div>

        {/* Active Filters Summary (if any) */}
        {(selectedCategory !== 'todos' || searchQuery || prescriptionFilterOnly || inStockOnly) && (
          <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-700">Filtros ativos:</span>
              {selectedCategory !== 'todos' && (
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                  Categoria: {currentCategoryObj?.name}
                </span>
              )}
              {searchQuery && (
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                  Busca: "{searchQuery}"
                </span>
              )}
              {inStockOnly && (
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  Em estoque
                </span>
              )}
              {prescriptionFilterOnly && (
                <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium">
                  Medicamentos com receita
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
                setPrescriptionFilterOnly(false);
                setInStockOnly(false);
              }}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer shrink-0 ml-2"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Nenhum produto encontrado
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Não encontramos itens com os critérios selecionados. Tente buscar por outros termos ou limpar os filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('todos');
              setSearchQuery('');
              setPrescriptionFilterOnly(false);
              setInStockOnly(false);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Ver todos os produtos da farmácia
          </button>
        </div>
      )}
    </section>
  );
};
