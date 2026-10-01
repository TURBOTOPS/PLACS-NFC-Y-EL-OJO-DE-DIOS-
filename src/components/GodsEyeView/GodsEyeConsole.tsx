import { useState, useEffect } from 'react';
import {
  Activity,
  Satellite,
  Send,
  Sliders,
  Key,
  ArrowRight,
  RefreshCw,
  Compass,
  Eye,
  Crosshair,
  Sparkles,
  Plane,
  Ship,
  Cloud,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MapPin,
  CheckCircle,
  X,
  Grid,
  Search,
  Video,
  Mic,
  MicOff,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Lock,
  Globe2,
  Terminal,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import EarthGlobe, { Earthquake, SatellitePos, FlightItem, ShipItem } from './EarthGlobe';
import { processAiCommand, CommandResult, GLOBAL_GEOCODER } from './aiCommandEngine';

interface GodsEyeConsoleProps {
  onBackToStore: () => void;
  onOpenOrderModal: () => void;
}

// Live CCTV / City Cameras Data
const CITY_CAMERAS = [
  { id: 'cam-scl', city: 'Santiago de Chile', title: 'Plaza Baquedano / Providencia', lat: -33.4372, lon: -70.6345, img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', status: 'EN VIVO' },
  { id: 'cam-nyc', city: 'Nueva York, EE.UU.', title: 'Times Square / Midtown Manhattan', lat: 40.758, lon: -73.9855, img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&auto=format&fit=crop&q=80', status: 'EN VIVO' },
  { id: 'cam-tyo', city: 'Tokio, Japón', title: 'Cruce de Shibuya / Tokyo Central', lat: 35.6595, lon: 139.7005, img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80', status: 'EN VIVO' },
  { id: 'cam-lon', city: 'Londres, Reino Unido', title: 'TfL JamCam / Tower Bridge', lat: 51.5055, lon: -0.0754, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80', status: 'EN VIVO' },
  { id: 'cam-par', city: 'París, Francia', title: 'Torre Eiffel / Champs de Mars', lat: 48.8584, lon: 2.2945, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80', status: 'EN VIVO' },
];

export default function GodsEyeConsole({ onBackToStore, onOpenOrderModal }: GodsEyeConsoleProps) {
  // Layer toggles
  const [layers, setLayers] = useState({
    earthquakes: true,
    satellites: true,
    flights: true,
    ships: true,
    clouds: true,
    atmosphere: true,
    nightLights: true,
    grid: true,
  });

  // Telemetry HUD state
  const [telemetry, setTelemetry] = useState({
    lat: -33.4,
    lon: -70.6,
    alt: 8800,
    heading: 180,
  });

  // Target coordinates for camera fly-to
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lon: number; zoom?: number } | null>({
    lat: -33.4489,
    lon: -70.6693,
  });

  // Auto-follow target (e.g. 'iss')
  const [followingEntity, setFollowingEntity] = useState<string | null>(null);

  // Active selected entity for inspection drawer
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Live real data feeds
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [issPosition, setIssPosition] = useState<SatellitePos | null>(null);

  // Terminal Minimized/Expanded State (User requested option to minimize prompt bar)
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

  // Modals & Panels
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCctvDrawerOpen, setIsCctvDrawerOpen] = useState(false);

  // Search Bar input
  const [searchQuery, setSearchQuery] = useState('');

  // Audio effects & Voice recognition
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // API keys
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gods_eye_gemini_key') || '');
  const [cesiumToken, setCesiumToken] = useState(() => localStorage.getItem('gods_eye_cesium_token') || '');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  // AI Assistant state
  const [promptInput, setPromptInput] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiHistory, setAiHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; time: string; report?: any }>
  >([
    {
      role: 'assistant',
      text: 'Ojo de Dios activo. Conectado a la red de satélites NASA Blue Marble 2K, sismología mundial USGS y telemetría de la Estación Espacial Internacional (ISS). Di o escribe una orden para comenzar.',
      time: 'ONLINE',
      report: {
        title: 'SISTEMA DE INTELIGENCIA GEOESPACIAL ACTIVO',
        threatLevel: 'BAJO',
        summary: 'Monitoreo global de la Tierra en tiempo real impulsado por Atlas Automatizaciones.',
        dataPoints: [
          'Textura: Fotografía satelital Blue Marble 2K',
          'Sismos: Red sísmica en vivo USGS',
          'Órbita: ISS WhereTheISS en tiempo real',
          'Desarrollado por: Atlas Automatizaciones',
        ],
      },
    },
  ]);

  // Audio Synthesizer Beeps (Web Audio API)
  const playTacticalBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext restricted
    }
  };

  // Text to Speech
  const speakVoice = (text: string) => {
    if (!voiceSpeechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/\{[\s\S]*?\}/g, '').replace(/[^\w\s.,:;áéíóúÁÉÍÓÚñÑ]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'es-ES';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Por favor usa el teclado.');
      return;
    }

    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-CL';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListeningMic(true);
        playTacticalBeep(1200, 'sine', 0.1);
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setIsListeningMic(false);
        setPromptInput(transcript);
        handleSendCommand(transcript);
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch {
      setIsListeningMic(false);
    }
  };

  // 1. Fetch Real USGS Earthquakes
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
        if (res.ok) {
          const data = await res.json();
          const items: Earthquake[] = data.features.slice(0, 50).map((f: any) => ({
            id: f.id,
            mag: f.properties.mag,
            place: f.properties.place,
            time: f.properties.time,
            coords: f.geometry.coordinates,
          }));
          setEarthquakes(items);
        }
      } catch {
        console.warn('USGS feed offline or restricted');
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Real ISS Position every 4 seconds
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (res.ok) {
          const data = await res.json();
          const newPos = {
            name: 'ISS (Estación Espacial)',
            lat: Math.round(data.latitude * 100) / 100,
            lon: Math.round(data.longitude * 100) / 100,
            alt: Math.round(data.altitude),
            velocity: Math.round(data.velocity),
          };
          setIssPosition(newPos);

          // If following ISS, update targetCoords continuously
          if (followingEntity === 'iss') {
            setTargetCoords({ lat: newPos.lat, lon: newPos.lon });
          }
        }
      } catch {
        setIssPosition({
          name: 'ISS (Estación Espacial)',
          lat: 14.8,
          lon: -48.2,
          alt: 418,
          velocity: 27580,
        });
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 4000);
    return () => clearInterval(interval);
  }, [followingEntity]);

  // Handle Global Geosearch
  const handleGeosearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    let found = false;

    for (const [key, coords] of Object.entries(GLOBAL_GEOCODER)) {
      if (key.includes(query) || query.includes(key)) {
        setTargetCoords(coords);
        setSelectedEntity({
          type: 'location',
          name: coords.name,
          lat: coords.lat,
          lon: coords.lon,
        });
        playTacticalBeep(1200, 'sine', 0.1);
        found = true;
        break;
      }
    }

    if (!found) {
      handleSendCommand(`Volar a ${searchQuery}`);
    }

    setSearchQuery('');
  };

  // Handle AI Command Submission
  const handleSendCommand = async (textToSend?: string) => {
    const commandText = textToSend || promptInput;
    if (!commandText.trim()) return;

    playTacticalBeep(1200, 'sine', 0.08);

    const userEntry = {
      role: 'user' as const,
      text: commandText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setAiHistory((prev) => [...prev, userEntry]);
    setPromptInput('');
    setIsProcessingAi(true);

    try {
      const result: CommandResult = await processAiCommand(commandText, geminiApiKey, issPosition);

      // Execute flyTo if provided
      if (result.flyTo) {
        setTargetCoords({ lat: result.flyTo.lat, lon: result.flyTo.lon });
      }
      if (result.toggleLayer) {
        setLayers((prev) => ({ ...prev, [result.toggleLayer!]: true }));
      }
      if (result.followTarget) {
        setFollowingEntity(result.followTarget);
      } else {
        setFollowingEntity(null);
      }

      playTacticalBeep(800, 'triangle', 0.12);
      speakVoice(result.speech);

      const assistantEntry = {
        role: 'assistant' as const,
        text: result.speech,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        report: result.intelligenceReport,
      };

      setAiHistory((prev) => [...prev, assistantEntry]);
    } catch {
      setAiHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Comando ejecutado con éxito en los sensores del Ojo de Dios.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessingAi(false);
    }
  };

  const handleSaveKeys = () => {
    localStorage.setItem('gods_eye_gemini_key', geminiApiKey.trim());
    localStorage.setItem('gods_eye_cesium_token', cesiumToken.trim());
    setSavedKeySuccess(true);
    playTacticalBeep(1400, 'sine', 0.2);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-neutral-100 flex flex-col overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & ATLAS COMMERCIAL CONVERSION FUNNEL                        */}
      {/* ========================================================================= */}
      <header className="h-16 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,163,255,0.4)]">
            <Eye className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-display font-black tracking-wider uppercase text-white flex items-center gap-1.5">
                <span>OJO DE DIOS</span>
                <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800">
                  REAL 3D GLOBE
                </span>
              </h1>
            </div>
            <div className="text-[10px] text-neutral-400 hidden sm:block">
              Consola Planetaria en Tiempo Real · Sismos USGS, ISS, Vuelos y Buques
            </div>
          </div>
        </div>

        {/* TOP SEARCH BAR (FLY TO ANY CITY OR REGION) */}
        <form onSubmit={handleGeosearch} className="hidden md:flex items-center relative w-64 lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ciudad (Santiago, Tokio, Magallanes...)"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
        </form>

        {/* CONTROLS & CTA BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* INFO & TUTORIAL DRAWER BUTTON */}
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer transition-colors"
            title="Guía de API y Permisos"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Info & API</span>
          </button>

          {/* CCTV Cameras Toggle */}
          <button
            onClick={() => {
              setIsCctvDrawerOpen(!isCctvDrawerOpen);
              playTacticalBeep(900, 'sine', 0.05);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              isCctvDrawerOpen ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-neutral-900 border-neutral-700 text-neutral-300'
            }`}
            title="Cámaras Urbanas CCTV"
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">Cámaras</span>
          </button>

          {/* Voice Speech Audio Output Toggle */}
          <button
            onClick={() => {
              setVoiceSpeechEnabled(!voiceSpeechEnabled);
              playTacticalBeep(1100, 'sine', 0.08);
            }}
            className={`p-2 rounded-lg border text-xs cursor-pointer ${
              voiceSpeechEnabled ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
            title={voiceSpeechEnabled ? 'Voz de IA Activada' : 'Activar Voz de IA en Comandos'}
          >
            <Radio className="w-3.5 h-3.5" />
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
            title={soundEnabled ? 'Silenciar Efectos' : 'Activar Sonido'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Connect API Key button */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">
              {geminiApiKey ? 'API Conectada' : 'Conectar API'}
            </span>
          </button>

          {/* Direct CTA to Placas NFC ($49.990) */}
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,163,255,0.4)] cursor-pointer transition-all active:scale-95"
          >
            <span>Placas NFC ($49.990)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* TOP NOTIFICATION BAR FOR ATLAS AUTOMATIZACIONES */}
      <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900/90 to-cyan-950/80 border-b border-cyan-500/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-neutral-300 z-20 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="font-semibold text-white">Desarrollado por Atlas Automatizaciones:</span>
          <span className="text-neutral-300 hidden sm:inline">
            Aumenta tus reseñas en Google Maps con placas acrílicas inteligentes NFC. Envíos express a todo Chile.
          </span>
        </div>
        <button
          onClick={onOpenOrderModal}
          className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 shrink-0 ml-2 cursor-pointer"
        >
          Pedir Placas para mi Negocio →
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. 3D EARTH GLOBE VIEWPORT & FLOATING COCKPIT HUD                          */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Authentic NASA 3D Earth Three.js Engine */}
        <EarthGlobe
          activeLayers={layers}
          earthquakes={earthquakes}
          issPosition={issPosition}
          targetCoords={targetCoords}
          followingEntity={followingEntity}
          onSelectEntity={setSelectedEntity}
          onUpdateTelemetry={setTelemetry}
        />

        {/* TOP-LEFT TELEMETRY HUD */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
          <div className="p-3 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-xs font-mono shadow-2xl flex flex-col gap-1.5 w-64">
            <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-widest border-b border-neutral-800 pb-1">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                TELEMETRÍA GEOESPACIAL
              </span>
              <span className="text-emerald-400">EN VIVO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">COORDENADAS:</span>
              <span className="text-white font-bold">{telemetry.lat}° N / {telemetry.lon}° E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">ALTITUD ORBITAL:</span>
              <span className="text-cyan-400 font-bold">{telemetry.alt} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">MAPA BASE:</span>
              <span className="text-emerald-400 font-bold">NASA Blue Marble 2K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">OBJETOS ACTIVOS:</span>
              <span className="text-cyan-300 font-bold">{earthquakes.length + 16} detectados</span>
            </div>
          </div>
        </div>

        {/* LEFT CONTROLS: LAYER TOGGLES & CITY FLY-TO PRESETS */}
        <div className="absolute top-44 left-4 z-10 flex flex-col gap-2">
          <div className="p-3 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 shadow-2xl flex flex-col gap-1.5 w-52 text-xs">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between border-b border-neutral-800 pb-1 mb-1">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                Capas Activas
              </span>
              <span className="text-cyan-400 font-mono">ON/OFF</span>
            </div>

            {/* Sismos USGS */}
            <button
              onClick={() => {
                setLayers((p) => ({ ...p, earthquakes: !p.earthquakes }));
                playTacticalBeep(900, 'sine', 0.05);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                layers.earthquakes
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Sismos USGS
              </span>
              <span className="text-[10px] font-mono">{earthquakes.length}</span>
            </button>

            {/* ISS en Tiempo Real */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setLayers((p) => ({ ...p, satellites: !p.satellites }));
                  playTacticalBeep(900, 'sine', 0.05);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                  layers.satellites
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5" /> ISS Órbita
                </span>
                <span className="text-[10px] font-mono">6 Activos</span>
              </button>

              {/* Sub-list of Clickable Satellites */}
              {layers.satellites && (
                <div className="pl-2 border-l border-cyan-500/30 flex flex-col gap-1 py-1 text-[10px] font-mono">
                  <button
                    onClick={() => {
                      if (issPosition) {
                        setSelectedEntity({
                          type: 'satellite',
                          data: {
                            id: 'ISS-25544',
                            name: 'Estación Espacial Internacional (ISS)',
                            operator: 'NASA / ESA / JAXA / Roscosmos',
                            type: 'Estación Orbital Tripulada',
                            lat: issPosition.lat,
                            lon: issPosition.lon,
                            alt: issPosition.alt,
                            velocity: issPosition.velocity,
                            status: 'SEÑAL TRANSMITIENDO EN VIVO',
                          },
                        });
                        setTargetCoords({ lat: issPosition.lat, lon: issPosition.lon, zoom: 14.5 });
                        playTacticalBeep(1200, 'sine', 0.1);
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-left truncate cursor-pointer"
                  >
                    🛰️ ISS (Donde vuela hoy)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEntity({
                        type: 'satellite',
                        data: {
                          id: 'HST-1990',
                          name: 'Telescopio Espacial Hubble',
                          operator: 'NASA / ESA',
                          type: 'Observatorio Óptico Espacial',
                          lat: -28.5,
                          lon: 35.2,
                          alt: 540,
                          velocity: 27300,
                          status: 'OBSERVACIÓN EN VIVO',
                        },
                      });
                      setTargetCoords({ lat: -28.5, lon: 35.2, zoom: 14.5 });
                      playTacticalBeep(1200, 'sine', 0.1);
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-left truncate cursor-pointer"
                  >
                    🔭 Telescopio Hubble
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEntity({
                        type: 'satellite',
                        data: {
                          id: 'STARLINK-5281',
                          name: 'Starlink-5281',
                          operator: 'SpaceX',
                          type: 'Constelación Internet LEO',
                          lat: 45.2,
                          lon: -120.5,
                          alt: 550,
                          velocity: 27050,
                          status: 'ENLACE LÁSER ACTIVO',
                        },
                      });
                      setTargetCoords({ lat: 45.2, lon: -120.5, zoom: 14.5 });
                      playTacticalBeep(1200, 'sine', 0.1);
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-left truncate cursor-pointer"
                  >
                    📡 Starlink-5281
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEntity({
                        type: 'satellite',
                        data: {
                          id: 'GPS-NAVSTAR-78',
                          name: 'GPS Navstar-78',
                          operator: 'US Space Force',
                          type: 'Navegación y Tiempo MEO',
                          lat: 55.0,
                          lon: 15.0,
                          alt: 20200,
                          velocity: 14000,
                          status: 'SEÑAL ATÓMICA L1/L2',
                        },
                      });
                      setTargetCoords({ lat: 55.0, lon: 15.0, zoom: 14.5 });
                      playTacticalBeep(1200, 'sine', 0.1);
                    }}
                    className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-left truncate cursor-pointer"
                  >
                    🌐 GPS Navstar-78
                  </button>
                </div>
              )}
            </div>

            {/* Vuelos Comerciales ADS-B */}
            <button
              onClick={() => {
                setLayers((p) => ({ ...p, flights: !p.flights }));
                playTacticalBeep(900, 'sine', 0.05);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                layers.flights
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" /> Vuelos ADS-B
              </span>
              <span className="text-[10px] font-mono">10</span>
            </button>

            {/* Buques Marítimos AIS */}
            <button
              onClick={() => {
                setLayers((p) => ({ ...p, ships: !p.ships }));
                playTacticalBeep(900, 'sine', 0.05);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                layers.ships
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" /> Buques AIS
              </span>
              <span className="text-[10px] font-mono">6</span>
            </button>

            {/* Nubes Satelitales */}
            <button
              onClick={() => {
                setLayers((p) => ({ ...p, clouds: !p.clouds }));
                playTacticalBeep(900, 'sine', 0.05);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                layers.clouds
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5" /> Nubes Reales
              </span>
              <span className="text-[10px] font-mono">NASA</span>
            </button>

            {/* Cuadrícula Táctica */}
            <button
              onClick={() => {
                setLayers((p) => ({ ...p, grid: !p.grid }));
                playTacticalBeep(900, 'sine', 0.05);
              }}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                layers.grid
                  ? 'bg-neutral-800 border-cyan-500/30 text-cyan-300 font-semibold'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" /> Cuadrícula
              </span>
              <span className="text-[10px] font-mono">OSINT</span>
            </button>

            {/* City Fly-To Presets */}
            <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>Foco Táctico</span>
              <Crosshair className="w-3 h-3 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setTargetCoords({ lat: -33.4489, lon: -70.6693, zoom: 14 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded text-[11px] font-bold text-cyan-300 cursor-pointer text-left truncate"
              >
                🇨🇱 Santiago
              </button>
              <button
                onClick={() => {
                  setTargetCoords({ lat: 48.8566, lon: 2.3522, zoom: 13.5 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 cursor-pointer text-left truncate"
              >
                🇫🇷 París
              </button>
              <button
                onClick={() => {
                  setTargetCoords({ lat: -53.5, lon: -71.0, zoom: 14 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 cursor-pointer text-left truncate"
              >
                🇨🇱 Magallanes
              </button>
              <button
                onClick={() => {
                  setTargetCoords({ lat: 40.7128, lon: -74.006, zoom: 14 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 cursor-pointer text-left truncate"
              >
                🇺🇸 N. York
              </button>
              <button
                onClick={() => {
                  setTargetCoords({ lat: 35.6762, lon: 139.6503, zoom: 14 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 cursor-pointer text-left truncate"
              >
                🇯🇵 Tokio
              </button>
              <button
                onClick={() => {
                  setTargetCoords({ lat: 51.5074, lon: -0.1278, zoom: 14 });
                  setFollowingEntity(null);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[11px] font-semibold text-neutral-200 cursor-pointer text-left truncate"
              >
                🇬🇧 Londres
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE INTEL FEED & ENTITY INSPECTOR */}
        <div className="absolute top-4 right-4 z-10 hidden lg:flex flex-col gap-3 w-80 pointer-events-auto">
          {/* ISS Live Status Card */}
          {issPosition && (
            <div
              onClick={() => {
                setSelectedEntity({
                  type: 'satellite',
                  data: {
                    id: 'ISS-25544',
                    name: 'Estación Espacial Internacional (ISS)',
                    operator: 'NASA / ESA / JAXA / Roscosmos',
                    type: 'Estación Orbital Tripulada',
                    lat: issPosition.lat,
                    lon: issPosition.lon,
                    alt: issPosition.alt,
                    velocity: issPosition.velocity,
                    status: 'SEÑAL TRANSMITIENDO EN VIVO',
                  },
                });
                playTacticalBeep(1100, 'sine', 0.08);
              }}
              className="p-3.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 shadow-2xl text-xs cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-2 border-b border-neutral-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 animate-spin" />
                  ESTACIÓN ESPACIAL INTERNACIONAL
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">SEÑAL ACTIVA</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[10px]">VELOCIDAD</span>
                  <span className="text-white font-bold">{issPosition.velocity} km/h</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">ALTITUD LEO</span>
                  <span className="text-cyan-400 font-bold">{issPosition.alt} km</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">LATITUD</span>
                  <span className="text-white font-bold">{issPosition.lat}°</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">LONGITUD</span>
                  <span className="text-white font-bold">{issPosition.lon}°</span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setTargetCoords({ lat: issPosition.lat, lon: issPosition.lon });
                    playTacticalBeep(1200, 'sine', 0.1);
                  }}
                  className="flex-1 py-1.5 text-[11px] font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-lg cursor-pointer transition-colors"
                >
                  Centrar ISS
                </button>
                <button
                  onClick={() => {
                    const willFollow = followingEntity !== 'iss';
                    setFollowingEntity(willFollow ? 'iss' : null);
                    playTacticalBeep(1400, 'triangle', 0.15);
                  }}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border cursor-pointer ${
                    followingEntity === 'iss'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                  }`}
                >
                  {followingEntity === 'iss' ? 'Siguiendo ✓' : 'Seguir Órbita'}
                </button>
              </div>
            </div>
          )}

          {/* Recent Earthquakes Feed (USGS) */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 shadow-2xl text-xs max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-2 border-b border-neutral-800 pb-1.5 sticky top-0 bg-neutral-950/90">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                SISMOS EN VIVO (USGS 24H)
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{earthquakes.length} Eventos</span>
            </div>
            <div className="space-y-1.5">
              {earthquakes.slice(0, 6).map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => {
                    setTargetCoords({ lat: eq.coords[1], lon: eq.coords[0], zoom: 14 });
                    setSelectedEntity({
                      type: 'earthquake',
                      data: {
                        id: eq.id,
                        name: eq.place,
                        mag: eq.mag,
                        depth: Math.round(eq.coords[2]),
                        lat: eq.coords[1],
                        lon: eq.coords[0],
                        status: 'REGISTRADO POR RED SÍSMICA USGS',
                      },
                    });
                    playTacticalBeep(1000, 'sine', 0.08);
                  }}
                  className="p-1.5 rounded-lg bg-neutral-900/70 hover:bg-neutral-800/80 border border-neutral-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="truncate mr-2">
                    <div className="text-[11px] font-semibold text-white truncate">{eq.place}</div>
                    <div className="text-[9px] text-neutral-400 font-mono">Profundidad: {Math.round(eq.coords[2])} km</div>
                  </div>
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                      eq.mag >= 5.5 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    M{eq.mag.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TACTICAL ENTITY DOSSIER INSPECTION CARD (OPENS ON 3D CLICK OR LIST CLICK) */}
        {/* ========================================================================= */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 sm:right-6 z-40 w-80 sm:w-92 bg-neutral-950/95 backdrop-blur-2xl border border-cyan-400/60 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,163,255,0.4)] animate-in fade-in zoom-in-95 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
                  {selectedEntity.type === 'satellite' && <Satellite className="w-5 h-5 animate-pulse" />}
                  {selectedEntity.type === 'earthquake' && <Activity className="w-5 h-5 text-amber-400" />}
                  {selectedEntity.type === 'flight' && <Plane className="w-5 h-5 text-emerald-400" />}
                  {selectedEntity.type === 'ship' && <Ship className="w-5 h-5 text-purple-400" />}
                  {selectedEntity.type === 'city' && <MapPin className="w-5 h-5 text-cyan-400" />}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                    TELEMETRÍA EN VIVO · {selectedEntity.type?.toUpperCase()}
                  </span>
                  <h4 className="font-display font-black text-sm text-white truncate max-w-[190px]">
                    {selectedEntity.data?.name || selectedEntity.name || 'Objetivo'}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                title="Cerrar Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono">
              <span className="text-neutral-400">ESTADO</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {selectedEntity.data?.status || 'TRANSMITIENDO ENLACE'}
              </span>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
              {selectedEntity.data?.operator && (
                <div className="col-span-2">
                  <span className="text-[10px] text-neutral-500 block">OPERADOR</span>
                  <span className="text-cyan-300 font-bold">{selectedEntity.data.operator}</span>
                </div>
              )}
              {selectedEntity.data?.type && (
                <div className="col-span-2">
                  <span className="text-[10px] text-neutral-500 block">TIPO / MISIÓN</span>
                  <span className="text-neutral-200">{selectedEntity.data.type}</span>
                </div>
              )}
              {selectedEntity.data?.lat !== undefined && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">LATITUD</span>
                  <span className="text-white font-bold">{selectedEntity.data.lat}°</span>
                </div>
              )}
              {selectedEntity.data?.lon !== undefined && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">LONGITUD</span>
                  <span className="text-white font-bold">{selectedEntity.data.lon}°</span>
                </div>
              )}
              {selectedEntity.data?.alt && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">ALTITUD</span>
                  <span className="text-cyan-400 font-bold">{selectedEntity.data.alt} km</span>
                </div>
              )}
              {selectedEntity.data?.velocity && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">VELOCIDAD</span>
                  <span className="text-white font-bold">{selectedEntity.data.velocity} km/h</span>
                </div>
              )}
              {selectedEntity.data?.mag !== undefined && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">MAGNITUD</span>
                  <span className="text-amber-400 font-bold text-sm">M{selectedEntity.data.mag}</span>
                </div>
              )}
              {selectedEntity.data?.depth !== undefined && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">PROFUNDIDAD</span>
                  <span className="text-neutral-200">{selectedEntity.data.depth} km</span>
                </div>
              )}
              {selectedEntity.data?.origin && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">ORIGEN</span>
                  <span className="text-neutral-200">{selectedEntity.data.origin}</span>
                </div>
              )}
              {selectedEntity.data?.dest && (
                <div>
                  <span className="text-[10px] text-neutral-500 block">DESTINO</span>
                  <span className="text-neutral-200">{selectedEntity.data.dest}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (selectedEntity.data?.lat !== undefined && selectedEntity.data?.lon !== undefined) {
                    setTargetCoords({ lat: selectedEntity.data.lat, lon: selectedEntity.data.lon, zoom: 13.5 });
                    setFollowingEntity(null);
                    playTacticalBeep(1200, 'sine', 0.1);
                  }
                }}
                className="flex-1 py-2 text-xs font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Centrar en 3D</span>
              </button>

              {selectedEntity.type === 'satellite' && (
                <button
                  onClick={() => {
                    const isIss = selectedEntity.data?.id?.includes('ISS');
                    if (isIss) {
                      setFollowingEntity('iss');
                    } else if (selectedEntity.data?.lat !== undefined && selectedEntity.data?.lon !== undefined) {
                      setTargetCoords({ lat: selectedEntity.data.lat, lon: selectedEntity.data.lon, zoom: 14 });
                    }
                    playTacticalBeep(1400, 'triangle', 0.15);
                  }}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
                    followingEntity === 'iss' && selectedEntity.data?.id?.includes('ISS')
                      ? 'bg-emerald-500 text-neutral-950 font-black'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>
                    {followingEntity === 'iss' && selectedEntity.data?.id?.includes('ISS')
                      ? 'Siguiendo ✓'
                      : 'Seguir Órbita'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. BOTTOM AI COMMAND TERMINAL (WITH MINIMIZE / FULLSCREEN BUTTONS)         */}
        {/* ========================================================================= */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            {isTerminalMinimized ? (
              /* Minimized Floating Bar / Pill to enjoy unobstructed 3D Earth */
              <div className="flex items-center justify-between p-2.5 px-4 rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-2">
                <button
                  onClick={() => {
                    setIsTerminalMinimized(false);
                    playTacticalBeep(1100, 'sine', 0.06);
                  }}
                  className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white cursor-pointer group"
                >
                  <Terminal className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-cyan-300">Terminal Ojo de Dios</span>
                  <span className="text-neutral-500">· Click para desplegar teclado y órdenes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
                    title="Pantalla Completa"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsTerminalMinimized(false);
                      playTacticalBeep(1100, 'sine', 0.06);
                    }}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-400 hover:text-white cursor-pointer"
                    title="Expandir Terminal"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Expanded Full Command Terminal */
              <div className="p-3 sm:p-4 rounded-3xl bg-neutral-950/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-2.5 animate-in fade-in">
                {/* Header Controls for Terminal: Minimize & Fullscreen */}
                <div className="flex items-center justify-between pb-1 border-b border-neutral-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>INTELIGENCIA ARTIFICIAL OJO DE DIOS</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Fullscreen Button */}
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={isFullscreen ? 'Salir de Pantalla Completa' : 'Ver Tierra en Pantalla Completa'}
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Minimize Terminal Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsTerminalMinimized(true);
                        playTacticalBeep(800, 'sine', 0.06);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-neutral-800 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Minimizar para ver el mundo completo"
                    >
                      <ChevronDown className="w-4 h-4 text-neutral-300" />
                      <span>Minimizar</span>
                    </button>
                  </div>
                </div>

                {/* Last AI message / Situation Report readout */}
                {aiHistory.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/80 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        REPORTE DE OPERACIONES
                      </span>
                      <span className="text-neutral-500 font-mono">
                        {aiHistory[aiHistory.length - 1].time}
                      </span>
                    </div>
                    <p className="text-neutral-200 text-xs sm:text-sm leading-snug">
                      {aiHistory[aiHistory.length - 1].text}
                    </p>

                    {aiHistory[aiHistory.length - 1].report && (
                      <div className="mt-2 pt-2 border-t border-neutral-800 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-neutral-300">
                        {aiHistory[aiHistory.length - 1].report.dataPoints.map((dp: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="text-cyan-400">▸</span>
                            <span>{dp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Action Suggestion Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  <button
                    onClick={() => handleSendCommand('Llévanos a Santiago de Chile')}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                  >
                    🇨🇱 Santiago de Chile
                  </button>
                  <button
                    onClick={() => handleSendCommand('Rastrear posición de la Estación Espacial Internacional (ISS)')}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                  >
                    🛰️ Rastrear ISS
                  </button>
                  <button
                    onClick={() => handleSendCommand('Mostrar sismos y actividad tectónica en el Cinturón de Fuego')}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                  >
                    ⚡ Sismos del Pacífico
                  </button>
                  <button
                    onClick={() => handleSendCommand('Escanear espacio aéreo y rutas de vuelo')}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                  >
                    ✈️ Vuelos ADS-B
                  </button>
                  <button
                    onClick={() => handleSendCommand('Monitorear buques en el Estrecho de Magallanes y Canal de Panamá')}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                  >
                    🚢 Tráfico Marítimo
                  </button>
                </div>

                {/* Input Bar with Microphone Voice Control */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCommand();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isListeningMic
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                    }`}
                    title="Hablar por micrófono a la IA"
                  >
                    {isListeningMic ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Escribe una orden de vuelo, consulta de satélites o pregunta al Ojo de Dios..."
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isProcessingAi}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,163,255,0.4)] cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isProcessingAi ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Ejecutar</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CCTV LIVE CAMERAS DRAWER                                               */}
      {/* ========================================================================= */}
      {isCctvDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800 z-40 p-5 overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              <h3 className="font-display font-bold text-base text-white">Cámaras Urbanas CCTV</h3>
            </div>
            <button
              onClick={() => setIsCctvDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {CITY_CAMERAS.map((cam) => (
              <div
                key={cam.id}
                onClick={() => {
                  setTargetCoords({ lat: cam.lat, lon: cam.lon, zoom: 13.5 });
                  setFollowingEntity(null);
                  setIsCctvDrawerOpen(false);
                  playTacticalBeep(1100, 'sine', 0.08);
                }}
                className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900 hover:border-cyan-500/50 cursor-pointer transition-all group"
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  <img
                    src={cam.img}
                    alt={cam.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 border border-red-500/50 text-[10px] font-bold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{cam.status}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded">
                    {cam.city}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {cam.title}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-between">
                    <span>{cam.lat}° N, {cam.lon}° E</span>
                    <span className="text-cyan-400 font-bold">Enfocar 3D →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INFO & API KEY GUIDE MODAL (EXPLAINS HOW TO CONNECT KEYS & PERMISSIONS) */}
      {/* ========================================================================= */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Centro de Ayuda e Información</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white mb-2">
              Cómo conectar tu API y Permisos
            </h3>
            <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
              El Ojo de Dios está diseñado para funcionar de forma 100% autónoma o ampliada mediante Inteligencia Artificial conectando tus propias credenciales gratuitas.
            </p>

            <div className="space-y-4 text-xs">
              {/* Card 1: Google Gemini API */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-cyan-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    1. Google Gemini API (Recomendada)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-400">
                    GRATIS
                  </span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Permite que la consola razone en tiempo real sobre geopolítica, identifique satélites y vuele la cámara a cualquier lugar del mundo usando lenguaje natural.
                </p>
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 space-y-1.5 font-mono text-[11px] text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">Paso 1:</span>
                    <span>Ingresa a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline">aistudio.google.com/app/apikey</a> con tu cuenta Google.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">Paso 2:</span>
                    <span>Haz clic en <strong>"Create API Key"</strong> y copia el código generado (empieza con <code className="text-amber-400">AIzaSy...</code>).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">Paso 3:</span>
                    <span>Abre <strong>"Conectar API"</strong> en la esquina superior derecha y pégala.</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Permisos requeridos:</strong> Únicamente inferencia estándar <code className="font-mono">generateContent</code>. No requiere tarjeta de crédito ni permisos de cuenta privada.</span>
                </div>
              </div>

              {/* Card 2: Cesium Ion & Google Photorealistic 3D Tiles */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-purple-400" />
                    2. Cesium Ion Token (Opcional)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-[10px] font-mono text-purple-300">
                    OPCIONAL
                  </span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Para cargar capas avanzadas de fotogrametría y modelos 3D adicionales de Cesium Ion.
                </p>
                <div className="text-[11px] text-neutral-300 font-mono">
                  Obtén tu token gratuito en <a href="https://ion.cesium.com/tokens" target="_blank" rel="noreferrer" className="text-purple-400 underline">ion.cesium.com/tokens</a> con el scope predeterminado de lectura pública de assets.
                </div>
              </div>

              {/* Card 3: Privacidad y Seguridad de tus Claves */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Seguridad y Almacenamiento Local</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Tus claves API se guardan <strong>exclusivamente en tu propio navegador</strong> (<code className="text-amber-400">localStorage</code>) y se comunican de forma directa y cifrada con los servidores de Google. Nunca se almacenan en ningún servidor de terceros.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsInfoModalOpen(false);
                  setIsKeyModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs cursor-pointer transition-all shadow-lg"
              >
                Abrir Configuración de API →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CONNECT API MODAL (GEMINI API / CESIUM ION TOKEN)                       */}
      {/* ========================================================================= */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Key className="w-4 h-4" />
              <span>Conexión de Inteligencia Artificial</span>
            </div>
            <h3 className="text-xl font-display font-extrabold text-white mb-2">
              Conectar tu propia API Key
            </h3>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              Puedes ingresar tu API Key de Google Gemini para habilitar el modelo de lenguaje de última generación, o utilizar el motor de inteligencia geoespacial integrado de Atlas de forma 100% gratuita.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Google Gemini API Key (Opcional):
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Permite comandos en lenguaje natural con Gemini 2.5 Flash.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Cesium Ion Token / Map Key (Opcional):
                </label>
                <input
                  type="password"
                  value={cesiumToken}
                  onChange={(e) => setCesiumToken(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Para cargar tiles fotorrealistas de Cesium Ion.
                </span>
              </div>

              {savedKeySuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>¡Claves guardadas exitosamente en tu navegador!</span>
                </div>
              )}

              <button
                onClick={handleSaveKeys}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs hover:from-blue-500 hover:to-cyan-400 shadow-lg cursor-pointer transition-all active:scale-98"
              >
                Guardar y Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
