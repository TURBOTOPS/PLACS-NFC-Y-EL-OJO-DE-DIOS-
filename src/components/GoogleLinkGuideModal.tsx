import { X, ExternalLink, CheckCircle2, Search, Share2, Copy } from 'lucide-react';

interface GoogleLinkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleLinkGuideModal({ isOpen, onClose }: GoogleLinkGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
          <span>Guía Rápida</span>
        </div>
        <h3 className="text-2xl font-display font-extrabold text-white mb-2">
          ¿Cómo obtener el enlace de Google Reviews de tu negocio?
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Sigue estos 3 pasos para obtener el link que abre directamente las 5 estrellas para tus clientes:
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Busca tu negocio en Google o Google Maps</span>
                <Search className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Ingresa a Google con la cuenta que administra tu local y busca el nombre exacto de tu empresa. Aparecerá el panel "Tu empresa en Google".
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Haz clic en "Pedir reseñas"</span>
                <Share2 className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Dentro de las opciones de tu perfil, verás un botón que dice <strong>"Pedir opiniones"</strong> o <strong>"Solicitar reseñas"</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Copia el enlace que te entrega</span>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Google te dará un enlace corto (suele ser <span className="font-mono text-cyan-400 text-[11px]">https://g.page/r/.../review</span>). Cópialo y pégalo en el formulario.
              </p>
            </div>
          </div>
        </div>

        {/* Alternative reassurance note */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-neutral-950 border border-cyan-800/40 mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>¿Te resulta complicado o no tienes acceso ahora?</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            ¡No te compliques! Puedes dejar ese campo en blanco o escribir únicamente el <strong>nombre de tu local, dirección y comuna</strong>. En Atlas Automatizaciones buscaremos tu ficha oficial y la programaremos con total precisión por ti.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-bold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors cursor-pointer"
        >
          Entendido, volver a la solicitud
        </button>
      </div>
    </div>
  );
}
