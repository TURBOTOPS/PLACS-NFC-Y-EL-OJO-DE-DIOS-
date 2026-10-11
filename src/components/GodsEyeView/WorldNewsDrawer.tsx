import { useState, useMemo } from 'react';
import {
  Newspaper,
  X,
  ExternalLink,
  Globe2,
  TrendingUp,
  Clock,
  Sparkles,
  Search,
  Filter,
  Flame,
  Radio,
  MapPin,
  RefreshCw,
  Compass
} from 'lucide-react';

export interface WorldNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'geopolitics' | 'markets' | 'space_tech' | 'climate' | 'chile_latam';
  categoryLabel: string;
  source: string;
  timeAgo: string;
  isUrgent?: boolean;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
    zoom?: number;
  };
  tags: string[];
}

export const WORLD_NEWS_FEED: WorldNewsItem[] = [
  {
    id: 'news-1',
    title: 'Reserva Federal y bancos centrales evalúan nuevo ciclo de liquidez para el cierre de año',
    summary: 'Los mercados de renta variable en Wall Street y Europa registran alzas moderadas tras los recientes reportes de estabilidad laboral e inflación.',
    category: 'markets',
    categoryLabel: 'Economía & Mercados',
    source: 'Bloomberg News',
    timeAgo: 'Hace 8 min',
    isUrgent: true,
    location: {
      city: 'Washington D.C.',
      country: 'Estados Unidos',
      lat: 38.9072,
      lon: -77.0369,
      zoom: 3,
    },
    tags: ['Wall Street', 'Banca', 'Tasas', 'Finanzas'],
  },
  {
    id: 'news-2',
    title: 'Precio del cobre repunta en Bolsa de Metales de Londres por fuerte demanda en energías renovables',
    summary: 'La cotización del metal rojo supera los 4.52 USD/lb con impacto directo y favorable en los ingresos fiscales y cambiarios de Chile.',
    category: 'chile_latam',
    categoryLabel: 'Chile & Latam',
    source: 'Diario Financiero / Reuters',
    timeAgo: 'Hace 15 min',
    isUrgent: false,
    location: {
      city: 'Santiago',
      country: 'Chile',
      lat: -33.4489,
      lon: -70.6693,
      zoom: 3,
    },
    tags: ['Minería', 'Cobre', 'Chile', 'Mercados'],
  },
  {
    id: 'news-3',
    title: 'Estación Espacial Internacional (ISS) completa maniobra de altitud para evitar basura espacial',
    summary: 'El centro de control de vuelos en Houston y Roscosmos coordinaron un encendido de propulsores de 240 segundos elevando la órbita a 418 kilómetros.',
    category: 'space_tech',
    categoryLabel: 'Espacio & Ciencia',
    source: 'NASA Space Operations',
    timeAgo: 'Hace 24 min',
    isUrgent: true,
    location: {
      city: 'Houston / Órbita Terrestre',
      country: 'EE.UU. / LEO',
      lat: 29.7604,
      lon: -95.3698,
      zoom: 2,
    },
    tags: ['ISS', 'NASA', 'Órbita', 'Satélites'],
  },
  {
    id: 'news-4',
    title: 'Bolsa de Tokio (Nikkei 225) lidera ganancias en Asia tras sólidos balances tecnológicos',
    summary: 'El índice nipón repuntó más de 1.2% impulsado por firmas de semiconductores, robótica industrial y exportaciones automotrices.',
    category: 'markets',
    categoryLabel: 'Economía & Mercados',
    source: 'Nikkei Asia / EFE',
    timeAgo: 'Hace 38 min',
    isUrgent: false,
    location: {
      city: 'Tokio',
      country: 'Japón',
      lat: 35.6762,
      lon: 139.6503,
      zoom: 3,
    },
    tags: ['Tokio', 'Tecnología', 'Semiconductores', 'Asia'],
  },
  {
    id: 'news-5',
    title: 'Unión Europea aprueba plan estratégico de soberanía digital y cables submarinos transoceánicos',
    summary: 'La Comisión Europea desplegará más de €4.800M para garantizar rutas de fibra óptica redundantes y resiliencia ante cortes en infraestructuras críticas.',
    category: 'geopolitics',
    categoryLabel: 'Geopolítica Global',
    source: 'Euronews / DW',
    timeAgo: 'Hace 45 min',
    isUrgent: false,
    location: {
      city: 'Bruselas',
      country: 'Bélgica',
      lat: 50.8503,
      lon: 4.3517,
      zoom: 3,
    },
    tags: ['Unión Europea', 'Telecomunicaciones', 'Seguridad'],
  },
  {
    id: 'news-6',
    title: 'Observatorio ALMA en Atacama descubre disco protoplanetario con componentes prebióticos',
    summary: 'El radiotelescopio ubicado a 5.000 metros de altura en el norte de Chile identificó moléculas orgánicas complejas alrededor de una estrella joven.',
    category: 'space_tech',
    categoryLabel: 'Espacio & Ciencia',
    source: 'Observatorio ALMA / ESO',
    timeAgo: 'Hace 1 h',
    isUrgent: false,
    location: {
      city: 'San Pedro de Atacama',
      country: 'Chile',
      lat: -23.029,
      lon: -67.755,
      zoom: 4,
    },
    tags: ['Astronomía', 'ALMA', 'Atacama', 'Ciencia'],
  },
  {
    id: 'news-7',
    title: 'Red Sísmica Mundial (USGS) registra evento de magnitud 5.4 en la dorsal mesoatlántica',
    summary: 'El epicentro se localizó en la placa tectónica submarina sin consecuencias para zonas costeras ni riesgo de tsunami regional.',
    category: 'climate',
    categoryLabel: 'Clima & Tierra',
    source: 'USGS Earthquake Hazards',
    timeAgo: 'Hace 1 h 20 min',
    isUrgent: false,
    location: {
      city: 'Dorsal Mesoatlántica',
      country: 'Océano Atlántico',
      lat: 0.85,
      lon: -29.35,
      zoom: 3,
    },
    tags: ['Sismos', 'USGS', 'Tectónica', 'Océanos'],
  },
  {
    id: 'news-8',
    title: 'Cumbre de Comercio del Pacífico avanza en corredores logísticos verdes entre Sudamérica y Asia',
    summary: 'Delegaciones de Chile, Perú, Singapur y Australia firman protocolos para digitalizar manifiestos aduaneros mediante tecnologías de automatización.',
    category: 'geopolitics',
    categoryLabel: 'Geopolítica Global',
    source: 'AP News',
    timeAgo: 'Hace 2 h',
    isUrgent: false,
    location: {
      city: 'Singapur',
      country: 'Singapur',
      lat: 1.3521,
      lon: 103.8198,
      zoom: 3,
    },
    tags: ['Comercio', 'Asia-Pacífico', 'Logística'],
  },
  {
    id: 'news-9',
    title: 'Red satelital Sentinel-2 monitorea deshielo estival y reservas hídricas en glaciares de la Patagonia',
    summary: 'Científicos del Centro Austral confirman que el monitoreo satelital en alta resolución permite alertar crecidas y proteger ecosistemas locales.',
    category: 'climate',
    categoryLabel: 'Clima & Tierra',
    source: 'Agencia Espacial Europea (ESA)',
    timeAgo: 'Hace 2 h 40 min',
    isUrgent: false,
    location: {
      city: 'Punta Arenas',
      country: 'Chile',
      lat: -53.1638,
      lon: -70.9171,
      zoom: 4,
    },
    tags: ['Patagonia', 'Satélites', 'Medio Ambiente'],
  },
  {
    id: 'news-10',
    title: 'Bitcoin y principales criptomonedas consolidan volumen institucional en plataformas globales',
    summary: 'La entrada constante de capitales en fondos cotizados (ETFs) sostiene la cotización sobre los $63.800 USD con alta actividad en derivados.',
    category: 'markets',
    categoryLabel: 'Economía & Mercados',
    source: 'CoinDesk / Reuters',
    timeAgo: 'Hace 3 h',
    isUrgent: false,
    location: {
      city: 'Nueva York',
      country: 'EE.UU.',
      lat: 40.7128,
      lon: -74.006,
      zoom: 3,
    },
    tags: ['Bitcoin', 'Criptomonedas', 'ETFs', 'Wall Street'],
  },
];

