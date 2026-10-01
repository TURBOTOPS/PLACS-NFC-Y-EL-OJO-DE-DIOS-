import { useState } from 'react';
import { PRICING_TIERS, calculateOrderPrice, formatCLP, ATLAS_CONTACT } from '../types';
import { Check, MessageCircle, Mail, Sparkles, Plus, Minus, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface PricingCalculatorProps {
  onOpenOrderModalWithQty: (qty: number) => void;
}

export default function PricingCalculator({ onOpenOrderModalWithQty }: PricingCalculatorProps) {
  const [selectedQty, setSelectedQty] = useState<number>(2);

  const pricing = calculateOrderPrice(selectedQty);

  const handleWhatsAppDirect = (qty: number) => {
    const p = calculateOrderPrice(qty);
    const msg = `Hola Atlas Automatizaciones! Quiero cotizar/comprar ${qty} ${
      qty === 1 ? 'Placa NFC Google Reviews' : 'Placas NFC Google Reviews'
    } por un total de ${formatCLP(p.totalPrice)} (${formatCLP(p.unitPrice)} c/u). ¿Me podrían dar los detalles de pago y envío?`;
    const url = `https://wa.me/${ATLAS_CONTACT.whatsappRaw}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailDirect = (qty: number) => {
    const p = calculateOrderPrice(qty);
    const subject = `Cotización Placas NFC Google Reviews - ${qty} ${qty === 1 ? 'Unidad' : 'Unidades'}`;
    const body = `Hola Atlas Automatizaciones,\n\nQuisiera solicitar cotización para la compra de ${qty} Placa(s) NFC Google Reviews.\n\nCantidad: ${qty} unidad(es)\nPrecio unitario: ${formatCLP(p.unitPrice)}\nTotal estimado: ${formatCLP(p.totalPrice)}\n\nFavor indicarme los pasos a seguir para enviar los datos de mi negocio y coordinar el despacho.\n\nSaludos!`;
    const mailto = `mailto:${ATLAS_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <section id="precios" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Inversión Única · Sin Mensualidades</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
          Valores oficiales y descuentos por volumen
        </h2>
        <p className="text-base sm:text-lg text-neutral-400">
          Elige la cantidad ideal para tus puntos de cobro, terrazas o sucursales. Mientras más placas equipes, mayor es tu ahorro por unidad.
        </p>
      </div>

      {/* The 3 Official Tiers as featured in the Flyer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PRICING_TIERS.map((tier) => {
          const isSelected =
            (tier.minQty === 1 && selectedQty === 1) ||
            (tier.minQty === 2 && selectedQty === 2) ||
            (tier.minQty === 3 && selectedQty >= 3);

          return (
            <div
              key={tier.label}
              onClick={() => setSelectedQty(tier.minQty)}
              className={`relative rounded-2xl p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'bg-neutral-900/90 border-cyan-400 shadow-[0_0_30px_rgba(0,163,255,0.25)] scale-102'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  Más Recomendado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-neutral-300 uppercase tracking-wider">
                    {tier.label}
                  </span>
                  <span className="text-xs text-cyan-400 font-medium">
                    {tier.savingsNote}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-4xl sm:text-5xl font-display font-black text-white tabular-nums tracking-tight">
                    {formatCLP(tier.unitPrice)}
                  </div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-1">
                    Por Unidad
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-neutral-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Placa acrílica premium con chip NFC integrado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>QR de respaldo de alta definición grabado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Pre-programación gratuita con tu enlace</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Cero mensualidades · Pago único de por vida</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenOrderModalWithQty(tier.minQty);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-md'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                <span>Seleccionar {tier.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Custom Quantity Calculator Box */}
      <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Calculadora de Pedido para tu Empresa</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-3">
              ¿Cuántas placas necesitas para tu negocio?
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Equipa cada caja de pago, mesón de atención, terraza o sucursales de tu local para que ningún cliente se vaya sin dejar su reseña.
            </p>

            {/* Stepper buttons */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-neutral-300 font-medium">Cantidad:</span>
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-16 text-center font-display font-black text-xl text-white tabular-nums">
                  {selectedQty}
                </div>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="w-10 h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                {[1, 2, 3, 5, 10].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSelectedQty(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      selectedQty === preset
                        ? 'bg-cyan-500 text-neutral-950'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {preset} {preset === 1 ? 'un.' : 'un.'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier feedback message */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 text-xs text-neutral-300 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Tarifa aplicada: <strong className="text-white">{pricing.appliedTier.label}</strong> a{' '}
                <strong className="text-cyan-400">{formatCLP(pricing.unitPrice)}</strong> por unidad.
                {pricing.savings > 0 && (
                  <span className="text-emerald-400 ml-1">
                    (Estás ahorrando {formatCLP(pricing.savings)})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Summary and Direct Purchase Actions */}
          <div className="lg:col-span-5 bg-neutral-950 p-6 sm:p-7 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">
                Resumen de tu Cotización
              </div>
              <div className="space-y-2 text-sm pb-4 border-b border-neutral-800">
                <div className="flex justify-between text-neutral-300">
                  <span>Placas ({selectedQty} {selectedQty === 1 ? 'unidad' : 'unidades'}):</span>
                  <span className="tabular-nums font-mono">{formatCLP(pricing.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Programación de chip NFC:</span>
                  <span className="text-emerald-400 font-semibold">GRATIS</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Envíos:</span>
                  <span className="text-cyan-400">Todo Chile</span>
                </div>
                {pricing.savings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Ahorro por volumen:</span>
                    <span className="tabular-nums font-mono">-{formatCLP(pricing.savings)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mb-6 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total a pagar:</span>
                <span className="text-3xl font-display font-extrabold text-cyan-400 tabular-nums">
                  {formatCLP(pricing.totalPrice)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onOpenOrderModalWithQty(selectedQty)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-neutral-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-[0_0_20px_rgba(0,163,255,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Completar Solicitud en Línea</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleWhatsAppDirect(selectedQty)}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => handleEmailDirect(selectedQty)}
                  className="py-2.5 px-3 rounded-lg text-xs font-semibold text-blue-400 bg-blue-950/40 hover:bg-blue-950/80 border border-blue-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Correo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
