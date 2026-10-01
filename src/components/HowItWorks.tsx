import { ArrowRight, Sparkles, Send, Cpu, PackageCheck, Star } from 'lucide-react';

interface HowItWorksProps {
  onOpenOrderModal: () => void;
}

export default function HowItWorks({ onOpenOrderModal }: HowItWorksProps) {
  const steps = [
    {
      num: '01',
      icon: Send,
      title: 'Pides tus placas y nos das tu negocio',
      description:
        'Indícanos cuántas placas necesitas y el nombre o enlace de tu ficha en Google Maps. Si no sabes cómo sacarlo, nosotros lo buscamos y configuramos por ti.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Atlas programa y calibra cada placa',
      description:
        'Grabamos el chip NFC con tu URL directa de calificación y verificamos la lectura instantánea en dispositivos iOS y Android.',
    },
    {
      num: '03',
      icon: PackageCheck,
      title: 'Despacho seguro a todo Chile',
      description:
        'Embalamos tus placas con protección de alto impacto y las enviamos a cualquier ciudad o comuna de Chile vía Starken, Chilexpress o Blue Express.',
    },
    {
      num: '04',
      icon: Star,
      title: 'La pones en tu mesón y recibes reseñas',
      description:
        'Cero configuración para ti. Solo la apoyas en la caja o recepción. Cada cliente que paga acerca su celular y deja sus 5 estrellas.',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-neutral-900/30 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Proceso Simple y Transparente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
            Cómo implementamos tus placas en 4 simples pasos
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Tú no tienes que programar nada técnico. En Atlas nos encargamos de todo para que recibas un producto listo para generar resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl bg-neutral-900/70 border border-neutral-800/90 p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-display font-black text-neutral-600 group-hover:text-cyan-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenOrderModal}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-[0_0_20px_rgba(0,102,255,0.3)] cursor-pointer"
          >
            <span>Pedir mis placas ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
