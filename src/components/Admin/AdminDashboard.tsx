import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { BannersTab } from './BannersTab';
import { PaymentsTab } from './PaymentsTab';
import { DeliveryTab } from './DeliveryTab';
import { SettingsTab } from './SettingsTab';
import { CategoriesTab } from './CategoriesTab';
import { formatCurrency } from '../../utils/formatters';
import {
  ClipboardList,
  Package,
  Image as ImageIcon,
  CreditCard,
  Truck,
  Settings,
  Store,
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  FolderTree
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminViewOpen,
    setIsAdminViewOpen,
    adminLogout,
    pharmacyInfo,
    orders,
    products,
    categories,
    isFirebaseConnected,
    currentUser,
    loginWithGoogle,
    syncInitialDataToFirebase
  } = usePharmacy();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'categories' | 'banners' | 'payments' | 'delivery' | 'settings'
  >('orders');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSyncFirebase = async () => {
    setIsSyncing(true);
    try {
      await syncInitialDataToFirebase();
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAdminViewOpen) return null;

  // Key Metrics
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const outOfStockProducts = products.filter((p) => !p.inStock);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-y-auto">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminViewOpen(false)}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Loja</span>
            </button>
            <div className="hidden sm:block h-5 w-px bg-slate-700" />
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                Painel Administrativo · {pharmacyInfo.name}
              </h1>
              <p className="text-[11px] text-slate-400">
                {pharmacyInfo.responsiblePharmacist} ({pharmacyInfo.crf})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firebase Conectado</span>
            </div>

            <button
              onClick={handleSyncFirebase}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Sincronizar banco de dados no Firestore"
            >
              <span>{isSyncing ? 'Sincronizando...' : syncDone ? '✓ Dados Sincronizados!' : 'Sincronizar Firebase'}</span>
            </button>

            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800 border-t border-slate-700/80 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Pedidos</span>
              {pendingOrders.length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos & Estoque ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categorias ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Banners & Carrossel</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Formas de Pagamento</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Entrega & Retirada</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Dados da Farmácia</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total de Pedidos
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {orders.length}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              {pendingOrders.length} aguardando atendimento
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Faturamento Registrado
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
              {formatCurrency(totalRevenue)}
            </div>
            <span className="text-xs text-emerald-600 mt-0.5 block">
              Somatório dos pedidos no site
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Produtos Cadastrados
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {products.length}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              {products.filter((p) => p.isFeatured).length} em destaque no carrossel
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Estoque & Alertas
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {outOfStockProducts.length === 0 ? (
                <span className="text-emerald-700 text-lg">Tudo em Estoque ✓</span>
              ) : (
                <span className="text-rose-600">{outOfStockProducts.length} esgotados</span>
              )}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Monitoramento em tempo real
            </span>
          </div>
        </div>

        {/* Tab View */}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'banners' && <BannersTab />}
        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'delivery' && <DeliveryTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};
