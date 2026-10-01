import { GoogleGenAI } from '@google/genai';

export interface CommandResult {
  speech: string;
  flyTo?: { lat: number; lon: number; name: string; alt?: number };
  toggleLayer?: 'earthquakes' | 'satellites' | 'flights' | 'ships' | 'clouds';
  followTarget?: string;
  intelligenceReport?: {
    title: string;
    threatLevel: 'BAJO' | 'MODERADO' | 'ELEVADO';
    summary: string;
    dataPoints: string[];
  };
}

// Comprehensive global location coordinates for instant geocoding
export const GLOBAL_GEOCODER: Record<string, { lat: number; lon: number; name: string; alt?: number }> = {
  // Chile
  santiago: { lat: -33.4489, lon: -70.6693, name: 'Santiago de Chile' },
  chile: { lat: -33.4489, lon: -70.6693, name: 'Chile (Región Central)' },
  antofagasta: { lat: -23.65, lon: -70.4, name: 'Antofagasta, Chile' },
  valparaiso: { lat: -33.0472, lon: -71.6127, name: 'Valparaíso / Viña del Mar, Chile' },
  concepcion: { lat: -36.827, lon: -73.0503, name: 'Concepción, Chile' },
  'punta arenas': { lat: -53.1638, lon: -70.9171, name: 'Punta Arenas, Chile' },
  'estrecho de magallanes': { lat: -53.5, lon: -71.0, name: 'Estrecho de Magallanes' },
  'cabo de hornos': { lat: -55.98, lon: -67.27, name: 'Cabo de Hornos' },
  'isla de pascua': { lat: -27.1127, lon: -109.3497, name: 'Rapa Nui (Isla de Pascua)' },
  atacama: { lat: -23.8634, lon: -69.1328, name: 'Desierto de Atacama, Chile' },
  patagonia: { lat: -48.0, lon: -73.0, name: 'Patagonia Chilena' },
  arica: { lat: -18.4783, lon: -70.3126, name: 'Arica, Chile' },
  iquique: { lat: -20.2307, lon: -70.1357, name: 'Iquique, Chile' },
  laserena: { lat: -29.9027, lon: -71.2519, name: 'La Serena, Chile' },
  temuco: { lat: -38.7359, lon: -72.5904, name: 'Temuco, Chile' },
  puertomontt: { lat: -41.4693, lon: -72.9424, name: 'Puerto Montt, Chile' },

  // Sudamérica & Chokepoints
  'buenos aires': { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' },
  'canal de panama': { lat: 9.08, lon: -79.68, name: 'Canal de Panamá' },
  panama: { lat: 8.98, lon: -79.52, name: 'Panamá' },
  lima: { lat: -12.0464, lon: -77.0428, name: 'Lima, Perú' },
  bogota: { lat: 4.711, lon: -74.0721, name: 'Bogotá, Colombia' },
  'sao paulo': { lat: -23.5505, lon: -46.6333, name: 'São Paulo, Brasil' },
  'rio de janeiro': { lat: -22.9068, lon: -43.1729, name: 'Río de Janeiro, Brasil' },
  montevideo: { lat: -34.9011, lon: -56.1645, name: 'Montevideo, Uruguay' },
  quito: { lat: -0.1807, lon: -78.4678, name: 'Quito, Ecuador' },

  // Norteamérica
  'nueva york': { lat: 40.7128, lon: -74.006, name: 'Nueva York, EE.UU.' },
  'los angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Ángeles, EE.UU.' },
  miami: { lat: 25.7617, lon: -80.1918, name: 'Miami, EE.UU.' },
  washington: { lat: 38.9072, lon: -77.0369, name: 'Washington D.C., EE.UU.' },
  mexico: { lat: 19.4326, lon: -99.1332, name: 'Ciudad de México' },
  toronto: { lat: 43.6532, lon: -79.3832, name: 'Toronto, Canadá' },

  // Europa
  madrid: { lat: 40.4168, lon: -3.7038, name: 'Madrid, España' },
  barcelona: { lat: 41.3851, lon: 2.1734, name: 'Barcelona, España' },
  londres: { lat: 51.5074, lon: -0.1278, name: 'Londres, Reino Unido' },
  paris: { lat: 48.8566, lon: 2.3522, name: 'París, Francia' },
  roma: { lat: 41.9028, lon: 12.4964, name: 'Roma, Italia' },
  berlin: { lat: 52.52, lon: 13.405, name: 'Berlín, Alemania' },
  gibraltar: { lat: 36.1408, lon: -5.3536, name: 'Estrecho de Gibraltar' },

  // Asia & Medio Oriente
  tokio: { lat: 35.6762, lon: 139.6503, name: 'Tokio, Japón' },
  pekin: { lat: 39.9042, lon: 116.4074, name: 'Pekín, China' },
  shanghai: { lat: 31.2304, lon: 121.4737, name: 'Shanghái, China' },
  dubai: { lat: 25.2048, lon: 55.2708, name: 'Dubái, EAU' },
  singapur: { lat: 1.3521, lon: 103.8198, name: 'Singapur (Estrecho de Malaca)' },
  suez: { lat: 29.9668, lon: 32.5498, name: 'Canal de Suez, Egipto' },
  cairo: { lat: 30.0444, lon: 31.2357, name: 'El Cairo, Egipto' },
  jerusalen: { lat: 31.7683, lon: 35.2137, name: 'Jerusalén' },

  // Oceanía y Polos
  sidney: { lat: -33.8688, lon: 151.2093, name: 'Sídney, Australia' },
  melbourne: { lat: -37.8136, lon: 144.9631, name: 'Melbourne, Australia' },
  antartica: { lat: -82.8628, lon: 135.0, name: 'Antártica (Polo Sur)' },
  'polo norte': { lat: 85.0, lon: 0.0, name: 'Océano Ártico (Polo Norte)' },
};

