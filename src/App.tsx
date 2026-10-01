/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSimulator from './components/ExperienceSimulator';
import Benefits from './components/Benefits';
import ProductShowcase from './components/ProductShowcase';
import HowItWorks from './components/HowItWorks';
import PricingCalculator from './components/PricingCalculator';
import RoiCalculator from './components/RoiCalculator';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import OrderModal from './components/OrderModal';
import GoogleLinkGuideModal from './components/GoogleLinkGuideModal';
import GodsEyeConsole from './components/GodsEyeView/GodsEyeConsole';
import { ProductImageProvider } from './context/ProductImageContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'store' | 'gods_eye'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash.includes('ojo-de-dios') || params.get('tab') === 'ojo-de-dios' || params.get('tab') === 'gods-eye') {
        return 'gods_eye';
      }
    }
    return 'store';
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLinkGuideOpen, setIsLinkGuideOpen] = useState(false);
  const [modalInitialQty, setModalInitialQty] = useState(2);

  // Sync URL hash when switching tabs
  const handleSelectTab = (tab: 'store' | 'gods_eye') => {
    setCurrentTab(tab);
    if (tab === 'gods_eye') {
      window.history.replaceState(null, '', '#ojo-de-dios');
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleOpenOrderModal = (qty: number = 2) => {
    setModalInitialQty(qty);
    setIsOrderModalOpen(true);
  };

  const handleScrollToSimulator = () => {
    const el = document.getElementById('simulador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ProductImageProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-white">
        {currentTab === 'store' ? (
          <>
            {/* Top Navigation with Ojo de Dios tab switcher */}
            <Navbar
              onOpenOrderModal={() => handleOpenOrderModal(2)}
              currentView="store"
              onSelectView={handleSelectTab}
            />

            <main className="flex-1">
              {/* Hero Section with Ojo de Dios announcement badge */}
              <Hero
                onOpenOrderModal={() => handleOpenOrderModal(2)}
                onScrollToSimulator={handleScrollToSimulator}
                onOpenGodsEye={() => handleSelectTab('gods_eye')}
              />

              {/* Benefits & Local SEO Impact */}
              <Benefits />

              {/* Interactive Contactless Simulator */}
              <ExperienceSimulator onOpenOrderModal={() => handleOpenOrderModal(2)} />

              {/* Physical Quality & Packaging Showcase */}
              <ProductShowcase />

              {/* 4-Step Process */}
              <HowItWorks onOpenOrderModal={() => handleOpenOrderModal(2)} />

              {/* Pricing Tiers & Order Calculator */}
              <PricingCalculator onOpenOrderModalWithQty={handleOpenOrderModal} />

              {/* ROI Estimator for Local Business Owners */}
              <RoiCalculator />

              {/* Frequently Asked Questions */}
              <FaqSection />
            </main>

            {/* Footer */}
            <Footer onOpenOrderModal={() => handleOpenOrderModal(2)} />

            {/* Floating WhatsApp Quick Action */}
            <FloatingWhatsApp />
          </>
        ) : (
          /* OJO DE DIOS - 3D PLANETARY INTELLIGENCE CONSOLE */
          <div className="flex-1 flex flex-col h-screen">
            <GodsEyeConsole
              onBackToStore={() => handleSelectTab('store')}
              onOpenOrderModal={() => handleOpenOrderModal(2)}
            />
          </div>
        )}

        {/* Order & Quotation Modal accessible from anywhere */}
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          initialQty={modalInitialQty}
          onOpenLinkGuide={() => setIsLinkGuideOpen(true)}
        />

        {/* Google Maps Review Link Guide Modal */}
        <GoogleLinkGuideModal
          isOpen={isLinkGuideOpen}
          onClose={() => setIsLinkGuideOpen(false)}
        />
      </div>
    </ProductImageProvider>
  );
}
