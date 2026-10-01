import { useState, useId } from 'react';
import { X, MessageCircle, Mail, HelpCircle, CheckCircle2, ShieldCheck, Copy, Check, Plus, Minus } from 'lucide-react';
import { calculateOrderPrice, formatCLP, CHILE_REGIONS, ATLAS_CONTACT, OrderFormData } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQty?: number;
  onOpenLinkGuide: () => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  initialQty = 2,
  onOpenLinkGuide,
}: OrderModalProps) {
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    googleMapsLink: '',
    region: 'Región Metropolitana de Santiago',
    city: '',
    shippingAddress: '',
    quantity: initialQty,
    notes: '',
    paymentPreference: 'transferencia',
  });

  const [submittedType, setSubmittedType] = useState<'whatsapp' | 'email' | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const orderRef = useId().replace(/:/g, '').toUpperCase().slice(0, 6);

  if (!isOpen) return null;

  const pricing = calculateOrderPrice(quantity);

  const handleQtyChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);
    setQuantity(validQty);
    setFormData((prev) => ({ ...prev, quantity: validQty }));
  };

  const generateOrderText = () => {
    return `🔔 *SOLICITUD DE PLACAS NFC - ATLAS AUTOMATIZACIONES*
Ref: #ATLAS-${orderRef}
------------------------------------
🏢 *Negocio:* ${formData.businessName || 'Por indicar'}
👤 *Contacto:* ${formData.fullName || 'Por indicar'}
📞 *Teléfono/WhatsApp:* ${formData.phone || 'Por indicar'}
📧 *Correo:* ${formData.email || 'Por indicar'}
📍 *Ubicación:* ${formData.city || ''}, ${formData.region}
🏠 *Dirección de Envío:* ${formData.shippingAddress || 'A coordinar'}

📦 *DETALLE DEL PEDIDO:*
- Cantidad: ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}
- Tarifa: ${pricing.appliedTier.label} (${formatCLP(pricing.unitPrice)} c/u)
- Total a Pagar: ${formatCLP(pricing.totalPrice)} CLP
${pricing.savings > 0 ? `✨ Ahorro aplicado: ${formatCLP(pricing.savings)} CLP` : ''}

🔗 *Link / Ficha Google Maps:*
${formData.googleMapsLink || 'Solicito que Atlas busque mi local con la dirección proporcionada'}

💳 *Preferencia de Pago:* ${
      formData.paymentPreference === 'transferencia'
        ? 'Transferencia Bancaria'
        : formData.paymentPreference === 'webpay'
        ? 'WebPay (Débito/Crédito)'
        : 'Coordinar con asesor'
    }
📝 *Notas:* ${formData.notes || 'Ninguna'}
------------------------------------
Hola Atlas Automatizaciones, me gustaría concretar esta solicitud.`;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.phone) {
      alert('Por favor completa al menos el nombre de tu negocio y tu teléfono/WhatsApp.');
      return;
    }

    const message = generateOrderText();
    const whatsappUrl = `https://wa.me/${ATLAS_CONTACT.whatsappRaw}?text=${encodeURIComponent(message)}`;
    setSubmittedType('whatsapp');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email) {
      alert('Por favor completa al menos el nombre de tu negocio y tu correo electrónico.');
      return;
    }

    const subject = `[COTIZACIÓN #${orderRef}] Placas NFC Google Reviews - ${formData.businessName} (${quantity} un)`;
    const body = generateOrderText();
    const mailtoUrl = `mailto:${ATLAS_CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmittedType('email');
    window.location.href = mailtoUrl;
  };

  const handleCopySummary = () => {
    const text = generateOrderText();
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedType ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Solicitud y Cotización Oficial
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
                Configura tu pedido de Placas NFC
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Indícanos los datos de tu negocio. En Atlas Automatizaciones las programamos con tu enlace exacto de Google Reviews y te las despachamos listas para usar.
              </p>
            </div>

            {/* Quantity & Price Ribbon */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-medium">Cantidad:</span>
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-bold text-base text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
                  {quantity === 1 ? 'Placa' : 'Placas'}
                </span>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <div className="text-[11px] text-neutral-400">
                  {formatCLP(pricing.unitPrice)} c/u
                  {pricing.savings > 0 && (
                    <span className="text-emerald-400 ml-1.5 font-bold">
                      (Ahorras {formatCLP(pricing.savings)})
                    </span>
                  )}
                </div>
                <div className="text-xl font-display font-extrabold text-cyan-400 tabular-nums">
                  Total: {formatCLP(pricing.totalPrice)}
                </div>
              </div>
            </div>

            {/* Main Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Nombre de tu Negocio / Comercio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Ej: Cafetería Central, Clínica Dental San Lucas"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Contact Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Nombre del Contacto o Encargado *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@minegocio.cl"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Maps Link / Ficha del negocio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Enlace de tu negocio en Google Maps (opcional)
                  </label>
                  <button
                    type="button"
                    onClick={onOpenLinkGuide}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>¿Cómo sacar el link?</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.googleMapsLink}
                  onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                  placeholder="https://g.page/r/... o pega el link de Maps"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none font-mono text-xs"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  💡 Si no tienes el enlace ahora, déjanos tu dirección exacta abajo y nosotros buscaremos tu ficha oficial en Google para programarla sin costo.
                </p>
              </div>

              {/* Shipping location: Region & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Región de Chile *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                  >
                    {CHILE_REGIONS.map((reg) => (
                      <option key={reg} value={reg} className="bg-neutral-900 text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Ciudad / Comuna *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej: Providencia, Concepción, La Serena..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Dirección de Envío o Sucursal de Retiro
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Calle, número, depto o 'Retiro en sucursal Starken'"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Payment preference */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Forma de Pago Preferida
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentPreference: 'transferencia' })}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                      formData.paymentPreference === 'transferencia'
                        ? 'bg-neutral-800 border-cyan-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white">Transferencia</div>
                    <div className="text-[10px] text-neutral-400">Banco de Chile / Santander</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentPreference: 'webpay' })}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                      formData.paymentPreference === 'webpay'
                        ? 'bg-neutral-800 border-cyan-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white">WebPay</div>
                    <div className="text-[10px] text-neutral-400">Débito y Crédito en cuotas</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentPreference: 'por_coordinar' })}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                      formData.paymentPreference === 'por_coordinar'
                        ? 'bg-neutral-800 border-cyan-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-white">Por Coordinar</div>
                    <div className="text-[10px] text-neutral-400">Hablar con asesor Atlas</div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp submit button */}
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </button>

                  {/* Email submit button */}
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(0,102,255,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Enviar Cotización por Correo</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Respuesta inmediata en horario comercial</span>
                  </span>
                  <span>WhatsApp: {ATLAS_CONTACT.whatsappNumber}</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="py-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-display font-extrabold text-white mb-2">
              ¡Solicitud Generada con Éxito!
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto mb-6">
              {submittedType === 'whatsapp'
                ? 'Se ha abierto tu WhatsApp con todos los datos precargados para coordinar la programación y el envío con nuestro equipo.'
                : 'Se ha abierto tu gestor de correo para enviar la cotización directa a atlasautomatizaciones540@gmail.com.'}
            </p>

            {/* Voucher preview */}
            <div className="max-w-md mx-auto bg-neutral-950 p-5 rounded-2xl border border-neutral-800 text-left mb-6 font-mono text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between border-b border-neutral-800 pb-2 font-sans font-bold text-white">
                <span>Atlas Automatizaciones</span>
                <span className="text-cyan-400">#ATLAS-{orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Negocio:</span>
                <span>{formData.businessName || 'Por confirmar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Placas:</span>
                <span>{quantity} un. ({formatCLP(pricing.totalPrice)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Destino:</span>
                <span>{formData.city || formData.region}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copiado al portapapeles</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar resumen de pedido</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedType(null);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-xs font-bold text-neutral-950 cursor-pointer transition-colors"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
