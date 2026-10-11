import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  MapPin,
  Sparkles,
  ShieldCheck,
  Grid,
  Square,
  Play,
  Pause,
  Compass,
  Radio,
  ExternalLink,
  ChevronRight,
  Download,
  Check,
  Globe2
} from 'lucide-react';

export interface CctvCameraItem {
  id: string;
  city: string;
  country: string;
  title: string;
  zone: string;
  lat: number;
  lon: number;
  status: 'EN VIVO' | 'SEÑAL ÓPTIMA' | 'TELEMETRÍA HD';
  resolution: string;
  fps: number;
  bitrate: string;
  temp: string;
  img: string;
  // Authentic live video stream or high-fidelity simulated loops
  videoUrl?: string;
  streamType: 'direct_video' | 'synthetic_feed' | 'youtube_live';
  youtubeId?: string;
  sensor: string;
}

export const GLOBAL_CCTV_CAMERAS: CctvCameraItem[] = [
  {
    id: 'CAM-SCL-01',
    city: 'Santiago de Chile',
    country: 'Chile',
    title: 'Plaza Baquedano & Eje Providencia',
    zone: 'Santiago Centro / Metro Baquedano',
    lat: -33.4372,
    lon: -70.6345,
    status: 'EN VIVO',
    resolution: '1080p 60fps',
    fps: 60,
    bitrate: '4.8 Mbps',
    temp: '18°C',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-busy-street-in-a-big-city-at-night-42861-large.mp4',
    streamType: 'direct_video',
    sensor: 'Sony STARVIS™ 4K Ultra-Low-Light',
  },
  {
    id: 'CAM-NYC-04',
    city: 'Nueva York',
    country: 'Estados Unidos',
    title: 'Times Square & 42nd Street Panorama',
    zone: 'Midtown Manhattan',
    lat: 40.758,
    lon: -73.9855,
    status: 'EN VIVO',
    resolution: '4K Ultra HD',
    fps: 60,
    bitrate: '8.2 Mbps',
    temp: '14°C',
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-night-traffic-in-a-busy-city-intersection-43093-large.mp4',
    streamType: 'direct_video',
    sensor: 'Axis Q1656-LE Tactical High-Res',
  },
  {
    id: 'CAM-TYO-02',
    city: 'Tokio',
    country: 'Japón',
    title: 'Cruce de Shibuya & Estatua Hachiko',
    zone: 'Shibuya Crossing Central',
    lat: 35.6595,
    lon: 139.7005,
    status: 'EN VIVO',
    resolution: '1080p 60fps',
    fps: 60,
    bitrate: '5.4 Mbps',
    temp: '22°C',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-walking-on-a-pedestrian-crossing-42995-large.mp4',
    streamType: 'direct_video',
    sensor: 'Panasonic i-PRO Extreme AI Engine',
  },
  {
    id: 'CAM-LON-03',
    city: 'Londres',
    country: 'Reino Unido',
    title: 'Tower Bridge & Río Támesis',
    zone: 'London Borough of Southwark',
    lat: 51.5055,
    lon: -0.0754,
    status: 'EN VIVO',
    resolution: '1080p 50fps',
    fps: 50,
    bitrate: '4.6 Mbps',
    temp: '12°C',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-on-a-bridge-43105-large.mp4',
    streamType: 'direct_video',
    sensor: 'Bosch MIC IP Fusion 9000i HD',
  },
  {
    id: 'CAM-PAR-05',
    city: 'París',
    country: 'Francia',
    title: 'Torre Eiffel & Campos de Marte',
    zone: 'Rive Gauche / Seine Riverfront',
    lat: 48.8584,
    lon: 2.2945,
    status: 'EN VIVO',
    resolution: '1080p 60fps',
    fps: 60,
    bitrate: '5.1 Mbps',
    temp: '15°C',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-illuminated-eiffel-tower-at-night-42863-large.mp4',
    streamType: 'direct_video',
    sensor: 'Hikvision DarkFighterX Dual-Sensor',
  },
  {
    id: 'CAM-ISS-00',
    city: 'Órbita Terrestre (ISS)',
    country: 'Espacio Exterior',
    title: 'NASA Live Earth View from Space',
    zone: 'Órbita Baja Terrestre (LEO 410 km)',
    lat: 0.0,
    lon: 0.0,
    status: 'EN VIVO',
    resolution: '1080p 60fps',
    fps: 60,
    bitrate: '12.0 Mbps',
    temp: '-65°C / +120°C',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-earth-globe-in-the-vastness-of-space-41584-large.mp4',
    streamType: 'direct_video',
    sensor: 'NASA Commercial External High-Def Camera',
  },
  {
    id: 'CAM-DXB-06',
    city: 'Dubái',
    country: 'Emiratos Árabes',
    title: 'Downtown Dubai & Burj Khalifa',
    zone: 'Financial Centre & Boulevard',
    lat: 25.1972,
    lon: 55.2744,
    status: 'EN VIVO',
    resolution: '4K Ultra HD',
    fps: 60,
    bitrate: '7.5 Mbps',
    temp: '32°C',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-illuminated-at-night-42998-large.mp4',
    streamType: 'direct_video',
    sensor: 'Avigilon H5A Pan-Tilt-Zoom AI',
  },
  {
    id: 'CAM-VCE-07',
    city: 'Venecia',
    country: 'Italia',
    title: 'Gran Canal & Puente de Rialto',
    zone: 'Canal Grande / San Marco',
    lat: 45.438,
    lon: 12.3359,
    status: 'EN VIVO',
    resolution: '1080p 50fps',
    fps: 50,
    bitrate: '4.2 Mbps',
    temp: '17°C',
    img: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=900&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gondolas-and-boats-on-the-grand-canal-in-venice-42862-large.mp4',
    streamType: 'direct_video',
    sensor: 'Mobotix Thermal Dual Optical Dome',
  },
];

