import { TrendingUp, Search, Zap, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProductImage } from '../context/ProductImageContext';

export default function Benefits() {
  const { imageSrc } = useProductImage();
  return (
    <section id="beneficios" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-3xl mb-16">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Por qué funciona tan bien</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
          El secreto para aparecer primero cuando buscan tu rubro en Google
        </h2>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
          Google Maps y los resultados de búsqueda priorizan comercios con opiniones recientes, frecuentes y auténticas. Nuestra placa convierte a tus clientes felices en tu mejor herramienta de marketing.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Local SEO dominance (Large col-span-7) */}
        <div className="md:col-span-7 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400">
                01. Algoritmo de Google Maps
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              Posicionamiento natural en las primeras posiciones
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6">
              Cuando alguien busca en su teléfono "cafetería cerca de mí", "clínica dental", "restaurante" o "taller mecánico", Google coloca en los primeros 3 lugares del mapa a los negocios con mayor cantidad y frescura de reseñas de 5 estrellas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
            <span className="font-semibold text-white">Impacto en búsquedas locales:</span>
            <span className="text-cyan-400 font-bold tabular-nums">+78% visitas presenciales</span>
          </div>
        </div>

        {/* Card 2: Exact Product Photo in Studio (Col-span-5) */}
        <div className="md:col-span-5 rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950 relative group flex flex-col justify-between p-6">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-neutral-800 mb-4">
            <img
              src={imageSrc}
              alt="Placa oficial NFC Google Reviews 14x12cm"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-1">
              Modelo Exacto en Acrílico
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              14 cm de alto × 12 cm de ancho
            </h4>
            <p className="text-xs text-neutral-400">
              Acrílico moldeado en L con canto transparente. El modelo original que recibirás en tu negocio.
            </p>
          </div>
        </div>

        {/* Card 3: Zero friction (Col-span-4) */}
        <div className="md:col-span-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400">
                02. Fricción Cero
              </span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Elimina la pereza del cliente
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Pedirle a alguien "búscanos en Google" casi nunca funciona porque se les olvida al salir. Con un simple toque del celular, la pantalla se abre directo en las 5 estrellas.
            </p>
          </div>
          <div className="mt-6 text-xs text-neutral-400 border-t border-neutral-800/80 pt-4">
            Compatible con iPhone, Samsung, Xiaomi, Motorola y cualquier dispositivo NFC.
          </div>
        </div>

        {/* Card 4: Massive social proof (Col-span-4) */}
        <div className="md:col-span-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400">
                03. Prueba Social
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Multiplica la confianza de nuevos clientes
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              El 93% de las personas lee reseñas en Google antes de visitar un local por primera vez. Un negocio con más de 150 reseñas de 5 estrellas siempre gana la decisión de compra.
            </p>
          </div>
          <div className="mt-6 text-xs text-neutral-400 border-t border-neutral-800/80 pt-4">
            Cada reseña se queda para siempre trabajando 24/7 a favor de tu marca.
          </div>
        </div>

        {/* Card 5: Pre-programmed ready to use (Col-span-4) */}
        <div className="md:col-span-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400">
                04. Listo para Usar
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Llega 100% configurado
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              En Atlas Automatizaciones programamos el chip NFC con el enlace directo de tu negocio antes de despachar. Tú solo abres el paquete, la colocas en el mesón y listo.
            </p>
          </div>
          <div className="mt-6 text-xs text-neutral-400 border-t border-neutral-800/80 pt-4">
            Sin instalaciones técnicas ni configuraciones complicadas por tu parte.
          </div>
        </div>
      </div>
    </section>
  );
}
