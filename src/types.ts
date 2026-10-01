export interface PricingTier {
  minQty: number;
  unitPrice: number;
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
    savingsNote: 'Precio estándar por placa',
  },
  {
    minQty: 2,
    unitPrice: 45990,
    label: '2 Unidades',
    badge: 'Más Popular',
    popular: true,
    savingsNote: '¡Ahorras $8.000 en total!',
  },
  {
    minQty: 3,
    unitPrice: 42990,
    label: '+3 Unidades',
    badge: 'Mayor Descuento',
    savingsNote: '¡Ahorras $21.000 o más!',
  },
];

export function calculateOrderPrice(quantity: number): {
  unitPrice: number;
  totalPrice: number;
  regularPrice: number;
  savings: number;
  appliedTier: PricingTier;
} {
  const qty = Math.max(1, Math.round(quantity));
  let appliedTier = PRICING_TIERS[0];

  if (qty === 2) {
    appliedTier = PRICING_TIERS[1];
  } else if (qty >= 3) {
    appliedTier = PRICING_TIERS[2];
  }

  const unitPrice = appliedTier.unitPrice;
  const totalPrice = unitPrice * qty;
  const regularPrice = PRICING_TIERS[0].unitPrice * qty;
  const savings = Math.max(0, regularPrice - totalPrice);

  return {
    unitPrice,
    totalPrice,
    regularPrice,
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
