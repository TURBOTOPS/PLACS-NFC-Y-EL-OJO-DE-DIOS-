import AtlasLogo from './AtlasLogo';
import { ATLAS_CONTACT } from '../types';
import { Mail, MessageCircle, MapPin, Truck, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenOrderModal: () => void;
}

export default function Footer({ onOpenOrderModal }: FooterProps) {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <AtlasLogo size="md" />
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Placas inteligentes NFC Google Reviews para locales, restaurantes, clínicas y comercios. Posiciona tu negocio en los primeros lugares de búsqueda eliminando la fricción de calificar.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Envíos a todo Chile</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compra 100% Segura</span>
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-white">
              Navegación
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beneficios" className="hover:text-cyan-400 transition-colors">
                  Beneficios y Local SEO
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">
                  Cómo Funciona la Placa
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-cyan-400 transition-colors">
                  Simulador Interactivo de Toque
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-cyan-400 transition-colors">
                  Tarifas y Descuentos por Volumen
                </a>
              </li>
              <li>
                <a href="#preguntas" className="hover:text-cyan-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Sales & Support Channels */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-white">
              Canales de Venta & Cotizaciones
            </div>
            <div className="space-y-2.5 text-xs">
              <a
                href={`https://wa.me/${ATLAS_CONTACT.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">WhatsApp Directo</div>
                  <div className="text-[11px] text-neutral-400">{ATLAS_CONTACT.whatsappNumber}</div>
                </div>
              </a>

              <a
                href={`mailto:${ATLAS_CONTACT.email}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Correo Electrónico</div>
                  <div className="text-[11px] text-neutral-400">{ATLAS_CONTACT.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Santiago, Chile · Cobertura y despachos a nivel nacional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Atlas Automatizaciones. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Diseñado para potenciar el comercio local en Chile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
