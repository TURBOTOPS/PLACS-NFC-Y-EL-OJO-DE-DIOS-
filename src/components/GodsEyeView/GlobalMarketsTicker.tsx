import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Newspaper,
  Gauge
} from 'lucide-react';

export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  category: 'indices' | 'crypto' | 'commodities' | 'forex';
  price: string;
  rawPrice: number;
  change: number; // percentage
  unit?: string;
  flag?: string;
  market: string;
  location?: { lat: number; lon: number; name: string };
}

const INITIAL_MARKETS: MarketAsset[] = [
  // ÍNDICES BURSÁTILES
  {
    id: 'sp500',
    name: 'S&P 500',
    symbol: 'SPX',
    category: 'indices',
    price: '5,864.67',
    rawPrice: 5864.67,
    change: +0.42,
    market: 'Wall Street (EE.UU.)',
    flag: '🇺🇸',
    location: { lat: 40.7128, lon: -74.006, name: 'Bolsa de Nueva York (NYSE)' },
  },
  {
    id: 'nasdaq',
    name: 'Nasdaq 100',
    symbol: 'NDX',
    category: 'indices',
    price: '20,439.12',
    rawPrice: 20439.12,
    change: +0.68,
    market: 'Nueva York (Tech)',
    flag: '🇺🇸',
    location: { lat: 40.758, lon: -73.9855, name: 'Nasdaq MarketSite, Times Sq' },
  },
  {
    id: 'dow',
    name: 'Dow Jones',
    symbol: 'DJI',
    category: 'indices',
    price: '42,352.75',
    rawPrice: 42352.75,
    change: -0.15,
    market: 'Wall Street (EE.UU.)',
    flag: '🇺🇸',
    location: { lat: 40.7068, lon: -74.009, name: 'Wall Street, Manhattan' },
  },
  {
    id: 'nikkei',
    name: 'Nikkei 225',
    symbol: 'N225',
    category: 'indices',
    price: '39,380.89',
    rawPrice: 39380.89,
    change: +1.23,
    market: 'Tokio (Japón)',
    flag: '🇯🇵',
    location: { lat: 35.6762, lon: 139.6503, name: 'Bolsa de Tokio (TSE)' },
  },
  {
    id: 'dax',
    name: 'DAX 40',
    symbol: 'DAX',
    category: 'indices',
    price: '19,410.20',
    rawPrice: 19410.20,
    change: +0.31,
    market: 'Frankfurt (Alemania)',
    flag: '🇩🇪',
    location: { lat: 50.1109, lon: 8.6821, name: 'Deutsche Börse Frankfurt' },
  },
  {
    id: 'ftse',
    name: 'FTSE 100',
    symbol: 'UKX',
    category: 'indices',
    price: '8,280.14',
    rawPrice: 8280.14,
    change: -0.08,
    market: 'Londres (Reino Unido)',
    flag: '🇬🇧',
    location: { lat: 51.5074, lon: -0.1278, name: 'London Stock Exchange' },
  },
  {
    id: 'ipsa',
    name: 'IPSA Chile',
    symbol: 'IPSA',
    category: 'indices',
    price: '6,540.22',
    rawPrice: 6540.22,
    change: +0.54,
    market: 'Santiago (Chile)',
    flag: '🇨🇱',
    location: { lat: -33.4429, lon: -70.6515, name: 'Bolsa de Santiago (BCS)' },
  },
  {
    id: 'shanghai',
    name: 'Shanghai Comp.',
    symbol: 'SSEC',
    category: 'indices',
    price: '3,336.50',
    rawPrice: 3336.5,
    change: +1.6,
    market: 'Shanghai (China)',
    flag: '🇨🇳',
    location: { lat: 31.2304, lon: 121.4737, name: 'Shanghai Stock Exchange' },
  },

  // CRIPTOMONEDAS
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC/USD',
    category: 'crypto',
    price: '$63,840.50',
    rawPrice: 63840.5,
    change: +2.45,
    market: 'Global 24/7',
    flag: '🪙',
    location: { lat: 0, lon: 0, name: 'Red Descentralizada Global' },
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH/USD',
    category: 'crypto',
    price: '$2,488.20',
    rawPrice: 2488.2,
    change: +1.8,
    market: 'Global 24/7',
    flag: '💎',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL/USD',
    category: 'crypto',
    price: '$148.75',
    rawPrice: 148.75,
    change: +3.22,
    market: 'Global 24/7',
    flag: '🟣',
  },

  // METALES & COMMODITIES
  {
    id: 'oro',
    name: 'Oro (Gold)',
    symbol: 'XAU/USD',
    category: 'commodities',
    price: '$2,653.40',
    rawPrice: 2653.4,
    change: +0.75,
    unit: 'oz troy',
    market: 'Mercado de Metales (Londres/NY)',
    flag: '🥇',
  },
  {
    id: 'cobre',
    name: 'Cobre (Copper)',
    symbol: 'HG=F',
    category: 'commodities',
    price: '$4.524',
    rawPrice: 4.524,
    change: +1.12,
    unit: 'lb',
    market: 'LME / Minería Chile',
    flag: '🇨🇱',
    location: { lat: -23.65, lon: -70.4, name: 'Antofagasta Minerals / Codelco' },
  },
  {
    id: 'plata',
    name: 'Plata (Silver)',
    symbol: 'XAG/USD',
    category: 'commodities',
    price: '$32.18',
    rawPrice: 32.18,
    change: +1.35,
    unit: 'oz troy',
    market: 'Comex Nueva York',
    flag: '🥈',
  },
  {
    id: 'brent',
    name: 'Petróleo Brent',
    symbol: 'BRENT',
    category: 'commodities',
    price: '$77.85',
    rawPrice: 77.85,
    change: +1.4,
    unit: 'barril',
    market: 'ICE Europa',
    flag: '🛢️',
  },

  // DIVISAS (FOREX)
  {
    id: 'usdclp',
    name: 'Dólar / Peso',
    symbol: 'USD/CLP',
    category: 'forex',
    price: '$928.50',
    rawPrice: 928.5,
    change: -0.35,
    unit: 'CLP',
    market: 'Mercado Cambiario Chile',
    flag: '💵',
    location: { lat: -33.4489, lon: -70.6693, name: 'Banco Central de Chile' },
  },
  {
    id: 'eurusd',
    name: 'Euro / Dólar',
    symbol: 'EUR/USD',
    category: 'forex',
    price: '1.0965',
    rawPrice: 1.0965,
    change: +0.12,
    market: 'Forex Global',
    flag: '💶',
  },
  {
    id: 'gbpusd',
    name: 'Libra / Dólar',
    symbol: 'GBP/USD',
    category: 'forex',
    price: '1.3082',
    rawPrice: 1.3082,
    change: +0.18,
    market: 'Forex Londres',
    flag: '💷',
  },
];

