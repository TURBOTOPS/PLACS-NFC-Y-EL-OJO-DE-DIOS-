import { useState } from 'react';
import { formatCLP } from '../types';
import { TrendingUp, Calculator, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RoiCalculator() {
  const [dailyCustomers, setDailyCustomers] = useState<number>(40);
  const [tapRate, setTapRate] = useState<number>(15); // 15% tap rate

  const monthlyCustomers = dailyCustomers * 26; // 26 working days
  const estimatedMonthlyReviews = Math.round((monthlyCustomers * tapRate) / 100);
  const estimatedYearlyReviews = estimatedMonthlyReviews * 12;

  // Average cost per local lead in Google Ads (~$2.500 CLP per click/lead)
  const equivalentGoogleAdsValue = estimatedMonthlyReviews * 2800;

  return (
    <section className="py-20 bg-neutral-950 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Retorno de Inversión (ROI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-4 text-balance">
            ¿Cuánto vale para tu negocio tener 100+ reseñas nuevas?
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            A diferencia de la publicidad pagada que desaparece cuando dejas de pagar, una reseña positiva en Google trabaja para ti permanentemente atrayendo nuevos clientes de por vida.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Column */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-neutral-200">
                    Clientes atendidos por día en tu local:
                  </label>
                  <span className="text-base font-bold text-cyan-400 tabular-nums">
                    {dailyCustomers} clientes/día
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>10 (Local boutique)</span>
                  <span>100 (Alto flujo)</span>
                  <span>200+ (Franquicia)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-neutral-200">
                    Estimación de clientes que acercan su celular:
                  </label>
                  <span className="text-base font-bold text-cyan-400 tabular-nums">
                    {tapRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={tapRate}
                  onChange={(e) => setTapRate(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>5% (Conservador)</span>
                  <span>15% (Promedio mesón)</span>
                  <span>35% (Incentivado)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-300 font-medium">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Consejo para maximizar el toque:</span>
                </div>
                <p>
                  "Si le dices al cliente al pagar: '¿Nos puedes regalar 3 segundos acercando tu teléfono?', la tasa supera el 30%."
                </p>
              </div>
            </div>

            {/* Projected Results Card */}
            <div className="bg-neutral-950 rounded-2xl p-7 border border-neutral-800 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                    Crecimiento Estimado de Reseñas
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-display font-black text-white tabular-nums">
                      +{estimatedMonthlyReviews}
                    </span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" /> reseñas / mes
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Equivalente a <strong className="text-white tabular-nums">+{estimatedYearlyReviews} reseñas de 5 estrellas al año</strong>.
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-1">
                    Valor Publicitario Orgánico Equivalente
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 tabular-nums">
                    {formatCLP(equivalentGoogleAdsValue)}
                    <span className="text-xs font-normal text-neutral-400 ml-1">/ mes</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Lo que te costaría generar esas visitas mediante anuncios pagados en Google Ads.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-xs text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>La placa se paga sola en los primeros 15 a 30 días de uso.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