type VisionFilterMode = 'normal' | 'night' | 'thermal' | 'scanlines' | 'bw';
type LayoutMode = 'single' | 'quad_matrix' | 'pip';

interface LiveCctvConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onFlyToLocation: (coords: { lat: number; lon: number; zoom?: number }) => void;
  initialCameraId?: string;
}

export default function LiveCctvConsole({
  isOpen,
  onClose,
  onFlyToLocation,
  initialCameraId,
}: LiveCctvConsoleProps) {
  const [selectedCam, setSelectedCam] = useState<CctvCameraItem>(() => {
    return (
      GLOBAL_CCTV_CAMERAS.find((c) => c.id === initialCameraId) ||
      GLOBAL_CCTV_CAMERAS[0]
    );
  });

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [visionFilter, setVisionFilter] = useState<VisionFilterMode>('normal');
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentTimeCode, setCurrentTimeCode] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1); // 1x to 4x
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  // Sync initial camera if provided
  useEffect(() => {
    if (initialCameraId) {
      const match = GLOBAL_CCTV_CAMERAS.find((c) => c.id === initialCameraId);
      if (match) setSelectedCam(match);
    }
  }, [initialCameraId]);

  // Live real-time timecode clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').replace('Z', ' UTC');
      setCurrentTimeCode(iso);
    };
    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Tactical Radio/Atmosphere Synthesizer
  useEffect(() => {
    if (!isAudioEnabled) {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Brown noise generator for city / tactical radio hum
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for ambient city drone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      audioGainRef.current = gain;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
    } catch (err) {
      console.warn('Audio synthesis could not start:', err);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isAudioEnabled]);

  // PTZ Controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 4));
  const handleZoomOut = () => {
    setZoomLevel((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePan = (dx: number, dy: number) => {
    if (zoomLevel <= 1) return;
    setPanOffset((prev) => ({
      x: Math.max(-50, Math.min(50, prev.x + dx)),
      y: Math.max(-50, Math.min(50, prev.y + dy)),
    }));
  };

  const handleResetPtz = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Live Snapshot capture
  const handleTakeSnapshot = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);

    // Audio shutter beep
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  };

  // Fly to camera coordinates on the 3D globe
  const handleCenterGlobe = (cam: CctvCameraItem) => {
    onFlyToLocation({
      lat: cam.lat,
      lon: cam.lon,
      zoom: 13.5,
    });
  };

  if (!isOpen) return null;

  // Filter CSS style computation
  const getFilterStyles = (filter: VisionFilterMode) => {
    switch (filter) {
      case 'night':
        return 'filter brightness-125 contrast-175 hue-rotate-90 saturate-200 sepia';
      case 'thermal':
        return 'filter contrast-200 saturate-200 hue-rotate-180 invert';
      case 'bw':
        return 'filter grayscale contrast-150';
      case 'scanlines':
        return 'filter contrast-125 brightness-105';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        layoutMode === 'pip'
          ? 'bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,163,255,0.35)] border-2 border-cyan-400 bg-neutral-950'
          : 'inset-0 bg-black/90 backdrop-blur-xl flex flex-col p-3 sm:p-5'
      }`}
    >
      {/* Container Box */}
      <div className="relative w-full h-full flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top Título / Command Deck Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 shrink-0 gap-3">
          {/* Brand & Active Cam Status */}
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400 shrink-0">
              <Video className="w-4 h-4 animate-pulse" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm text-white tracking-tight">
                  SISTEMA DE VIGILANCIA CCTV 4K
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-950/90 border border-red-600/80 text-red-400 text-[10px] font-black font-mono animate-pulse">
                  ● EN VIVO
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                {selectedCam.id} · {selectedCam.title} ({selectedCam.city})
              </p>
            </div>
          </div>

          {/* Quick Deck Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Multi-Cam Layout Modes */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setLayoutMode('single')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  layoutMode === 'single'
                    ? 'bg-neutral-800 text-cyan-300'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Modo Inspector Individual"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Individual</span>
              </button>

              <button
                onClick={() => setLayoutMode('quad_matrix')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  layoutMode === 'quad_matrix'
                    ? 'bg-neutral-800 text-cyan-300'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Modo Matriz Multicámara (4 canales)"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Matriz 2x2</span>
              </button>

              <button
                onClick={() => setLayoutMode(layoutMode === 'pip' ? 'single' : 'pip')}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  layoutMode === 'pip'
                    ? 'bg-cyan-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Modo Picture-in-Picture Flotante"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Flotante</span>
              </button>
            </div>

            {/* Fly 3D Globe to current cam */}
            <button
              onClick={() => handleCenterGlobe(selectedCam)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Centrar el Globo 3D en esta ciudad"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Centrar 3D</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar consola CCTV"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY: SINGLE INSPECTOR OR MULTI-MATRIX                                */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* LEFT: LIVE VIEWPORT / MATRIX */}
          <div className="flex-1 relative flex flex-col bg-black overflow-hidden justify-center items-center">
            {layoutMode === 'quad_matrix' ? (
              /* QUAD MATRIX (2x2) MULTI-CAMERA STREAM VIEW */
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-1 bg-neutral-950">
                {GLOBAL_CCTV_CAMERAS.slice(0, 4).map((cam) => (
                  <div
                    key={cam.id}
                    onClick={() => {
                      setSelectedCam(cam);
                      setLayoutMode('single');
                    }}
                    className={`relative w-full h-full bg-black overflow-hidden border cursor-pointer group transition-all ${
                      selectedCam.id === cam.id
                        ? 'border-cyan-400 ring-1 ring-cyan-400'
                        : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <video
                      src={cam.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    {/* Matrix HUD Watermark */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-red-500/50 text-[10px] font-bold text-red-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>{cam.id} · {cam.city}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-neutral-700 text-[10px] font-mono text-cyan-300">
                      {cam.resolution}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* SINGLE CAMERA DETAILED INSPECTOR VIEW WITH PTZ & FILTERS */
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                {/* Active Video Player with PTZ Transforms */}
                <div
                  className="w-full h-full relative transition-transform duration-200 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  }}
                >
                  <video
                    ref={videoRef}
                    src={selectedCam.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-all ${getFilterStyles(
                      visionFilter
                    )}`}
                  />
                </div>

                {/* Scanlines CRT Texture Overlay */}
                {visionFilter === 'scanlines' && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)',
                      backgroundSize: '100% 3px',
                    }}
                  />
                )}

                {/* Night Vision Green Tint Vignette */}
                {visionFilter === 'night' && (
                  <div className="absolute inset-0 pointer-events-none z-10 bg-radial-gradient from-transparent via-emerald-950/20 to-black/60 opacity-80" />
                )}

                {/* Flash Effect on Snapshot */}
                {flashEffect && (
                  <div className="absolute inset-0 bg-white pointer-events-none z-30 transition-opacity duration-200" />
                )}

                {/* Live Tactical Watermark HUD (Top-Left) */}
                <div className="absolute top-3 left-3 z-20 pointer-events-none flex flex-col gap-1 text-[11px] font-mono text-cyan-300 bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-cyan-500/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span className="text-white font-bold">{selectedCam.id} // {selectedCam.title}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    LOC: {selectedCam.lat.toFixed(4)}° N, {selectedCam.lon.toFixed(4)}° E · {selectedCam.city}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    UTC: {currentTimeCode || 'CARGANDO...'}
                  </div>
                </div>

                {/* Live Telemetry Sensor HUD (Top-Right) */}
                <div className="absolute top-3 right-3 z-20 pointer-events-none hidden sm:flex flex-col gap-1 text-[10px] font-mono text-neutral-300 bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-800 text-right">
                  <div>RES: <strong className="text-cyan-400">{selectedCam.resolution}</strong> ({selectedCam.fps} FPS)</div>
                  <div>TASA: <strong className="text-white">{selectedCam.bitrate}</strong> · TEMP: {selectedCam.temp}</div>
                  <div>ZOOM: <strong className="text-cyan-300">{zoomLevel.toFixed(1)}x</strong></div>
                </div>

                {/* Simulated AI Neural Detection Bounding Boxes */}
                {showAiBoxes && (
                  <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                    {/* Box 1 */}
                    <div className="absolute top-1/3 left-1/4 w-32 h-44 border border-cyan-400/80 rounded bg-cyan-500/10 animate-pulse">
                      <div className="absolute -top-4 left-0 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/60">
                        HUMANO: 98.4%
                      </div>
                    </div>
                    {/* Box 2 */}
                    <div className="absolute bottom-1/4 right-1/3 w-40 h-28 border border-emerald-400/80 rounded bg-emerald-500/10">
                      <div className="absolute -top-4 left-0 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/60">
                        VEHÍCULO: 94.2%
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating On-Screen PTZ & Filter Controls (Bottom-Center) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-2xl shadow-2xl">
                  {/* Zoom Out */}
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Alejar Zoom (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-xs font-bold text-cyan-400 px-1 tabular-nums">
                    {zoomLevel.toFixed(1)}x
                  </span>

                  {/* Zoom In */}
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 4}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    title="Acercar Zoom (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-neutral-800 mx-0.5" />

                  {/* Pan Arrows (Only active if zoomed) */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handlePan(-15, 0)}
                      disabled={zoomLevel <= 1}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white cursor-pointer"
                      title="Mover Izquierda"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => handlePan(0, -15)}
                      disabled={zoomLevel <= 1}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white cursor-pointer"
                      title="Mover Arriba"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handlePan(0, 15)}
                      disabled={zoomLevel <= 1}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white cursor-pointer"
                      title="Mover Abajo"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => handlePan(15, 0)}
                      disabled={zoomLevel <= 1}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 hover:text-white cursor-pointer"
                      title="Mover Derecha"
                    >
                      ▶
                    </button>
                  </div>

                  <div className="h-4 w-px bg-neutral-800 mx-0.5" />

                  {/* Reset PTZ */}
                  <button
                    onClick={handleResetPtz}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Restablecer Encuadre (1x)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Take Snapshot */}
                  <button
                    onClick={handleTakeSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors shadow-md cursor-pointer ml-1"
                    title="Tomar Captura de Fotograma en Vivo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Capturar</span>
                  </button>

                  {/* Toggle Audio Ambiance */}
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isAudioEnabled
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                    title={isAudioEnabled ? 'Silenciar Ambiente Táctico' : 'Activar Sonido Ambiente de la Ciudad'}
                  >
                    {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* Snapshot notification toast */}
                {snapshotSuccess && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>¡Fotograma en vivo capturado con sello de tiempo!</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: CAMERA SELECTION & TACTICAL SENSORS */}
          <div className="w-full lg:w-80 bg-neutral-950/90 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col shrink-0 overflow-y-auto">
            {/* Visual Filters Switcher */}
            <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/60 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Modo de Visión Espectral</span>
                <span className="text-cyan-400 font-mono">{visionFilter.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setVisionFilter('normal')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    visionFilter === 'normal'
                      ? 'bg-cyan-500 text-neutral-950 border-cyan-400'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  Natural HD
                </button>
                <button
                  onClick={() => setVisionFilter('night')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    visionFilter === 'night'
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                      : 'bg-neutral-900 text-emerald-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  Nocturna IR
                </button>
                <button
                  onClick={() => setVisionFilter('thermal')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    visionFilter === 'thermal'
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-900 text-amber-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  Térmica FLIR
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => setVisionFilter('scanlines')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                    visionFilter === 'scanlines'
                      ? 'bg-neutral-800 text-cyan-300 border-cyan-400'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  Scanlines CRT
                </button>
                <button
                  onClick={() => setShowAiBoxes(!showAiBoxes)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                    showAiBoxes
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}
                >
                  {showAiBoxes ? 'Cajas IA: ON' : 'Cajas IA: OFF'}
                </button>
              </div>
            </div>

            {/* Camera Stations List */}
            <div className="p-3.5 space-y-2 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between pb-1">
                <span>Cámaras Disponibles ({GLOBAL_CCTV_CAMERAS.length})</span>
                <span className="text-emerald-400 font-mono text-[9px]">ENLACES ACTIVOS</span>
              </div>

              <div className="space-y-2">
                {GLOBAL_CCTV_CAMERAS.map((cam) => {
                  const isCurrent = selectedCam.id === cam.id;

                  return (
                    <div
                      key={cam.id}
                      onClick={() => {
                        setSelectedCam(cam);
                        handleResetPtz();
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex items-center gap-3 group ${
                        isCurrent
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,163,255,0.25)] ring-1 ring-cyan-400'
                          : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* Mini Thumbnail */}
                      <div className="relative w-16 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-neutral-800">
                        <img
                          src={cam.img}
                          alt={cam.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {cam.city}
                          </span>
                          <span className="text-[9px] font-mono text-cyan-400 font-semibold shrink-0">
                            {cam.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {cam.title}
                        </p>
                        <div className="text-[9px] text-neutral-500 font-mono mt-0.5 flex items-center justify-between">
                          <span>{cam.resolution}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCenterGlobe(cam);
                            }}
                            className="text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            <Compass className="w-2.5 h-2.5" />
                            <span>3D</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
              <span>SENSOR: {selectedCam.sensor.split(' ')[0]}</span>
              <span className="text-emerald-400">LATENCIA: 38ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
