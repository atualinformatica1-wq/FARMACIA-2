import React from 'react';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/Header';
import { PrescriptionAlert } from './components/PrescriptionAlert';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ProductCatalog } from './components/ProductCatalog';
import { PharmacyInfoSection } from './components/PharmacyInfoSection';
import { Footer } from './components/Footer';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { FloatingCartBar } from './components/FloatingCartBar';

const PharmacyMainView: React.FC = () => {
  const { isAdminViewOpen } = usePharmacy();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Client Area */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 w-full py-4">
        <PrescriptionAlert />
        <FeaturedCarousel />
        <ProductCatalog />
        <PharmacyInfoSection />
      </main>

      <Footer />

      {/* Global Interactive Modals and Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />
      <AdminLoginModal />
      <FloatingCartBar />

      {/* Admin Full View */}
      {isAdminViewOpen && <AdminDashboard />}
    </div>
  );
};

export default function App() {
  return (
    <PharmacyProvider>
      <PharmacyMainView />
    </PharmacyProvider>
  );
}