interface GlobalMarketsTickerProps {
  onFlyToLocation?: (coords: { lat: number; lon: number }) => void;
  onOpenNews?: () => void;
}

export default function GlobalMarketsTicker({
  onFlyToLocation,
  onOpenNews,
}: GlobalMarketsTickerProps) {
  const [markets, setMarkets] = useState<MarketAsset[]>(INITIAL_MARKETS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'indices' | 'crypto' | 'commodities' | 'forex'>('all');
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [activeAsset, setActiveAsset] = useState<MarketAsset | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.6x, 1x, 1.8x
  const [isHovered, setIsHovered] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // High-precision physics & momentum state for 60fps/120fps fluid scrolling
  const posRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Micro-fluctuation simulation (ambient live feel)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * INITIAL_MARKETS.length);
      const target = INITIAL_MARKETS[randomIndex];

      setMarkets((prev) =>
        prev.map((item, idx) => {
          if (idx !== randomIndex) return item;

          const deltaPct = Math.random() * 0.16 - 0.08;
          const newChange = Number((item.change + deltaPct).toFixed(2));

          let newPriceStr = item.price;
          if (item.category === 'indices') {
            const raw = item.rawPrice * (1 + deltaPct / 100);
            newPriceStr = raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else if (item.id === 'btc') {
            const raw = item.rawPrice + Math.round(Math.random() * 80 - 40);
            newPriceStr = `$${raw.toLocaleString('en-US')}`;
          } else if (item.id === 'usdclp') {
            const raw = (item.rawPrice + (Math.random() * 1.5 - 0.75)).toFixed(1);
            newPriceStr = `$${raw}`;
          }

          return {
            ...item,
            change: newChange,
            price: newPriceStr,
          };
        })
      );

      setFlashingId(target.id);
      setTimeout(() => setFlashingId(null), 800);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = selectedCategory === 'all'
    ? markets
    : markets.filter((m) => m.category === selectedCategory);

  // Seamless infinite loop: duplicate items so scroll wraps smoothly without any jump
  const loopItems = [...filteredMarkets, ...filteredMarkets];

  // 60FPS / 120FPS RequestAnimationFrame animation engine
  const step = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = time;

    const el = scrollRef.current;
    if (el) {
      const halfWidth = el.scrollWidth / 2;

      if (!isDraggingRef.current) {
        // Apply inertia if there's velocity from user flick
        if (Math.abs(velocityRef.current) > 0.05) {
          posRef.current += velocityRef.current;
          velocityRef.current *= 0.94; // Smooth deceleration
        } else if (isAutoScroll && !isHovered) {
          // Constant silky auto-scroll speed (pixels per second)
          const baseSpeed = 48 * speedMultiplier;
          posRef.current += baseSpeed * delta;
        }

        // Seamless infinite wrapping: when past half-width, wrap back seamlessly
        if (halfWidth > 0) {
          if (posRef.current >= halfWidth) {
            posRef.current -= halfWidth;
          } else if (posRef.current < 0) {
            posRef.current += halfWidth;
          }
        }

        el.scrollLeft = posRef.current;
      } else {
        // While dragging, keep posRef in sync
        posRef.current = el.scrollLeft;
      }
    }

    animFrameIdRef.current = requestAnimationFrame(step);
  }, [isAutoScroll, isHovered, speedMultiplier]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [step]);

  // Touch and Mouse Drag-to-Scroll with Momentum Flick
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    velocityRef.current = 0;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    posRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const currentX = e.clientX;
    const deltaX = lastXRef.current - currentX;
    lastXRef.current = currentX;

    // Direct responsive displacement
    posRef.current += deltaX;
    const el = scrollRef.current;
    const halfWidth = el.scrollWidth / 2;

    if (halfWidth > 0) {
      if (posRef.current >= halfWidth) posRef.current -= halfWidth;
      else if (posRef.current < 0) posRef.current += halfWidth;
    }
    el.scrollLeft = posRef.current;

    // Track flick velocity for inertia release
    velocityRef.current = deltaX * 0.8;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      scrollRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Wheel Horizontal Scroll with Sub-pixel Easing
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 0) {
      velocityRef.current += delta * 0.25;
      // Cap max wheel momentum
      velocityRef.current = Math.max(-25, Math.min(25, velocityRef.current));
    }
  };

  // Smooth Step Displacement (Buttons)
  const pushScroll = (amount: number) => {
    velocityRef.current += amount * 0.05;
    // Cap
    velocityRef.current = Math.max(-20, Math.min(20, velocityRef.current));
  };

  const handleAssetClick = (asset: MarketAsset) => {
    // Only trigger if not dragging significantly
    if (Math.abs(velocityRef.current) > 2) return;
    setActiveAsset(asset);
    if (asset.location && onFlyToLocation) {
      onFlyToLocation({ lat: asset.location.lat, lon: asset.location.lon });
    }
  };

  return (
    <div
      className="relative w-full bg-neutral-950/95 border-b border-cyan-500/30 backdrop-blur-md z-30 select-none shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header / Categories & Controls */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800/80 text-[11px] gap-2 flex-wrap">
        {/* Left Badge: Terminal Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MERCADOS GLOBALES</span>
            <span className="text-neutral-500">|</span>
            <span className="text-emerald-400">24/7 GLOBEX EN VIVO</span>
          </div>

          {/* Category Filters */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos ({markets.length})
            </button>
            <button
              onClick={() => setSelectedCategory('indices')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'indices'
                  ? 'bg-neutral-800 text-cyan-300 font-bold'
                  : 'text-neutral-400 hover:text-cyan-300'
              }`}
            >
              Índices
            </button>
            <button
              onClick={() => setSelectedCategory('crypto')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'crypto'
                  ? 'bg-neutral-800 text-cyan-300 font-bold'
                  : 'text-neutral-400 hover:text-cyan-300'
              }`}
            >
              Cripto
            </button>
            <button
              onClick={() => setSelectedCategory('commodities')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'commodities'
                  ? 'bg-neutral-800 text-cyan-300 font-bold'
                  : 'text-neutral-400 hover:text-cyan-300'
              }`}
            >
              Metales & Petróleo
            </button>
            <button
              onClick={() => setSelectedCategory('forex')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'forex'
                  ? 'bg-neutral-800 text-cyan-300 font-bold'
                  : 'text-neutral-400 hover:text-cyan-300'
              }`}
            >
              Divisas (USD/CLP)
            </button>
          </div>
        </div>

        {/* Right Navigation & Scroll Controls */}
        <div className="flex items-center gap-2 text-[10px]">
          {/* Open World News Feed Button */}
          {onOpenNews && (
            <button
              onClick={onOpenNews}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-950 via-cyan-900 to-blue-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-[10px] cursor-pointer shadow-[0_0_12px_rgba(0,163,255,0.25)] transition-all active:scale-95"
              title="Abrir Centro de Noticias Mundiales en Vivo"
            >
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>Noticias Mundiales</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            </button>
          )}

          <div className="h-3 w-px bg-neutral-800 hidden sm:block" />

          {/* Speed Preset Selector (Fluidez personalizada) */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-lg p-0.5 font-mono text-[9px]">
            <span className="text-neutral-500 px-1 flex items-center gap-0.5">
              <Gauge className="w-2.5 h-2.5" />
            </span>
            <button
              onClick={() => {
                setSpeedMultiplier(0.6);
                setIsAutoScroll(true);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speedMultiplier === 0.6 && isAutoScroll
                  ? 'bg-cyan-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Velocidad suave"
            >
              0.6x
            </button>
            <button
              onClick={() => {
                setSpeedMultiplier(1.0);
                setIsAutoScroll(true);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speedMultiplier === 1.0 && isAutoScroll
                  ? 'bg-cyan-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Velocidad normal fluida"
            >
              1.0x
            </button>
            <button
              onClick={() => {
                setSpeedMultiplier(1.8);
                setIsAutoScroll(true);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speedMultiplier === 1.8 && isAutoScroll
                  ? 'bg-cyan-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Velocidad rápida"
            >
              1.8x
            </button>
          </div>

          {/* Auto-scroll Play/Pause Toggle */}
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
              isAutoScroll
                ? 'bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/80'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={isAutoScroll ? 'Pausar auto-desplazamiento' : 'Reanudar auto-desplazamiento fluido'}
          >
            {isAutoScroll ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 text-emerald-400" />}
            <span className="hidden xs:inline">{isAutoScroll ? 'Fluido' : 'Pausa'}</span>
          </button>

          {/* Quick Impulse Displacement Buttons */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => pushScroll(-250)}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-colors cursor-pointer active:scale-90"
              title="Desplazar suave a la izquierda"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => pushScroll(250)}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-colors cursor-pointer active:scale-90"
              title="Desplazar suave a la derecha"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ultra-smooth Hardware-Accelerated Conveyor Strip */}
      <div className="relative group/track overflow-hidden">
        {/* Left Gradient Fade & Smooth Arrow Button */}
        <button
          onClick={() => pushScroll(-350)}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent flex items-center justify-start pl-1 text-neutral-400 hover:text-cyan-400 transition-all opacity-80 hover:opacity-100 cursor-pointer"
          aria-label="Desplazar ticker hacia la izquierda"
          title="Desplazar hacia la izquierda"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-900/90 border border-neutral-700 hover:border-cyan-400 flex items-center justify-center shadow-lg transition-transform active:scale-90">
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* The 60FPS Drag & Inertia Track */}
        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative overflow-x-hidden no-scrollbar py-2 px-10 flex items-center gap-2.5 cursor-grab active:cursor-grabbing will-change-scroll touch-pan-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            transform: 'translateZ(0)',
          }}
        >
          {loopItems.map((asset, index) => {
            const isPositive = asset.change >= 0;
            const isFlashing = flashingId === asset.id;
            const isSelected = activeAsset?.id === asset.id;

            return (
              <div
                key={`${asset.id}-${index}`}
                onClick={() => handleAssetClick(asset)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs shrink-0 cursor-pointer transition-colors duration-150 select-none group/card ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,163,255,0.45)] ring-1 ring-cyan-400'
                    : isFlashing
                    ? isPositive
                      ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/50'
                      : 'bg-red-950/70 border-red-500 ring-1 ring-red-500/50'
                    : 'bg-neutral-900/85 hover:bg-neutral-800 border-neutral-800 hover:border-cyan-500/50 hover:shadow-md'
                }`}
                title={`${asset.name} (${asset.market}) - Clic para viajar en el globo 3D`}
              >
                {/* Flag / Icon */}
                <span className="text-sm shrink-0">{asset.flag}</span>

                {/* Symbol & Name */}
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold text-[11px] text-white tracking-wide group-hover/card:text-cyan-300 transition-colors">
                    {asset.symbol}
                  </span>
                  <span className="text-[9px] text-neutral-400 truncate max-w-[85px]">
                    {asset.name}
                  </span>
                </div>

                {/* Price */}
                <span className="font-mono text-xs font-bold text-neutral-100 tabular-nums ml-1">
                  {asset.price}
                  {asset.unit && <span className="text-[9px] text-neutral-400 ml-0.5">/{asset.unit}</span>}
                </span>

                {/* Change % badge */}
                <div
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isPositive
                      ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                      : 'text-red-400 bg-red-950/80 border border-red-800/60'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  <span>{isPositive ? `+${asset.change}%` : `${asset.change}%`}</span>
                </div>

                {/* Fly indicator if geotagged */}
                {asset.location && (
                  <Globe2 className="w-3 h-3 text-neutral-500 group-hover/card:text-cyan-400 transition-colors shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Gradient Fade & Smooth Arrow Button */}
        <button
          onClick={() => pushScroll(350)}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-l from-neutral-950 via-neutral-950/90 to-transparent flex items-center justify-end pr-1 text-neutral-400 hover:text-cyan-400 transition-all opacity-80 hover:opacity-100 cursor-pointer"
          aria-label="Desplazar ticker hacia la derecha"
          title="Desplazar hacia la derecha"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-900/90 border border-neutral-700 hover:border-cyan-400 flex items-center justify-center shadow-lg transition-transform active:scale-90">
            <ChevronRight className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          </div>
        </button>
      </div>
    </div>
  );
}
