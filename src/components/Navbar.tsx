import { Eye, Smartphone } from 'lucide-react';

interface NavbarProps {
  onOpenOrderModal: () => void;
  currentView: 'store' | 'gods_eye';
  onSelectView: (view: 'store' | 'gods_eye') => void;
}

export default function Navbar({ onOpenOrderModal, currentView, onSelectView }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectView('store')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(0,163,255,0.4)] group-hover:scale-105 transition-transform">
              A
            </span>
            <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Atlas Automatizaciones
            </span>
          </button>

          {/* Mode Switcher Tabs (Placas NFC vs Ojo de Dios) */}
          <div className="hidden lg:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl ml-2">
            <button
              onClick={() => onSelectView('store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'store'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Placas NFC</span>
            </button>

            <button
              onClick={() => onSelectView('gods_eye')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                currentView === 'gods_eye'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-cyan-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Ojo de Dios 3D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping ml-0.5" />
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Store view) */}
        {currentView === 'store' ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <a href="#beneficios" className="hover:text-cyan-400 transition-colors">
              Beneficios
            </a>
            <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">
              Cómo Funciona
            </a>
            <a href="#simulador" className="hover:text-cyan-400 transition-colors">
              Simulador
            </a>
            <a href="#precios" className="hover:text-cyan-400 transition-colors">
              Precios
            </a>
            <a href="#preguntas" className="hover:text-cyan-400 transition-colors">
              Preguntas
            </a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MODO INTELIGENCIA PLANETARIA 3D ACTIVO</span>
          </div>
        )}

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Ojo de Dios trigger */}
          <button
            onClick={() => onSelectView(currentView === 'store' ? 'gods_eye' : 'store')}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-neutral-900 border border-neutral-700 text-cyan-400 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{currentView === 'store' ? 'Ojo de Dios' : 'Placas'}</span>
          </button>

          <button
            onClick={onOpenOrderModal}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_25px_rgba(0,163,255,0.5)] transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
          >
            Cotizar o Comprar
          </button>
        </div>
      </div>
    </header>
  );
}