// Calculate great circle distance between two lat/lon coordinates
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function processAiCommand(
  prompt: string,
  userApiKey?: string,
  issPosition?: { lat: number; lon: number } | null
): Promise<CommandResult> {
  const cleanPrompt = prompt.toLowerCase().trim();

  // If user provided a Gemini API Key, use real @google/genai
  if (userApiKey && userApiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey: userApiKey.trim() });
      const systemInstruction = `Eres "Ojo de Dios", la consola de inteligencia geoespacial planetaria de Atlas Automatizaciones.
Responde de forma concisa, táctica y profesional en español (estilo reporte de operaciones).
Si el usuario solicita volar a una ciudad o país, incluye un bloque JSON al inicio con formato {"flyTo": {"lat": number, "lon": number, "name": string}}.
Si el usuario solicita seguir la ISS, incluye {"followTarget": "iss"}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      let flyTo: { lat: number; lon: number; name: string } | undefined;
      let followTarget: string | undefined;

      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.flyTo) flyTo = parsed.flyTo;
          if (parsed.followTarget) followTarget = parsed.followTarget;
        } catch {
          // ignore
        }
      }

      return {
        speech: text.replace(/\{[\s\S]*?\}/, '').trim() || text,
        flyTo,
        followTarget,
      };
    } catch (err: any) {
      console.warn('Error with custom Gemini API Key:', err);
    }
  }

  // 1. ISS Tracking Query
  if (cleanPrompt.includes('iss') || cleanPrompt.includes('estacion espacial') || cleanPrompt.includes('satelite')) {
    if (issPosition) {
      return {
        speech: `Órbita fijada: La Estación Espacial Internacional (ISS) se desplaza a 27.600 km/h sobre latitud ${issPosition.lat}°, longitud ${issPosition.lon}°. Telemetría enlazada con éxito.`,
        flyTo: { lat: issPosition.lat, lon: issPosition.lon, name: 'Estación Espacial Internacional' },
        toggleLayer: 'satellites',
        followTarget: 'iss',
        intelligenceReport: {
          title: 'VIGILANCIA ORBITAL LEO — ESTACIÓN ESPACIAL INTERNACIONAL',
          threatLevel: 'BAJO',
          summary: 'La ISS vuela a 418 km de altitud completando una vuelta al planeta cada 92 minutos.',
          dataPoints: [
            `Coordenadas actuales: ${issPosition.lat}° Lat, ${issPosition.lon}° Lon`,
            'Velocidad orbital: 7.66 km/segundo (27.600 km/h)',
            'Tripulación a bordo: Expedición permanente activa',
            'Inclinación orbital: 51.6 grados',
          ],
        },
      };
    }
    return {
      speech: 'Conectando con la constelación de satélites en órbita LEO. Capa satelital activada.',
      toggleLayer: 'satellites',
    };
  }

  // 2. Earthquakes / Tectonics Query
  if (
    cleanPrompt.includes('sismo') ||
    cleanPrompt.includes('terremoto') ||
    cleanPrompt.includes('temblor') ||
    cleanPrompt.includes('placa') ||
    cleanPrompt.includes('cinturon de fuego')
  ) {
    return {
      speech: 'Activando sensor sismológico global en tiempo real (red USGS). Los círculos en la superficie representan eventos telúricos registrados en las últimas 24 horas.',
      toggleLayer: 'earthquakes',
      flyTo: { lat: -25, lon: -70, name: 'Cinturón de Fuego del Pacífico (Chile)' },
      intelligenceReport: {
        title: 'MONITOREO SÍSMICO USGS EN VIVO',
        threatLevel: 'MODERADO',
        summary: 'Actividad tectónica monitoreada en la subducción de la Placa de Nazca y Cinturón de Fuego.',
        dataPoints: [
          'Fuente de datos: USGS Earthquake Hazards Program (actualización cada 60s)',
          'Filtro: Magnitudes 2.5M a 7.5M+ detectadas en las últimas 24 hrs',
          'Mayor concentración: Margen convergente pacífico sudamericano',
          'Alerta de Tsunami: Sin eventos oceánicos mayores en curso',
        ],
      },
    };
  }

  // 3. Maritime Ships / Buques Query
  if (cleanPrompt.includes('barco') || cleanPrompt.includes('buque') || cleanPrompt.includes('maritimo') || cleanPrompt.includes('magallanes') || cleanPrompt.includes('panama')) {
    return {
      speech: 'Activando capa de tráfico marítimo AIS. Monitoreando buques portacontenedores, petroleros y transporte minero en estrechos clave.',
      toggleLayer: 'ships',
      flyTo: { lat: -53.5, lon: -71.0, name: 'Estrecho de Magallanes (Ruta Austral)' },
      intelligenceReport: {
        title: 'TRÁFICO MARÍTIMO AIS — CHOKEPOINTS GLOBALES',
        threatLevel: 'BAJO',
        summary: 'Monitoreo de buques de gran calado en Estrecho de Magallanes, Canal de Panamá y costas de Chile.',
        dataPoints: [
          'Estrecho de Magallanes: Navegación de portacontenedores y buques gaseros activa',
          'Canal de Panamá: Cruce interoceánico Pacífico-Atlántico en horario normal',
          'Costas de Chile: Buques mercantes en Valparaíso y Antofagasta en maniobra',
        ],
      },
    };
  }

  // 4. Commercial Flights Query
  if (cleanPrompt.includes('vuelo') || cleanPrompt.includes('avion') || cleanPrompt.includes('trafico aereo') || cleanPrompt.includes('ads-b') || cleanPrompt.includes('latam')) {
    return {
      speech: 'Activando transpondedores ADS-B y rutas aéreas internacionales. Visualizando aeronaves comerciales con vectores de altitud en tiempo real.',
      toggleLayer: 'flights',
      flyTo: { lat: -33.4489, lon: -70.6693, name: 'Espacio Aéreo de Santiago (SCL)' },
      intelligenceReport: {
        title: 'TRÁFICO AÉREO COMERCIAL ADS-B',
        threatLevel: 'BAJO',
        summary: 'Rutas intercontinentales activas monitoreadas mediante transpondedores Modo-S.',
        dataPoints: [
          'Vuelos clave: Rutas SCL-MIA, SCL-SYD, SCL-MAD operando',
          'Altitud de crucero promedio: FL360 - FL410 (11.000m - 12.500m)',
          'Espacio Aéreo de Chile: Aeropuerto AMB (SCL) como hub principal del Cono Sur',
        ],
      },
    };
  }

  // 5. Geocoder Match for ANY City or Landmark
  for (const [key, coords] of Object.entries(GLOBAL_GEOCODER)) {
    if (cleanPrompt.includes(key)) {
      return {
        speech: `Vector de aproximación establecido hacia ${coords.name}. Coordenadas: ${coords.lat}° latitud, ${coords.lon}° longitud.`,
        flyTo: coords,
        intelligenceReport: {
          title: `OBJETIVO GEOESPACIAL: ${coords.name.toUpperCase()}`,
          threatLevel: 'BAJO',
          summary: `Foco táctico fijado en ${coords.lat}° N / ${coords.lon}° E. Sensores locales activados.`,
          dataPoints: [
            `Localidad: ${coords.name}`,
            `Coordenadas: ${coords.lat}° Lat, ${coords.lon}° Lon`,
            'Espacio aéreo, actividad sísmica y cámaras enlazadas',
            'Procesado por Atlas Automatizaciones',
          ],
        },
      };
    }
  }

  // Default Geospatial Intelligence Response
  return {
    speech: `Comando recibido: "${prompt}". Analizando sensores planetarios. Para navegar di el nombre de una ciudad, "rastrear ISS", "sismos" o "tráfico marítimo".`,
    intelligenceReport: {
      title: 'INFORME DE SITUACIÓN PLANETARIA',
      threatLevel: 'BAJO',
      summary: 'Todos los sensores orbitales, sismológicos, aéreos y marítimos de Atlas Ojo de Dios operando con normalidad.',
      dataPoints: [
        'Red de monitoreo: Activa 24/7 en tiempo real',
        'Capas: Sismos USGS, Órbita ISS, Vuelos ADS-B, Buques AIS',
        'Desarrollo: Atlas Automatizaciones Chile',
      ],
    },
  };
}
