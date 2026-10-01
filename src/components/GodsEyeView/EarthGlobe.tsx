import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Earthquake {
  id: string;
  mag: number;
  place: string;
  time: number;
  coords: [number, number, number]; // [lon, lat, depth]
}

export interface SatellitePos {
  name: string;
  lat: number;
  lon: number;
  alt: number; // km
  velocity: number;
}

export interface FlightItem {
  id: string;
  callsign: string;
  origin: string;
  dest: string;
  lat: number;
  lon: number;
  alt: number; // km
  heading: number;
}

export interface ShipItem {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
}

interface EarthGlobeProps {
  activeLayers: {
    earthquakes: boolean;
    satellites: boolean;
    flights: boolean;
    ships: boolean;
    clouds: boolean;
    atmosphere: boolean;
    nightLights: boolean;
    grid: boolean;
  };
  earthquakes: Earthquake[];
  issPosition: SatellitePos | null;
  targetCoords: { lat: number; lon: number; zoom?: number } | null;
  followingEntity: string | null;
  onSelectEntity: (entity: any) => void;
  onUpdateTelemetry: (telemetry: { lat: number; lon: number; alt: number; heading: number }) => void;
}

// Global Cities of Interest for 3D Markers
const GLOBAL_CITIES = [
  { name: 'Santiago de Chile', lat: -33.4489, lon: -70.6693, country: 'Chile' },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, country: 'Argentina' },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333, country: 'Brasil' },
  { name: 'Lima', lat: -12.0464, lon: -77.0428, country: 'Perú' },
  { name: 'Bogotá', lat: 4.711, lon: -74.0721, country: 'Colombia' },
  { name: 'Ciudad de México', lat: 19.4326, lon: -99.1332, country: 'México' },
  { name: 'Nueva York', lat: 40.7128, lon: -74.006, country: 'EE.UU.' },
  { name: 'Londres', lat: 51.5074, lon: -0.1278, country: 'Reino Unido' },
  { name: 'París', lat: 48.8566, lon: 2.3522, country: 'Francia' },
  { name: 'Madrid', lat: 40.4168, lon: -3.7038, country: 'España' },
  { name: 'Tokio', lat: 35.6762, lon: 139.6503, country: 'Japón' },
  { name: 'Sídney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  { name: 'Dubái', lat: 25.2048, lon: 55.2708, country: 'EAU' },
  { name: 'El Cairo', lat: 30.0444, lon: 31.2357, country: 'Egipto' },
];

// Pre-configured commercial intercontinental flight paths
const SAMPLE_FLIGHTS: FlightItem[] = [
  { id: 'LA500', callsign: 'LATAM 500', origin: 'SCL (Santiago)', dest: 'MIA (Miami)', lat: -10.5, lon: -75.2, alt: 11.2, heading: 345 },
  { id: 'LA800', callsign: 'LATAM 800', origin: 'SCL (Santiago)', dest: 'SYD (Sídney)', lat: -42.1, lon: -120.4, alt: 11.8, heading: 240 },
  { id: 'IB6830', callsign: 'IBERIA 6830', origin: 'SCL (Santiago)', dest: 'MAD (Madrid)', lat: 5.2, lon: -38.6, alt: 12.0, heading: 40 },
  { id: 'AA912', callsign: 'AMERICAN 912', origin: 'EZE (Buenos Aires)', dest: 'MIA (Miami)', lat: -2.3, lon: -62.1, alt: 10.9, heading: 350 },
  { id: 'BA293', callsign: 'BRITISH 293', origin: 'LHR (Londres)', dest: 'IAD (Washington)', lat: 52.8, lon: -35.2, alt: 11.5, heading: 260 },
  { id: 'AF442', callsign: 'AIR FRANCE 442', origin: 'CDG (París)', dest: 'GIG (Río)', lat: 14.8, lon: -28.4, alt: 11.9, heading: 210 },
  { id: 'EK205', callsign: 'EMIRATES 205', origin: 'DXB (Dubái)', dest: 'MXP (Milán)', lat: 34.2, lon: 36.8, alt: 12.2, heading: 310 },
  { id: 'JL006', callsign: 'JAPAN AIR 006', origin: 'HND (Tokio)', dest: 'JFK (Nueva York)', lat: 58.2, lon: -160.4, alt: 10.8, heading: 65 },
  { id: 'QF1', callsign: 'QANTAS 1', origin: 'SYD (Sídney)', dest: 'LHR (Londres)', lat: 18.5, lon: 82.3, alt: 11.4, heading: 315 },
  { id: 'SQ25', callsign: 'SINGAPORE 25', origin: 'SIN (Singapur)', dest: 'FRA (Frankfurt)', lat: 26.4, lon: 68.2, alt: 11.6, heading: 310 },
];

