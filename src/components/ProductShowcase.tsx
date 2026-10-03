import { ShieldCheck, Cpu, Smartphone, Award, Truck, Layers, Ruler } from 'lucide-react';
import { useProductImage } from '../context/ProductImageContext';

export default function ProductShowcase() {
  const { imageSrc, allImages, selectedId, setSelectedId, activeImage, openManagerModal } = useProductImage();
  const specs = [
    {
      icon: Ruler,
      title: 'Dimensiones Oficiales (14 × 12 × 5 cm)',
      description:
        '14 cm de alto × 12 cm de ancho con base de 5 cm de apoyo. Proporción optimizada para alta visibilidad sin invadir la caja.',
    },
    {
      icon: Layers,
      title: 'Acrílico Moldeado en L con Canto Transparente',
      description:
        'Cuerpo rígido de acrílico con perfil de canto cristalino transparente y cara frontal en negro piano brillante.',
    },
    {
      icon: Cpu,
      title: 'Chip NFC de Rápida Inducción',
      description:
        'Transmite el enlace directo al instante. Tecnología inductiva pasiva: cero pilas, cero cables y cero mantención.',
    },
    {
      icon: Smartphone,
      title: 'Gráfica Oficial Google Reviews',
      description:
        'Texto "Review Us On", anillo cuatricolor, ícono de mano con celular NFC, "TAP HERE", logo Google, 5 estrellas y barra inferior.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Ficha Técnica y Medidas Exactas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
          El único modelo que comercializa Atlas Automatizaciones
        </h2>
        <p className="text-base sm:text-lg text-neutral-400">
          Sin sorpresas: lo que ves en esta fotografía de estudio es exactamente el producto físico que llegará a tu local en cualquier región de Chile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        {/* Left Column: ONLY the real studio photo with dimensions */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            onDoubleClick={openManagerModal}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-neutral-800 bg-black shadow-[0_0_50px_rgba(0,0,0,0.85)] group cursor-pointer"
            title="Doble clic para gestionar imágenes"
          >
            <div className="relative aspect-[3/4] w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={imageSrc}
                alt="Fotografía de estudio modelo exacto placa NFC Google Reviews 14x12x5cm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />

              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-t-3xl pointer-events-none" />
            </div>

            <div className="p-4 bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-800/80 text-neutral-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[11px]">
                  {activeImage?.title || 'Foto de la Placa'}
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Modelo exclusivo en stock (14 × 12 × 5 cm)
                </span>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                100% Original
              </span>
            </div>
          </div>

          {/* Thumbnail switcher between both uploaded images */}
          <div className="flex flex-wrap items-center gap-2 mt-3 w-full max-w-sm justify-center">
            {allImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedId(img.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedId === img.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,163,255,0.3)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-md object-cover border border-white/20"
                />
                <span className="truncate max-w-[120px]">{img.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Technical & Construction Specs */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dimension Details Banner */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                14×12
              </div>
              <div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                  Medidas Oficiales del Fabricante
                </div>
                <div className="text-sm font-bold text-white">
                  Alto: 14 cm · Ancho: 12 cm · Base de apoyo: 5 cm
                </div>
              </div>
            </div>
            <span className="text-xs text-cyan-400 font-semibold hidden sm:inline">
              Formato L-Stand
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900 to-neutral-950 border border-blue-900/40">
            <div className="flex items-center gap-3 mb-1.5">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-sm font-bold text-white">
                Embalaje Rígido & Envíos a Todo Chile
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Cada placa viaja protegida con amortiguación de alto impacto para garantizar que llegue intacta a cualquier punto de Chile vía Starken, Chilexpress o Blue Express con número de seguimiento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