interface WorldNewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFlyToLocation: (coords: { lat: number; lon: number; zoom?: number }) => void;
}

export default function WorldNewsDrawer({
  isOpen,
  onClose,
  onFlyToLocation,
}: WorldNewsDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsId, setActiveNewsId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'urgent', label: '🔴 Urgentes' },
    { id: 'markets', label: 'Mercados' },
    { id: 'space_tech', label: 'Espacio & IA' },
    { id: 'geopolitics', label: 'Geopolítica' },
    { id: 'chile_latam', label: 'Chile & Latam' },
    { id: 'climate', label: 'Clima & Tierra' },
  ];

  const filteredNews = useMemo(() => {
    return WORLD_NEWS_FEED.filter((item) => {
      // Category filter
      if (selectedCategory === 'urgent' && !item.isUrgent) return false;
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'urgent' &&
        item.category !== selectedCategory
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesCity = item.location.city.toLowerCase().includes(query);
        const matchesCountry = item.location.country.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesSummary || matchesCity || matchesCountry || matchesTags;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelectNews = (item: WorldNewsItem) => {
    setActiveNewsId(item.id);
    onFlyToLocation({
      lat: item.location.lat,
      lon: item.location.lon,
      zoom: item.location.zoom || 3,
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-neutral-950/95 border-l border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Noticias de Todo el Mundo
              </h3>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 font-mono text-[9px] font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Cables de prensa global georreferenciados en el Globo 3D
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar panel de noticias"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60 space-y-3 shrink-0">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por país, ciudad o tema (ej. Chile, Cobre, NASA)..."
            className="w-full bg-neutral-900/90 border border-neutral-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 space-y-2">
            <Newspaper className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
            <p className="text-sm font-semibold text-white">No se encontraron noticias</p>
            <p className="text-xs">Prueba con otro término de búsqueda o categoría.</p>
          </div>
        ) : (
          filteredNews.map((item) => {
            const isSelected = activeNewsId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectNews(item)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative group ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,163,255,0.25)] ring-1 ring-cyan-400'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header tags */}
                <div className="flex items-center justify-between text-[11px] mb-2 flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 font-mono text-[10px]">
                      {item.source}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timeAgo}
                    </span>
                  </div>

                  {item.isUrgent ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-600/80 text-red-400 text-[9px] font-black uppercase tracking-wider">
                      Urgente
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-medium">
                      {item.categoryLabel}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1.5">
                  {item.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                  {item.summary}
                </p>

                {/* Footer Geotag & Action */}
                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>
                      {item.location.city}, {item.location.country}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectNews(item);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold transition-all shadow-sm group-hover:border-cyan-400 cursor-pointer"
                  >
                    <Globe2 className="w-3 h-3 text-cyan-400" />
                    <span>Ver en el Globo 3D</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950 text-center text-[10px] text-neutral-400 flex items-center justify-between px-4">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Feed Global de Inteligencia y Geopolítica</span>
        </span>
        <span className="text-cyan-400 font-mono">10 CABLES ACTIVOS</span>
      </div>
    </div>
  );
}
