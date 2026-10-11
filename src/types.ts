export interface PricingTier {
  minQty: number;
  unitPrice: number; // Precio neto (sin IVA)
  label: string;
  badge?: string;
  popular?: boolean;
  savingsNote?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    minQty: 1,
    unitPrice: 49990,
    label: '1 Unidad',
    badge: 'Ideal para probar',
    savingsNote: 'Precio estándar unitario',
  },
  {
    minQty: 2,
    unitPrice: 45990,
    label: '2 Unidades',
    badge: 'Más Popular',
    popular: true,
    savingsNote: '¡Ahorras $8.000 + IVA en total!',
  },
  {
    minQty: 3,
    unitPrice: 42990,
    label: '+3 Unidades',
    badge: 'Mayor Descuento',
    savingsNote: '¡Ahorras $21.000 + IVA o más!',
  },
];

export const IVA_RATE = 0.19; // 19% IVA en Chile

export function calculateOrderPrice(quantity: number): {
  unitPrice: number;          // Precio neto unitario ($49.990, $45.990, $42.990)
  netUnitPrice: number;       // Alias explícito de precio neto unitario
  unitPriceWithIva: number;   // Precio unitario con IVA incluido
  netTotalPrice: number;      // Subtotal neto
  ivaAmount: number;          // Monto del 19% de IVA
  totalPriceWithIva: number;  // Total final con IVA incluido
  totalPrice: number;         // Total final a pagar (con IVA)
  regularNetPrice: number;    // Precio regular de lista neto
  savingsNet: number;         // Ahorro neto
  savingsWithIva: number;     // Ahorro con IVA
  savings: number;            // Ahorro total
  appliedTier: PricingTier;
} {
  const qty = Math.max(1, Math.round(quantity));
  let appliedTier = PRICING_TIERS[0];

  if (qty === 2) {
    appliedTier = PRICING_TIERS[1];
  } else if (qty >= 3) {
    appliedTier = PRICING_TIERS[2];
  }

  const netUnitPrice = appliedTier.unitPrice;
  const unitPrice = netUnitPrice;
  const unitPriceWithIva = Math.round(netUnitPrice * (1 + IVA_RATE));

  const netTotalPrice = netUnitPrice * qty;
  const ivaAmount = Math.round(netTotalPrice * IVA_RATE);
  const totalPriceWithIva = netTotalPrice + ivaAmount;
  const totalPrice = totalPriceWithIva;

  const regularNetPrice = PRICING_TIERS[0].unitPrice * qty;
  const savingsNet = Math.max(0, regularNetPrice - netTotalPrice);
  const savingsWithIva = Math.round(savingsNet * (1 + IVA_RATE));
  const savings = savingsWithIva;

  return {
    unitPrice,
    netUnitPrice,
    unitPriceWithIva,
    netTotalPrice,
    ivaAmount,
    totalPriceWithIva,
    totalPrice,
    regularNetPrice,
    savingsNet,
    savingsWithIva,
    savings,
    appliedTier,
  };
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface OrderFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  googleMapsLink: string;
  region: string;
  city: string;
  shippingAddress: string;
  quantity: number;
  notes: string;
  paymentPreference: 'transferencia' | 'webpay' | 'por_coordinar';
}

export const CHILE_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Región Metropolitana de Santiago',
  "Libertador General Bernardo O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del G. Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena',
];

export const ATLAS_CONTACT = {
  whatsappNumber: '+569 2250 2197',
  whatsappRaw: '56922502197',
  email: 'atlasautomatizaciones540@gmail.com',
  companyName: 'Atlas Automatizaciones',
  slogan: 'Tu negocio en las primeras búsquedas',
};
