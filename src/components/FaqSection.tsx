import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: '¿Cómo funciona exactamente la placa NFC?',
      a: 'La placa contiene un microchip NFC pasivo integrado dentro del acrílico. Cuando un cliente acerca su teléfono inteligente (sin necesidad de tocarla físicamente ni apretar ningún botón), el celular lee la señal electromagnética inductiva y abre de forma inmediata tu perfil de Google Reviews con las 5 estrellas listas para enviar.',
    },
    {
      q: '¿Qué pasa con los clientes que tienen celulares sin NFC?',
      a: 'Cada placa incluye un código QR dinámico de alta resolución impreso y protegido en la cara frontal. Si alguien tiene un teléfono muy antiguo sin NFC, simplemente abre su cámara y escanea el código, llegando exactamente al mismo enlace directo de reseñas en 1 segundo.',
    },
    {
      q: '¿Necesita estar enchufada, tener pilas o cargarse?',
      a: '¡No! La tecnología NFC es completamente pasiva. Se alimenta diminutamente por la inducción electromagnética del propio celular del cliente en el milisegundo en que lo acerca. No tiene cables, no gasta batería ni se descarga jamás.',
    },
    {
      q: '¿Cómo le envían el enlace de mi negocio a Atlas?',
      a: 'Al solicitar tus placas en nuestra página, puedes ingresar el enlace de Google Maps de tu negocio. Si no sabes cómo sacarlo, simplemente indícanos el nombre comercial de tu local, dirección y comuna. Nuestro equipo técnico en Atlas Automatizaciones buscará tu ficha oficial y la grabará en el chip antes del envío.',
    },
    {
      q: '¿Tiene algún costo mensual, suscripción o mantenimiento?',
      a: 'Cero mensualidades. Es un pago único de por vida. La placa es 100% tuya y continuará funcionando año tras año sin ningún cobro recurrente.',
    },
    {
      q: '¿Cómo se realizan los envíos y cuánto tardan a regiones?',
      a: 'Despachamos a todo el territorio chileno vía Starken, Chilexpress o Blue Express con número de seguimiento en línea. El tiempo de entrega promedio es de 24 a 48 horas hábiles para la Región Metropolitana y de 2 a 4 días para regiones extremas.',
    },
    {
      q: '¿Puedo reprogramar la placa si en el futuro cambio de local?',
      a: 'Sí. Si en el futuro cambias el nombre de tu local o creas una nueva ficha en Google, puedes reprogramar el chip en cualquier momento usando aplicaciones gratuitas desde tu celular (como NFC Tools), o nosotros te brindamos soporte técnico post-venta gratuito.',
    },
  ];

  return (
    <section id="preguntas" className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Preguntas Frecuentes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
          Resolvemos todas tus dudas
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          Todo lo que necesitas saber antes de equipar tu local con las placas NFC de Atlas Automatizaciones.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'bg-neutral-900/90 border-neutral-700'
                  : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-4 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
