import { useState } from 'react';
import { ArrowRight, Smartphone, ShieldCheck, Truck, Headphones, Search, CheckCircle2, Ruler, Eye, Sparkles } from 'lucide-react';
import { useProductImage } from '../context/ProductImageContext';

interface HeroProps {
  onOpenOrderModal: () => void;
  onScrollToSimulator: () => void;
  onOpenGodsEye: () => void;
}

export default function Hero({ onOpenOrderModal, onScrollToSimulator, onOpenGodsEye }: HeroProps) {
  const { imageSrc } = useProductImage();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Exactly matching the flyer typography & claims */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Ojo de Dios Special Announcement Pill */}
            <button
              onClick={onOpenGodsEye}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/40 text-xs font-semibold text-cyan-300 mb-3.5 cursor-pointer transition-all hover:scale-102 group shadow-[0_0_20px_rgba(0,163,255,0.25)]"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
              <span>Proyecto Viral Atlas: <strong>Ojo de Dios 3D</strong></span>
              <span className="text-[10px] text-cyan-400 bg-cyan-900/80 px-1.5 py-0.5 rounded font-mono">EXPLORAR</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Top brand header */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-cyan-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ATLAS AUTOMATIZACIONES</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">TU NEGOCIO EN LAS PRIMERAS BÚSQUEDAS</span>
            </div>

            {/* Main Flyer Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-[1.08] mb-4 text-balance">
              PLACA NFC <br />
              <span className="text-cyan-400">
                GOOGLE REVIEWS
              </span>
            </h1>

            {/* Subtitle from Flyer */}
            <p className="text-lg sm:text-xl font-medium text-neutral-200 mb-6 max-w-2xl leading-snug">
              Convierte cada visita en una recomendación y haz crecer tu negocio.
            </p>

            {/* 4 Core Features from Flyer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 w-full max-w-xl">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center font-display font-black text-cyan-400 text-base shrink-0">
                  G
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  Más reseñas en Google
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  Mejor posicionamiento en búsquedas
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  Solo acerca tu celular
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  Diseño elegante y resistente
                </div>
              </div>
            </div>

            {/* Official Dimensions Tag */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-3.5 py-2 rounded-xl mb-6">
              <Ruler className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Modelo Único:</span>
              <strong className="text-white">14 cm alto × 12 cm ancho × 5 cm base de apoyo</strong>
            </div>

            {/* Flyer Callout: "¡Haz que te encuentren!" */}
            <div className="inline-block text-xl sm:text-2xl font-black text-white italic tracking-wide mb-7 relative">
              <span className="relative z-10">¡Haz que te encuentren!</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-80" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onOpenOrderModal}
                className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-[0_0_30px_rgba(0,163,255,0.4)] hover:shadow-[0_0_40px_rgba(0,163,255,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>Solicitar Placas para mi Negocio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToSimulator}
                className="px-6 py-4 text-base font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Probar Simulación en Vivo</span>
              </button>
            </div>
          </div>

          {/* Right Column: The Exact Real Image from Studio */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* The Real Studio Photo Box - Dark Seamless Container */}
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-neutral-800 bg-black shadow-[0_0_50px_rgba(0,0,0,0.85)] group">
              <div className="relative aspect-[3/4] w-full bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Placa NFC Google Reviews modelo oficial exacto 14cm x 12cm x 5cm"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                {/* Subtle dark ambient inner ring */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-3xl pointer-events-none" />
              </div>

              {/* Caption */}
              <div className="p-4 bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-800/80 text-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[11px]">
                    Fotografía Real del Producto
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    14cm alto · 12cm ancho · 5cm base
                  </span>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                  Modelo Oficial
                </span>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acrílico con canto transparente y pie inclinado</span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards directly below Hero (Flyer layout) */}
        <div className="mt-14 pt-8 border-t border-neutral-800/80">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Valores Oficiales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* 1 Unidad */}
            <div className="rounded-2xl bg-neutral-900/90 border border-blue-600/50 p-6 flex flex-col items-center text-center shadow-lg hover:border-cyan-400 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                1 Unidad
              </div>
              <div className="text-3xl sm:text-4xl font-display font-black text-white tabular-nums mb-1">
                $49.990
              </div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Por Unidad
              </div>
            </div>

            {/* 2 Unidades */}
            <div className="rounded-2xl bg-gradient-to-b from-blue-950/40 via-neutral-900 to-neutral-900 border-2 border-cyan-400 p-6 flex flex-col items-center text-center shadow-[0_0_25px_rgba(0,163,255,0.25)] relative">
              <div className="absolute -top-3 px-3 py-0.5 bg-cyan-400 text-neutral-950 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                Ahorras $8.000
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                2 Unidades
              </div>
              <div className="text-3xl sm:text-4xl font-display font-black text-white tabular-nums mb-1">
                $45.990
              </div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Por Unidad
              </div>
            </div>

            {/* +3 Unidades */}
            <div className="rounded-2xl bg-neutral-900/90 border border-blue-600/50 p-6 flex flex-col items-center text-center shadow-lg hover:border-cyan-400 transition-colors">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                +3 Unidades
              </div>
              <div className="text-3xl sm:text-4xl font-display font-black text-white tabular-nums mb-1">
                $42.990
              </div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Por Unidad (Ahorras $21.000+)
              </div>
            </div>
          </div>
        </div>

        {/* Chilean Trust Bar (Bottom of flyer) */}
        <div className="mt-10 pt-6 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Envíos a Todo Chile
              </div>
              <div className="text-xs text-neutral-400">
                Arica a Punta Arenas vía Starken, Chilexpress y Blue Express
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Compra Segura
              </div>
              <div className="text-xs text-neutral-400">
                Paga vía transferencia o WebPay con respaldo garantizado
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Soporte Post Venta
              </div>
              <div className="text-xs text-neutral-400">
                Placas 100% pre-programadas y asesoría técnica directa
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
