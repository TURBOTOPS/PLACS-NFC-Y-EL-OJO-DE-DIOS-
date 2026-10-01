import { useState } from 'react';
import { Smartphone, Radio, Star, CheckCircle, ArrowRight, Zap, RefreshCw, Sparkles } from 'lucide-react';
import ExactPlaqueGraphic from './ExactPlaqueGraphic';
import { useProductImage } from '../context/ProductImageContext';

interface ExperienceSimulatorProps {
  onOpenOrderModal: () => void;
}

export default function ExperienceSimulator({ onOpenOrderModal }: ExperienceSimulatorProps) {
  const { imageSrc } = useProductImage();
  const [isTapped, setIsTapped] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('Mi Negocio');
  const [viewStyle, setViewStyle] = useState<'exact_graphic' | 'real_photo'>('exact_graphic');

  const handleTap = () => {
    setIsTapped(true);
    setSubmitted(false);
  };

  const handleReset = () => {
    setIsTapped(false);
    setSubmitted(false);
  };

  return (
    <section id="simulador" className="py-20 lg:py-28 bg-neutral-900/50 border-y border-neutral-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Simulador de Interacción en Tiempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
            Prueba cómo interactúa tu cliente con la placa real
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Comprueba la rapidez de la tecnología contactless: acerca el teléfono virtual y observa cómo se abre inmediatamente la pantalla de calificación de Google.
          </p>
        </div>

        {/* Business Name Customizer */}
        <div className="max-w-md mx-auto mb-10 flex items-center gap-3 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 shadow-md">
          <label className="text-xs text-neutral-400 pl-2 font-medium whitespace-nowrap">
            Nombre de tu local:
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value || 'Mi Negocio')}
            maxLength={32}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
            placeholder="Ej: Cafetería Central, Barbería Atlas..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: Real Plaque with NFC Wireless Waves */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* View Switcher for the Simulator */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <button
                onClick={() => setViewStyle('exact_graphic')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewStyle === 'exact_graphic'
                    ? 'bg-neutral-800 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Diseño Vectorial 1:1
              </button>
              <button
                onClick={() => setViewStyle('real_photo')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewStyle === 'real_photo'
                    ? 'bg-neutral-800 text-cyan-400 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Foto Real de Estudio
              </button>
            </div>

            <div className="relative w-full max-w-sm flex justify-center items-center py-4">
              {viewStyle === 'exact_graphic' ? (
                <div className="relative">
                  <ExactPlaqueGraphic
                    interactive
                    onTap={handleTap}
                    isTapped={isTapped}
                  />

                  {/* 3 Glowing Cyan NFC Waves matching the horizontal flyer */}
                  {isTapped && (
                    <div className="absolute -top-3 -right-4 flex items-center gap-1 text-cyan-400 animate-pulse pointer-events-none">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M8 5a10 10 0 0 1 10 10" />
                        <path d="M11 8a6 6 0 0 1 6 6" />
                        <path d="M14 11a2 2 0 0 1 2 2" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={handleTap}
                  className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden border border-neutral-700 bg-black shadow-2xl cursor-pointer group transition-all"
                >
                  <img
                    src={imageSrc}
                    alt="Placa frontal real Google Reviews Atlas"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {isTapped && (
                    <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in">
                      <div className="p-3 bg-neutral-950/90 rounded-xl border border-cyan-400 text-cyan-400 text-xs font-bold shadow-lg">
                        ¡Señal NFC Leída!
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tap Action Controls */}
            <div className="mt-5 flex items-center gap-3">
              {!isTapped ? (
                <button
                  onClick={handleTap}
                  className="px-6 py-3.5 text-sm font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-xl shadow-[0_0_25px_rgba(0,163,255,0.4)] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Acercar Celular a la Placa</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-5 py-3 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reiniciar Simulación</span>
                </button>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 mt-2">
              Haz clic sobre la placa o en el botón para simular el toque.
            </div>
          </div>

          {/* Right Column: Customer Smartphone Response */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-[36px] p-3 bg-neutral-800/90 border-4 border-neutral-700 shadow-2xl relative">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-neutral-900 rounded-full mx-auto mb-2" />

              {/* Screen Content */}
              <div className="bg-neutral-950 rounded-[28px] p-4 min-h-[470px] flex flex-col justify-between border border-neutral-800 overflow-hidden relative">
                {!isTapped ? (
                  /* Idle Phone */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 mb-4 animate-bounce">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div className="text-base font-bold text-white mb-2">
                      Esperando lectura NFC...
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                      El cliente solo acerca su teléfono a la placa sin abrir aplicaciones ni desbloquear menús complicados.
                    </p>
                    <button
                      onClick={handleTap}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                    >
                      Haz clic para simular el toque →
                    </button>
                  </div>
                ) : (
                  /* Triggered Google Screen matching the phone in the flyer */
                  <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-blue-400 text-sm">G</span>
                        <span className="text-xs font-semibold text-neutral-300">Google Reseñas</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        Conectado
                      </span>
                    </div>

                    {/* Flyer Phone Banner: Google + 5 stars + "¡Tu opinión nos ayuda!" */}
                    <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-center mb-4">
                      {/* Multicolored Google */}
                      <div className="text-lg font-bold font-sans tracking-tight mb-1">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                      </div>
                      {/* Stars */}
                      <div className="flex justify-center gap-1 text-[#FBBC05] mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                        ))}
                      </div>
                      {/* Box from flyer */}
                      <div className="inline-block px-3 py-1 bg-black rounded-lg border border-neutral-700 text-xs font-bold text-white shadow-inner">
                        ¡Tu opinión nos ayuda!
                      </div>
                    </div>

                    {!submitted ? (
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Calificando a: <strong className="text-white">{businessName}</strong>
                          </div>

                          <div className="flex items-center justify-center gap-2 p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="p-1 hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-neutral-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>

                          <textarea
                            rows={2}
                            defaultValue="Excelente atención y productos. 100% recomendado!"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                          />
                        </div>

                        <div className="mt-3 pt-2 border-t border-neutral-800">
                          <button
                            onClick={() => setSubmitted(true)}
                            className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                          >
                            <span>Publicar Reseña</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Success */
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 animate-in fade-in">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <div className="text-sm font-bold text-white mb-1">
                          ¡Reseña de 5★ Publicada!
                        </div>
                        <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">
                          Tu cliente calificó en 5 segundos sin fricciones.
                        </p>
                        <button
                          onClick={onOpenOrderModal}
                          className="px-4 py-2 text-xs font-bold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer"
                        >
                          Pedir placas para mi local
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Zap className="w-3.5 h-3.5" /> 1 solo toque = Reseña directa
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
