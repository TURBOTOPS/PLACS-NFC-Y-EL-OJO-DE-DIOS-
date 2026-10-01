import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { ATLAS_CONTACT } from '../types';

export default function FloatingWhatsApp() {
  const [showBubble, setShowBubble] = useState(true);

  const handleClick = () => {
    const text = 'Hola Atlas Automatizaciones! Quisiera más información sobre las Placas NFC Google Reviews para mi negocio.';
    const url = `https://wa.me/${ATLAS_CONTACT.whatsappRaw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {showBubble && (
        <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-3 shadow-xl max-w-xs text-xs text-neutral-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
            aria-label="Cerrar aviso"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="font-bold text-white mb-0.5">¿Consultas o pedidos directos?</div>
          <p className="text-[11px] text-neutral-400">
            Escríbenos al WhatsApp <span className="text-emerald-400 font-semibold">{ATLAS_CONTACT.whatsappNumber}</span>
          </p>
        </div>
      )}

      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative"
        aria-label="Chatear por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-400 border-2 border-neutral-950 rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-400 border-2 border-neutral-950 rounded-full" />
      </button>
    </div>
  );
}