// Key maritime shipping points
const SAMPLE_SHIPS: ShipItem[] = [
  { id: 'SH-01', name: 'MSC ISABELLA', type: 'Portacontenedores', lat: -53.2, lon: -70.9 }, // Estrecho de Magallanes
  { id: 'SH-02', name: 'EVER GIVEN', type: 'Portacontenedores', lat: 9.1, lon: -79.8 }, // Canal de Panamá
  { id: 'SH-03', name: 'MAERSK MC-KINNEY', type: 'Carga General', lat: 36.1, lon: -5.3 }, // Estrecho de Gibraltar
  { id: 'SH-04', name: 'COSCO SHIPPING LEO', type: 'Superpetrolero', lat: 1.3, lon: 103.8 }, // Estrecho de Malaca
  { id: 'SH-05', name: 'HUMBOLDT STAR', type: 'Carga Minera', lat: -23.6, lon: -70.5 }, // Puerto de Antofagasta, Chile
  { id: 'SH-06', name: 'VALPARAISO EXPRESS', type: 'Frutero Frigorífico', lat: -33.0, lon: -71.7 }, // Valparaíso, Chile
];

const EARTH_RADIUS = 8;

export default function EarthGlobe({
  activeLayers,
  earthquakes,
  issPosition,
  targetCoords,
  followingEntity,
  onSelectEntity,
  onUpdateTelemetry,
}: EarthGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);

  // Layer Groups
  const earthquakesGroupRef = useRef<THREE.Group | null>(null);
  const satellitesGroupRef = useRef<THREE.Group | null>(null);
  const flightsGroupRef = useRef<THREE.Group | null>(null);
  const shipsGroupRef = useRef<THREE.Group | null>(null);
  const citiesGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);

  // Global target rotation reference to decouple state changes from render loop
  const navRef = useRef({
    targetRotX: (33.4 * Math.PI) / 180,
    targetRotY: -( -70.6 + 90) * (Math.PI / 180),
    targetDistance: 23,
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
  });

  // Helper to convert Lat/Lon to 3D Cartesian coordinates on a sphere
  const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Convert target lat/lon to EarthGroup rotation to center on screen
  const getRotationForLatLon = (lat: number, lon: number) => {
    const rotY = -((lon + 90) * Math.PI) / 180;
    const rotX = (lat * Math.PI) / 180;
    return { rotX, rotY };
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x01040a);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    camera.position.set(0, 0, navRef.current.targetDistance);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting - Sun and Ambient
    const ambientLight = new THREE.AmbientLight(0x223344, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    sunLight.position.set(40, 20, 35);
    scene.add(sunLight);

    // 5. Earth Master Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // 6. Texture Loader for Real NASA Imagery
    const textureLoader = new THREE.TextureLoader();

    const earthDayMap = textureLoader.load('/textures/earth_day.jpg');
    const earthNormalMap = textureLoader.load('/textures/earth_normal.jpg');
    const earthSpecularMap = textureLoader.load('/textures/earth_specular.jpg');

    earthDayMap.colorSpace = THREE.SRGBColorSpace;
    earthDayMap.minFilter = THREE.LinearMipmapLinearFilter;
    earthDayMap.magFilter = THREE.LinearFilter;

    // Earth Sphere Surface
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthDayMap,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: earthSpecularMap,
      roughness: 0.65,
      metalness: 0.12,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 7. VOLUMETRIC ATMOSPHERIC CLOUD SHADER (PROCEDURAL 3D SIMPLEX FBM, ULTRA-SMOOTH)
    const cloudsVertexShader = `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDirection = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const cloudsFragmentShader = `
      uniform float uTime;
      uniform vec3 uSunDirection;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewDirection;

      vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }

      float fbm(vec3 p) {
        float value = 0.0;
        float amp = 0.52;
        float freq = 1.0;
        for (int i = 0; i < 4; i++) {
          value += amp * snoise(p * freq);
          freq *= 2.18;
          amp *= 0.48;
        }
        return value;
      }

      void main() {
        vec3 norm = normalize(vNormal);
        vec3 viewDir = normalize(vViewDirection);
        vec3 sunDir = normalize(uSunDirection);

        vec3 sphereCoord = normalize(vWorldPosition);

        vec3 drift1 = vec3(uTime * 0.007, 0.0, uTime * 0.0035);
        vec3 drift2 = vec3(-uTime * 0.004, uTime * 0.0018, -uTime * 0.0025);

        float n1 = fbm(sphereCoord * 3.4 + drift1);
        float n2 = fbm(sphereCoord * 6.8 + drift2);
        float cloudDensity = n1 * 0.72 + n2 * 0.35;

        float alpha = smoothstep(0.05, 0.52, cloudDensity);

        float sunSample = fbm((sphereCoord + sunDir * 0.05) * 3.4 + drift1);
        float selfShadow = clamp(1.0 - (sunSample - n1) * 1.6, 0.45, 1.0);

        float NdotL = dot(norm, sunDir);
        float dayFactor = smoothstep(-0.25, 0.38, NdotL);

        vec3 sunsetGold = vec3(1.0, 0.65, 0.45);
        vec3 dayWhite = vec3(0.99, 1.0, 1.0);
        vec3 nightAmbient = vec3(0.09, 0.14, 0.24);

        vec3 litColor = mix(sunsetGold, dayWhite, smoothstep(-0.05, 0.32, NdotL));
        vec3 finalColor = mix(nightAmbient, litColor * selfShadow, dayFactor);

        float fresnel = 1.0 - max(dot(norm, viewDir), 0.0);
        float limbAlpha = pow(fresnel, 2.4) * 0.35;
        float totalAlpha = clamp(alpha * 0.75 + limbAlpha * (alpha + 0.1), 0.0, 0.85);

        if (totalAlpha < 0.015) discard;

        gl_FragColor = vec4(finalColor, totalAlpha);
      }
    `;

    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.018, 128, 128);
    const cloudsMat = new THREE.ShaderMaterial({
      vertexShader: cloudsVertexShader,
      fragmentShader: cloudsFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSunDirection: { value: new THREE.Vector3(40, 20, 35).normalize() },
      },
      transparent: true,
      depthWrite: false,
    });
    cloudsMaterialRef.current = cloudsMat;

    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 8. Atmospheric Blue Rayleigh Scattering Halo
    const atmosphereGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 96, 96);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.64, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // 9. Outer Space Starfield
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 3500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1200;
      starPositions[i + 1] = (Math.random() - 0.5) * 1200;
      starPositions[i + 2] = (Math.random() - 0.5) * 1200;

      starColors[i] = 0.8 + Math.random() * 0.2;
      starColors[i + 1] = 0.85 + Math.random() * 0.15;
      starColors[i + 2] = 0.95 + Math.random() * 0.05;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Initialize Layer Subgroups inside earthGroup
    const earthquakesGroup = new THREE.Group();
    earthGroup.add(earthquakesGroup);
    earthquakesGroupRef.current = earthquakesGroup;

    const satellitesGroup = new THREE.Group();
    earthGroup.add(satellitesGroup);
    satellitesGroupRef.current = satellitesGroup;

    const flightsGroup = new THREE.Group();
    earthGroup.add(flightsGroup);
    flightsGroupRef.current = flightsGroup;

    const shipsGroup = new THREE.Group();
    earthGroup.add(shipsGroup);
    shipsGroupRef.current = shipsGroup;

    const citiesGroup = new THREE.Group();
    earthGroup.add(citiesGroup);
    citiesGroupRef.current = citiesGroup;

    const gridGroup = new THREE.Group();
    earthGroup.add(gridGroup);
    gridGroupRef.current = gridGroup;

    // Render Global Cities Markers
    GLOBAL_CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, EARTH_RADIUS + 0.04);

      const pinGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const isChile = city.country === 'Chile';
      const pinMat = new THREE.MeshBasicMaterial({
        color: isChile ? 0x00f0ff : 0x38bdf8,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { type: 'city', data: city };

      const ringGeo = new THREE.RingGeometry(0.12, 0.18, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isChile ? 0x00f0ff : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(0, 0, 0);

      citiesGroup.add(pinMesh);
      citiesGroup.add(ringMesh);
    });

    // Render Tactical OSINT Coordinate Grid Lines
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x00a3ff,
      transparent: true,
      opacity: 0.15,
    });

    for (let lat = -80; lat <= 80; lat += 20) {
      const radiusAtLat = EARTH_RADIUS * Math.cos((lat * Math.PI) / 180);
      const y = EARTH_RADIUS * Math.sin((lat * Math.PI) / 180);
      const circleGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radiusAtLat, y, Math.sin(theta) * radiusAtLat));
      }
      circleGeo.setFromPoints(points);
      const line = new THREE.Line(circleGeo, gridMat);
      gridGroup.add(line);
    }

    // Set initial position facing Chile
    earthGroup.rotation.y = navRef.current.targetRotY;
    earthGroup.rotation.x = navRef.current.targetRotX;

    // Raycaster for Interactive 3D Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      navRef.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      navRef.current.prevMouse = { x: clientX, y: clientY };
      pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (navRef.current.isDragging) {
        const deltaX = clientX - navRef.current.prevMouse.x;
        const deltaY = clientY - navRef.current.prevMouse.y;

        navRef.current.targetRotY += deltaX * 0.005;
        navRef.current.targetRotX += deltaY * 0.005;
        navRef.current.targetRotX = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, navRef.current.targetRotX));

        navRef.current.prevMouse = { x: clientX, y: clientY };
      } else {
        // Hover raycast to toggle cursor: pointer when hovering over satellites/objects
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const checkList = [
          satellitesGroup,
          earthquakesGroup,
          flightsGroup,
          shipsGroup,
          citiesGroup,
        ];
        const intersects = raycaster.intersectObjects(checkList, true);
        if (intersects.length > 0) {
          container.style.cursor = 'pointer';
        } else {
          container.style.cursor = 'grab';
        }
      }
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      navRef.current.isDragging = false;
      let clientX = 0;
      let clientY = 0;
      if ('changedTouches' in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);

      // Clean Click: distance < 10px
      if (dist < 10) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const checkList = [
          satellitesGroup,
          earthquakesGroup,
          flightsGroup,
          shipsGroup,
          citiesGroup,
        ];
        const intersects = raycaster.intersectObjects(checkList, true);

        if (intersects.length > 0) {
          for (const hit of intersects) {
            let cur: THREE.Object3D | null = hit.object;
            while (cur && !cur.userData?.type && cur.parent && cur.parent !== scene) {
              cur = cur.parent;
            }
            if (cur && cur.userData?.type) {
              onSelectEntity(cur.userData);
              if (cur.userData.data?.lat !== undefined && cur.userData.data?.lon !== undefined) {
                const { rotX, rotY } = getRotationForLatLon(cur.userData.data.lat, cur.userData.data.lon);
                navRef.current.targetRotX = rotX;
                navRef.current.targetRotY = rotY;
                navRef.current.targetDistance = Math.min(navRef.current.targetDistance, 14.5);
              }
              break;
            }
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      navRef.current.targetDistance += e.deltaY * 0.015;
      navRef.current.targetDistance = Math.max(9.5, Math.min(50, navRef.current.targetDistance));
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();

      // Only auto spin if NOT dragging and NOT actively following a target
      // @ts-ignore
      const isFollowing = window.__GEV_IS_FOLLOWING;
      if (!navRef.current.isDragging && !isFollowing) {
        navRef.current.targetRotY += 0.0003;
      }

      // Smooth camera dampening towards navRef targets
      earthGroup.rotation.y += (navRef.current.targetRotY - earthGroup.rotation.y) * 0.08;
      earthGroup.rotation.x += (navRef.current.targetRotX - earthGroup.rotation.x) * 0.08;

      camera.position.z += (navRef.current.targetDistance - camera.position.z) * 0.08;

      // Update volumetric cloud atmospheric evolution and drift
      if (cloudsMaterialRef.current) {
        cloudsMaterialRef.current.uniforms.uTime.value += delta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += delta * 0.008;
      }

      // Calculate center coordinates telemetry
      const lon = ((-earthGroup.rotation.y * 180) / Math.PI - 90) % 360;
      const lat = (earthGroup.rotation.x * 180) / Math.PI;
      const altKm = Math.round(camera.position.z * 360);

      onUpdateTelemetry({
        lat: Math.round(lat * 10) / 10,
        lon: Math.round(lon * 10) / 10,
        alt: altKm,
        heading: Math.round(((earthGroup.rotation.y * 180) / Math.PI) % 360),
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Dynamic Earthquakes Layer
  useEffect(() => {
    if (!earthquakesGroupRef.current) return;
    const group = earthquakesGroupRef.current;
    group.clear();

    if (!activeLayers.earthquakes || !earthquakes.length) return;

    earthquakes.forEach((eq) => {
      const [lon, lat] = eq.coords;
      const pos = latLonToVector3(lat, lon, EARTH_RADIUS + 0.05);

      let color = 0xf59e0b;
      let radius = 0.15;

      if (eq.mag >= 6.0) {
        color = 0xef4444;
        radius = 0.32;
      } else if (eq.mag >= 4.8) {
        color = 0xf97316;
        radius = 0.22;
      }

      const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.copy(pos);

      const eqData = {
        id: eq.id,
        name: eq.place,
        place: eq.place,
        mag: eq.mag,
        depth: Math.round(eq.coords[2]),
        lat: eq.coords[1],
        lon: eq.coords[0],
        time: eq.time,
      };
      mesh.userData = { type: 'earthquake', data: eqData };

      // Invisible larger click target
      const hitBox = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 2.2, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.copy(pos);
      hitBox.userData = { type: 'earthquake', data: eqData };

      const ringGeo = new THREE.RingGeometry(radius * 1.2, radius * 2.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);

      group.add(mesh);
      group.add(hitBox);
      group.add(ring);
    });
  }, [earthquakes, activeLayers.earthquakes]);

  // Update ISS & Global Satellites Layer
  useEffect(() => {
    if (!satellitesGroupRef.current) return;
    const group = satellitesGroupRef.current;
    group.clear();

    if (!activeLayers.satellites || !issPosition) return;

    const issPos = latLonToVector3(issPosition.lat, issPosition.lon, EARTH_RADIUS + 0.85);

    const issData = {
      id: 'ISS-25544',
      name: 'Estación Espacial Internacional (ISS)',
      operator: 'NASA / ESA / JAXA / Roscosmos',
      type: 'Estación Orbital Tripulada',
      lat: issPosition.lat,
      lon: issPosition.lon,
      alt: issPosition.alt,
      velocity: issPosition.velocity,
      inclination: '51.6°',
      period: '92.68 min',
      status: 'SEÑAL TRANSMITIENDO EN VIVO',
    };

    // ISS 3D Model Marker
    const coreGeo = new THREE.BoxGeometry(0.24, 0.24, 0.45);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(issPos);
    core.userData = { type: 'satellite', data: issData };

    // Blue solar array panels
    const panelGeo = new THREE.BoxGeometry(0.9, 0.03, 0.22);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.copy(issPos);
    panel.userData = { type: 'satellite', data: issData };

    // Generous Click HitBox for ISS
    const issHitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    issHitBox.position.copy(issPos);
    issHitBox.userData = { type: 'satellite', data: issData };

    // Orbit Ring Track (Inclination 51.6 degrees matching actual ISS orbit)
    const orbitRadius = EARTH_RADIUS + 0.85;
    const orbitGeo = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 128);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 3.4;

    group.add(core);
    group.add(panel);
    group.add(issHitBox);
    group.add(orbitRing);

    // Additional Global Satellites (Hubble, Starlink constellation, GPS, NOAA)
    const OTHER_SATELLITES = [
      { name: 'Telescopio Espacial Hubble', lat: -28.5, lon: 35.2, alt: EARTH_RADIUS + 0.95, color: 0x38bdf8, operator: 'NASA / ESA', type: 'Observatorio Óptico Espacial' },
      { name: 'Starlink-5281', lat: 45.2, lon: -120.5, alt: EARTH_RADIUS + 0.75, color: 0x22d3ee, operator: 'SpaceX', type: 'Constelación Internet LEO' },
      { name: 'Starlink-5304', lat: -15.8, lon: -40.2, alt: EARTH_RADIUS + 0.75, color: 0x22d3ee, operator: 'SpaceX', type: 'Constelación Internet LEO' },
      { name: 'Starlink-5412', lat: 35.1, lon: 140.2, alt: EARTH_RADIUS + 0.75, color: 0x22d3ee, operator: 'SpaceX', type: 'Constelación Internet LEO' },
      { name: 'GPS Navstar-78', lat: 55.0, lon: 15.0, alt: EARTH_RADIUS + 1.8, color: 0xfacc15, operator: 'US Space Force', type: 'Navegación y Tiempo MEO' },
      { name: 'NOAA-20 Satélite Clima', lat: 70.2, lon: -60.0, alt: EARTH_RADIUS + 1.1, color: 0x4ade80, operator: 'NOAA', type: 'Meteorología Polar' },
    ];

    OTHER_SATELLITES.forEach((sat) => {
      const satPos = latLonToVector3(sat.lat, sat.lon, sat.alt);

      const satMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({ color: sat.color })
      );
      satMesh.position.copy(satPos);

      const satData = {
        id: sat.name.replace(/\s+/g, '-').toUpperCase(),
        name: sat.name,
        operator: sat.operator,
        type: sat.type,
        lat: sat.lat,
        lon: sat.lon,
        alt: Math.round((sat.alt - EARTH_RADIUS) * 450),
        velocity: 27150,
        status: 'TRANSMITIENDO EN VIVO',
      };
      satMesh.userData = { type: 'satellite', data: satData };

      // Generous HitBox so satellites are easily clickable
      const hitBox = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.copy(satPos);
      hitBox.userData = { type: 'satellite', data: satData };

      const satRing = new THREE.Mesh(
        new THREE.RingGeometry(sat.alt - 0.015, sat.alt + 0.015, 64),
        new THREE.MeshBasicMaterial({ color: sat.color, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
      );
      satRing.rotation.x = Math.PI / 4 + (sat.alt % 1);

      group.add(satMesh);
      group.add(hitBox);
      group.add(satRing);
    });
  }, [issPosition, activeLayers.satellites]);

  // Update Commercial Flights Layer
  useEffect(() => {
    if (!flightsGroupRef.current) return;
    const group = flightsGroupRef.current;
    group.clear();

    if (!activeLayers.flights) return;

    SAMPLE_FLIGHTS.forEach((fl) => {
      const pos = latLonToVector3(fl.lat, fl.lon, EARTH_RADIUS + 0.28);

      const coneGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(pos);
      cone.lookAt(0, 0, 0);

      const flightData = {
        id: fl.id,
        callsign: fl.callsign,
        name: `${fl.callsign} (${fl.origin} → ${fl.dest})`,
        origin: fl.origin,
        dest: fl.dest,
        alt: `${fl.alt} km (FL${Math.round(fl.alt * 32.8)})`,
        lat: fl.lat,
        lon: fl.lon,
        heading: `${fl.heading}°`,
        status: 'EN RUTA',
      };
      cone.userData = { type: 'flight', data: flightData };

      const hitBox = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.copy(pos);
      hitBox.userData = { type: 'flight', data: flightData };

      const groundPos = latLonToVector3(fl.lat, fl.lon, EARTH_RADIUS);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([groundPos, pos]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.45 });
      const line = new THREE.Line(lineGeo, lineMat);

      group.add(cone);
      group.add(hitBox);
      group.add(line);
    });
  }, [activeLayers.flights]);

  // Update Maritime Ships Layer
  useEffect(() => {
    if (!shipsGroupRef.current) return;
    const group = shipsGroupRef.current;
    group.clear();

    if (!activeLayers.ships) return;

    SAMPLE_SHIPS.forEach((sh) => {
      const pos = latLonToVector3(sh.lat, sh.lon, EARTH_RADIUS + 0.03);

      const shipGeo = new THREE.BoxGeometry(0.14, 0.08, 0.22);
      const shipMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
      const shipMesh = new THREE.Mesh(shipGeo, shipMat);
      shipMesh.position.copy(pos);
      shipMesh.lookAt(0, 0, 0);

      const shipData = {
        id: sh.id,
        name: sh.name,
        type: sh.type,
        lat: sh.lat,
        lon: sh.lon,
        status: 'NAVEGANDO',
      };
      shipMesh.userData = { type: 'ship', data: shipData };

      const hitBox = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.copy(pos);
      hitBox.userData = { type: 'ship', data: shipData };

      group.add(shipMesh);
      group.add(hitBox);
    });
  }, [activeLayers.ships]);

  // Toggle Visibility of Groups
  useEffect(() => {
    if (cloudsMeshRef.current) cloudsMeshRef.current.visible = activeLayers.clouds;
    if (atmosphereMeshRef.current) atmosphereMeshRef.current.visible = activeLayers.atmosphere;
    if (gridGroupRef.current) gridGroupRef.current.visible = activeLayers.grid;
  }, [activeLayers]);

  // Sync following state to window for renderLoop
  useEffect(() => {
    // @ts-ignore
    window.__GEV_IS_FOLLOWING = !!followingEntity;
  }, [followingEntity]);

  // Smooth Fly-To Camera Transition when targetCoords updates
  useEffect(() => {
    if (!targetCoords) return;
    const { rotX, rotY } = getRotationForLatLon(targetCoords.lat, targetCoords.lon);

    navRef.current.targetRotY = rotY;
    navRef.current.targetRotX = rotX;

    if (targetCoords.zoom) {
      navRef.current.targetDistance = targetCoords.zoom;
    } else {
      navRef.current.targetDistance = 14.5;
    }
  }, [targetCoords]);

  // Smooth ISS Tracking when followingEntity is 'iss'
  useEffect(() => {
    if (followingEntity === 'iss' && issPosition) {
      const { rotX, rotY } = getRotationForLatLon(issPosition.lat, issPosition.lon);
      navRef.current.targetRotY = rotY;
      navRef.current.targetRotX = rotX;
      navRef.current.targetDistance = 16.5;
    }
  }, [followingEntity, issPosition]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none relative overflow-hidden bg-black"
    />
  );
}
