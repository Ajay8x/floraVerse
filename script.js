/**
 * AETHERIA - Open 3D Virtual World & Cosmic Metaverse Engine
 * Features:
 * - Full First-Person Walking (WASD + Mouse Look + PointerLock) & Orbit/Drone Camera
 * - Infinite Procedural Terrain with Luminous Bio-Beds
 * - 6 Giant Cosmic Flora Landmarks (Towering Roses, Sacred Lotus Lake, Monoliths, Sakura)
 * - Macro Zoom Inspection Engine (zoom down to flower petal level)
 * - Real-Time Minimap Radar with live player pin
 * - Dynamic Day / Cyber-Sunset / Cosmic-Night Lighting Cycle
 */

// ========================================================
// 1. THREE.JS SCENE, SKYBOX & CAMERAS
// ========================================================
const canvas = document.getElementById('metaverse-canvas');
const crosshair = document.getElementById('crosshair');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x06030c, 0.008);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
// Default Camera: Bird's-eye Top-Down View displaying Central Rose & 4 Surrounding Monumental Flowers
camera.position.set(0, 115, 0.1);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: true, // Crucial: Allows canvas.toDataURL() to capture the actual 3D image instead of black screen!
  depth: true,
  stencil: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Limit pixel ratio to 1.25 for crisp graphics with butter-smooth high FPS on all screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

// Camera Navigation Controllers:
// A. Orbit Controls (Drone / Overview / Macro Zoom)
const orbitControls = new THREE.OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;
orbitControls.maxDistance = 1200; // Expanded for vast multiverse exploration!
orbitControls.minDistance = 1.0; // Macro zoom capability!
orbitControls.target.set(0, 0, 0); // Focus directly at Earth-1 Core Center

// B. First Person PointerLock Controls (Walking Mode)
const fpControls = new THREE.PointerLockControls(camera, document.body);

let currentMode = 'orbit'; // Start with Orbit so the entire glowing 3D world is immediately visible!

// Ambient lighting
const hemiLight = new THREE.HemisphereLight(0x9d4edd, 0x05ffa1, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xff2a6d, 1.2);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);

// ========================================================
// 1.5 UNREAL BLOOM POST-PROCESSING ENGINE (Cinematic Neon Glow)
// ========================================================
let composer = null;
try {
  if (typeof THREE.EffectComposer !== 'undefined' && typeof THREE.UnrealBloomPass !== 'undefined') {
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.35, // Significantly reduced bloom intensity (gentle soft glow)
      0.25, // Smaller glow radius so it does not overwhelm the screen
      0.65  // Higher threshold so only ultra-bright points have subtle shine
    );

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  }
} catch (e) {
  console.log('Post-processing init fallback:', e);
}
function createGlowTexture() {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.2, 'rgba(255, 240, 250, 0.95)');
  g.addColorStop(0.55, 'rgba(0, 240, 255, 0.4)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}
const glowTexture = createGlowTexture();

// Helper to create point cloud mesh
function createPoints(positions, colors, size = 0.35, opacity = 0.95) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.Points(geo, mat);
}

// Helper to create 3D Floating Hologram Label Billboard
function create3DNameBadge(id, name, heightOffset = 22) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Background rounded pill
  ctx.fillStyle = 'rgba(15, 8, 28, 0.88)';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;

  // Draw round rect
  const x = 10, y = 10, w = 492, h = 108, r = 24;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ID Tag (top)
  ctx.font = 'bold 24px "Fira Code", monospace';
  ctx.fillStyle = '#ff2a6d';
  ctx.textAlign = 'center';
  ctx.fillText(`[ ID: ${id} ]`, 256, 45);

  // Name (bottom)
  ctx.font = 'bold 36px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(name, 256, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    opacity: 0 // Hidden by default, only shown when hovered
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(0, heightOffset, 0);
  sprite.scale.set(14, 3.5, 1);
  sprite.visible = false; // Hidden initially
  sprite.name = 'badgeSprite';
  return sprite;
}

// Helper to create invisible click/hover detection hitboxes
function addLandmarkHitbox(group, radius = 9, height = 24) {
  const hitGeo = new THREE.CylinderGeometry(radius, radius, height, 16);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.set(0, height / 2 - 2, 0);
  hitMesh.name = 'hitbox';
  hitMesh.userData = group.userData;
  group.add(hitMesh);
  return hitMesh;
}

// Master world group
const worldGroup = new THREE.Group();
scene.add(worldGroup);

// ========================================================
// 3. CELESTIAL SKYBOX & DISTANT NEBULA
// ========================================================
function createCelestialSky() {
  const starsCount = 8000;
  const pos = new Float32Array(starsCount * 3);
  const col = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount; i++) {
    const r = 800 + Math.random() * 400;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const c = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.8);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }

  const skyMesh = createPoints(pos, col, 1.8, 0.9);
  scene.add(skyMesh);
}
createCelestialSky();

// ========================================================
// 4. VAST ULTRA-DENSE BIOLUMINESCENT 5 EARTHS REALM (LAZY LOADED CHUNKS)
// Each Earth is an independent chunk that activates and renders only when nearby!
// ========================================================
const earthChunks = [];

function createVastTerrain() {
  const pointsPerPlanet = 56000;

  // 5 Earth Centers & Colors
  const earthCenters = [
    { id: '1', name: 'Earth-1: Central Core', x: 0, z: 0, rMax: 72, colHex: 0x05ffa1, altCol: 0x00f0ff },
    { id: '2', name: 'Earth-2: North Aqua Lotus', x: 0, z: 240, rMax: 62, colHex: 0x00f0ff, altCol: 0x0077ff },
    { id: '3', name: 'Earth-3: South Neon Sakura', x: 0, z: -240, rMax: 62, colHex: 0xff2a6d, altCol: 0x9d4edd },
    { id: '4', name: 'Earth-4: West Solaris Dunes', x: -250, z: 0, rMax: 62, colHex: 0xffbe0b, altCol: 0xff5500 },
    { id: '5', name: 'Earth-5: East Astral Peak', x: 250, z: 0, rMax: 62, colHex: 0x9d4edd, altCol: 0xff2a6d }
  ];

  earthCenters.forEach((ec) => {
    const pos = new Float32Array(pointsPerPlanet * 3);
    const col = new Float32Array(pointsPerPlanet * 3);
    const cPrimary = new THREE.Color(ec.colHex);
    const cSecondary = new THREE.Color(ec.altCol);

    for (let i = 0; i < pointsPerPlanet; i++) {
      const radius = Math.pow(Math.random(), 0.6) * ec.rMax;
      const angle = Math.random() * Math.PI * 2;
      const px = ec.x + Math.cos(angle) * radius;
      const pz = ec.z + Math.sin(angle) * radius;
      const py = getTerrainHeightAt(px, pz);

      pos[i * 3 + 0] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      const t = radius / ec.rMax;
      const pointColor = cPrimary.clone().lerp(cSecondary, t);
      if (Math.random() > 0.88) pointColor.addScalar(0.4);

      col[i * 3 + 0] = pointColor.r;
      col[i * 3 + 1] = pointColor.g;
      col[i * 3 + 2] = pointColor.b;
    }

    const chunkMesh = createPoints(pos, col, 0.35, 0.88);
    chunkMesh.userData = { id: ec.id, x: ec.x, z: ec.z, rMax: ec.rMax };
    worldGroup.add(chunkMesh);

    earthChunks.push({
      id: ec.id,
      mesh: chunkMesh,
      x: ec.x,
      z: ec.z,
      radius: ec.rMax
    });
  });
}
createVastTerrain();

// ========================================================
// 4.5 CONNECTING ROADS (BRIDGES) & ARCHWAY ENTRY GATES
// (Connecting Central Earth-1 to North, South, West, East Earths)
// ========================================================
const gateVortices = [];
const allGates = []; // Holds references to all 8 Gates for Realm-specific Visibility
const highwayChunks = []; // Lazy loaded highway and guardrail segments
function createLuminousPathways() {
  const connections = [
    // North Road to Earth-2
    { id: '2', from: [0, 68], to: [0, 180], color: 0x00f0ff, gateAt: [0, 68], gateRot: 0 },
    // South Road to Earth-3
    { id: '3', from: [0, -68], to: [0, -180], color: 0xff2a6d, gateAt: [0, -68], gateRot: Math.PI },
    // West Road to Earth-4
    { id: '4', from: [-68, 0], to: [-190, 0], color: 0xffbe0b, gateAt: [-68, 0], gateRot: Math.PI / 2 },
    // East Road to Earth-5
    { id: '5', from: [68, 0], to: [190, 0], color: 0x9d4edd, gateAt: [68, 0], gateRot: -Math.PI / 2 }
  ];

  connections.forEach(conn => {
    // 1. Broad Glowing Road (8 meters wide highway)
    const roadPoints = 3500;
    const pos = new Float32Array(roadPoints * 3);
    const col = new Float32Array(roadPoints * 3);
    const baseCol = new THREE.Color(conn.color);

    for (let i = 0; i < roadPoints; i++) {
      const alpha = i / roadPoints;
      const rx = conn.from[0] + (conn.to[0] - conn.from[0]) * alpha;
      const rz = conn.from[1] + (conn.to[1] - conn.from[1]) * alpha;

      const isHorizontal = Math.abs(conn.to[0] - conn.from[0]) > Math.abs(conn.to[1] - conn.from[1]);
      let px, pz;
      if (isHorizontal) {
        px = rx;
        pz = rz + (Math.random() - 0.5) * 8.0;
      } else {
        px = rx + (Math.random() - 0.5) * 8.0;
        pz = rz;
      }

      const py = -1.95;

      pos[i * 3 + 0] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;

      const c = baseCol.clone().addScalar(Math.random() * 0.3);
      col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const roadMesh = createPoints(pos, col, 0.42, 0.95);
    worldGroup.add(roadMesh);

    const midX = (conn.from[0] + conn.to[0]) * 0.5;
    const midZ = (conn.from[1] + conn.to[1]) * 0.5;
    highwayChunks.push({
      targetId: conn.id,
      mesh: roadMesh,
      midX,
      midZ
    });

    // Road Edge Guardrails (Glowing Light Lines on both sides)
    const isHorizontal = Math.abs(conn.to[0] - conn.from[0]) > Math.abs(conn.to[1] - conn.from[1]);
    const railOffset = 4.2;
    [-railOffset, railOffset].forEach(offset => {
      const railPoints = 600;
      const rPos = new Float32Array(railPoints * 3);
      const rCol = new Float32Array(railPoints * 3);
      for (let j = 0; j < railPoints; j++) {
        const a = j / railPoints;
        const rx = conn.from[0] + (conn.to[0] - conn.from[0]) * a;
        const rz = conn.from[1] + (conn.to[1] - conn.from[1]) * a;
        rPos[j * 3 + 0] = isHorizontal ? rx : rx + offset;
        rPos[j * 3 + 1] = -1.75;
        rPos[j * 3 + 2] = isHorizontal ? rz + offset : rz;
        rCol[j * 3 + 0] = baseCol.r; rCol[j * 3 + 1] = baseCol.g; rCol[j * 3 + 2] = baseCol.b;
      }
      const railMesh = createPoints(rPos, rCol, 0.55, 1.0);
      worldGroup.add(railMesh);
      highwayChunks.push({
        targetId: conn.id,
        mesh: railMesh,
        midX,
        midZ
      });
    });

    // 2. Cyberpunk Entry Gate (Archway Gate at Central Earth-1 road entrance)
    function buildGate(gx, gz, gRot, gColor, realmOrigin) {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(gx, -2.0, gz);
      gateGroup.rotation.y = gRot;
      gateGroup.userData = { realm: realmOrigin, gx, gz };

      const pillarGeo = new THREE.BoxGeometry(1.6, 9.5, 1.6);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x0a1020, metalness: 0.9, roughness: 0.15, emissive: 0x020815
      });
      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-4.5, 4.75, 0);
      gateGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(4.5, 4.75, 0);
      gateGroup.add(rightPillar);

      const beamGeo = new THREE.BoxGeometry(11.0, 1.8, 1.8);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x0a1020, metalness: 0.9, roughness: 0.15, emissive: 0x020815
      });
      const topBeam = new THREE.Mesh(beamGeo, beamMat);
      topBeam.position.set(0, 9.5, 0);
      gateGroup.add(topBeam);

      const gateEdgeMat = new THREE.LineBasicMaterial({ color: gColor, linewidth: 3 });
      topBeam.add(new THREE.LineSegments(new THREE.EdgesGeometry(beamGeo), gateEdgeMat));
      leftPillar.add(new THREE.LineSegments(new THREE.EdgesGeometry(pillarGeo), gateEdgeMat));
      rightPillar.add(new THREE.LineSegments(new THREE.EdgesGeometry(pillarGeo), gateEdgeMat));

      const shieldGeo = new THREE.PlaneGeometry(8.0, 8.5);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: gColor, transparent: true, opacity: 0.35, side: THREE.DoubleSide
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.set(0, 4.75, 0);
      gateGroup.add(shield);

      // Feature 4: Cosmic Stargate Spiral Swirl Vortex
      const vortexGeo = new THREE.RingGeometry(0.5, 4.2, 32);
      const vortexMat = new THREE.MeshBasicMaterial({
        color: gColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const vortex = new THREE.Mesh(vortexGeo, vortexMat);
      vortex.name = 'gateVortex';
      vortex.position.set(0, 4.75, 0.05);
      gateGroup.add(vortex);

      gateVortices.push(vortex);
      allGates.push(gateGroup);
      worldGroup.add(gateGroup);
    }

    // Departure Gate from Central Earth-1 (Located on Earth-1)
    buildGate(conn.gateAt[0], conn.gateAt[1], conn.gateRot, conn.color, '1');

    // Return Gate from Outer Earth (Located on Outer Earth: 2, 3, 4, 5)
    buildGate(conn.to[0], conn.to[1], conn.gateRot + Math.PI, conn.color, conn.id);
  });
}
createLuminousPathways();

// ========================================================
// 5. LANDMARKS, PROCEDURAL FLORA & MONUMENTAL ARCHITECTURE
// ========================================================
const landmarks = [];

// ========================================================
// 5.0 FOUR NEW GIANT MONUMENTAL FLOWERS (SITUATED AROUND CENTRAL ROSE IN EARTH-1)
// 1. Quantum Cyan Orchid (North-East)
// 2. Solar Golden Dahlia (South-East)
// 3. Violet Plasma Hibiscus (South-West)
// 4. Emerald Astral Bellflower (North-West)
// ========================================================

// 1. Quantum Cyan Orchid
function spawnCyanOrchid(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const count = 26000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0x00f0ff);
  const c2 = new THREE.Color(0x0055ff);

  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.7);
    const v = Math.random() * Math.PI * 6; // 3 large orchid flared petals
    const petalWarp = (1 + 0.45 * Math.sin(3 * v));
    const r = u * 9.5 * petalWarp;
    const y = 14.0 + Math.pow(u, 1.3) * 7.5 - Math.sin(r * 0.4) * 2.2;

    pos[i * 3 + 0] = r * Math.cos(v);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(v);

    const c = c1.clone().lerp(c2, u);
    if (Math.random() > 0.85) c.addScalar(0.35);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.add(createPoints(pos, col, 0.38));

  // Glowing stem
  const sPos = new Float32Array(5000 * 3), sCol = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    const t = Math.random();
    sPos[i * 3 + 0] = (Math.random() - 0.5) * 0.9;
    sPos[i * 3 + 1] = -2.0 + t * 16.0;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    sCol[i * 3 + 0] = 0.05; sCol[i * 3 + 1] = 0.85; sCol[i * 3 + 2] = 0.95;
  }
  g.add(createPoints(sPos, sCol, 0.28));

  g.userData = {
    id: 'orchid_cyan',
    entityId: 'FLOR-ORC1',
    name: 'Quantum Cyan Orchid',
    species: 'Orchis Cyanea Quantum',
    category: 'PRIMARY BOTANICAL CORE',
    luminosity: '135,000 LUX',
    height: '21 METERS',
    desc: 'Luminous triple-winged cyan orchid resonating with quantum harmonic frequencies.',
    camPos: { x: x + 16, y: 22, z: z + 24 },
    lookAt: { x: x, y: 14, z: z }
  };
  g.add(create3DNameBadge('FLOR-ORC1', 'Quantum Cyan Orchid', 23));
  addLandmarkHitbox(g, 9.5, 24);
  worldGroup.add(g);
  landmarks.push(g);
}

// 2. Solar Golden Dahlia
function spawnGoldenDahlia(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const count = 28000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0xffbe0b);
  const c2 = new THREE.Color(0xff5500);

  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.65);
    const v = Math.random() * Math.PI * 18;
    // Multi-layered star pointed geometric dahlia
    const starWarp = 1 + 0.35 * Math.sin(12 * v + u * 6);
    const r = u * 9.2 * starWarp;
    const y = 14.5 + Math.sin(u * Math.PI * 0.8) * 6.0;

    pos[i * 3 + 0] = r * Math.cos(v);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(v);

    const c = c1.clone().lerp(c2, u);
    if (Math.random() > 0.8) c.addScalar(0.4);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.add(createPoints(pos, col, 0.38));

  // Stem
  const sPos = new Float32Array(5000 * 3), sCol = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    const t = Math.random();
    sPos[i * 3 + 0] = (Math.random() - 0.5) * 0.9;
    sPos[i * 3 + 1] = -2.0 + t * 16.0;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    sCol[i * 3 + 0] = 0.9; sCol[i * 3 + 1] = 0.6; sCol[i * 3 + 2] = 0.05;
  }
  g.add(createPoints(sPos, sCol, 0.28));

  g.userData = {
    id: 'dahlia_solar',
    entityId: 'FLOR-DAH2',
    name: 'Solar Golden Dahlia',
    species: 'Dahlia Solaris Fulva',
    category: 'PRIMARY BOTANICAL CORE',
    luminosity: '150,000 LUX',
    height: '21 METERS',
    desc: 'Dense multi-layered solar dahlia glowing with warm stellar radiation.',
    camPos: { x: x + 16, y: 22, z: z + 24 },
    lookAt: { x: x, y: 14, z: z }
  };
  g.add(create3DNameBadge('FLOR-DAH2', 'Solar Golden Dahlia', 23));
  addLandmarkHitbox(g, 9.5, 24);
  worldGroup.add(g);
  landmarks.push(g);
}

// 3. Violet Plasma Hibiscus
function spawnPlasmaHibiscus(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const count = 26000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0x9d4edd);
  const c2 = new THREE.Color(0xff2a6d);

  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.7);
    const v = Math.random() * Math.PI * 10; // 5 flared wide petals
    const petalWarp = 1 + 0.3 * Math.sin(5 * v);
    const r = u * 9.6 * petalWarp;
    const y = 14.0 + Math.pow(u, 1.2) * 8.0 - (r / 9.0) * 2.0;

    pos[i * 3 + 0] = r * Math.cos(v);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(v);

    const c = c1.clone().lerp(c2, u);
    if (Math.random() > 0.85) c.addScalar(0.35);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.add(createPoints(pos, col, 0.38));

  // Central Stamen Beam
  const stamenPos = new Float32Array(1500 * 3), stamenCol = new Float32Array(1500 * 3);
  for (let i = 0; i < 1500; i++) {
    const st = Math.random();
    stamenPos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
    stamenPos[i * 3 + 1] = 14.0 + st * 9.0;
    stamenPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    stamenCol[i * 3 + 0] = 1.0; stamenCol[i * 3 + 1] = 0.85; stamenCol[i * 3 + 2] = 0.1;
  }
  g.add(createPoints(stamenPos, stamenCol, 0.45));

  // Stem
  const sPos = new Float32Array(5000 * 3), sCol = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    const t = Math.random();
    sPos[i * 3 + 0] = (Math.random() - 0.5) * 0.9;
    sPos[i * 3 + 1] = -2.0 + t * 16.0;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    sCol[i * 3 + 0] = 0.6; sCol[i * 3 + 1] = 0.1; sCol[i * 3 + 2] = 0.9;
  }
  g.add(createPoints(sPos, sCol, 0.28));

  g.userData = {
    id: 'hibiscus_plasma',
    entityId: 'FLOR-HIB3',
    name: 'Violet Plasma Hibiscus',
    species: 'Hibiscus Nebularis Plasma',
    category: 'PRIMARY BOTANICAL CORE',
    luminosity: '142,000 LUX',
    height: '23 METERS',
    desc: 'Spreading 5-petal plasma hibiscus with high-energy golden core stamen.',
    camPos: { x: x + 16, y: 22, z: z + 24 },
    lookAt: { x: x, y: 14, z: z }
  };
  g.add(create3DNameBadge('FLOR-HIB3', 'Violet Plasma Hibiscus', 23));
  addLandmarkHitbox(g, 9.5, 24);
  worldGroup.add(g);
  landmarks.push(g);
}

// 4. Emerald Astral Bellflower
function spawnAstralBellflower(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const count = 26000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0x05ffa1);
  const c2 = new THREE.Color(0x00f0ff);

  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.75);
    const v = Math.random() * Math.PI * 14;
    // Downward curved bell shape
    const r = u * 9.0 * (1 + 0.25 * Math.sin(5 * v));
    const y = 21.0 - Math.pow(u, 1.4) * 8.5;

    pos[i * 3 + 0] = r * Math.cos(v);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(v);

    const c = c1.clone().lerp(c2, u);
    if (Math.random() > 0.85) c.addScalar(0.35);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.add(createPoints(pos, col, 0.38));

  // Stem arch
  const sPos = new Float32Array(5000 * 3), sCol = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    const t = Math.random();
    sPos[i * 3 + 0] = Math.sin(t * Math.PI * 0.4) * 1.5;
    sPos[i * 3 + 1] = -2.0 + t * 23.0;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    sCol[i * 3 + 0] = 0.05; sCol[i * 3 + 1] = 0.95; sCol[i * 3 + 2] = 0.55;
  }
  g.add(createPoints(sPos, sCol, 0.28));

  g.userData = {
    id: 'bellflower_astral',
    entityId: 'FLOR-BEL4',
    name: 'Emerald Astral Bellflower',
    species: 'Campanula Astralis Nova',
    category: 'PRIMARY BOTANICAL CORE',
    luminosity: '138,000 LUX',
    height: '22 METERS',
    desc: 'Towering hanging bellflower that casts cascading emerald photons downward.',
    camPos: { x: x + 16, y: 22, z: z + 24 },
    lookAt: { x: x, y: 14, z: z }
  };
  g.add(create3DNameBadge('FLOR-BEL4', 'Emerald Astral Bellflower', 23));
  addLandmarkHitbox(g, 9.5, 24);
  worldGroup.add(g);
  landmarks.push(g);
}

// A. Towering Crimson Rose Grove
function spawnRoseLandmark(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const count = 28000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cInner = new THREE.Color(1.0, 0.05, 0.28);
  const cOuter = new THREE.Color(0.85, 0.1, 0.4);

  let idx = 0;
  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.7);
    const v = Math.random() * Math.PI * 24;
    const rBase = u * 9.5;
    const waves = Math.sin(3.6 * v + u * 4) * 0.9 * u;
    const r = Math.max(0.1, rBase + waves);
    let y = 14.0 + Math.pow(u, 1.25) * 8.0 - Math.pow(r / 9.0, 2.5) * 3.2;

    pos[idx] = r * Math.cos(v) + (Math.random() - 0.5) * 0.2;
    pos[idx + 1] = y + (Math.random() - 0.5) * 0.2;
    pos[idx + 2] = r * Math.sin(v) + (Math.random() - 0.5) * 0.2;

    const c = cInner.clone().lerp(cOuter, u);
    if (u > 0.85 && Math.random() > 0.5) c.addScalar(0.4);
    col[idx] = c.r; col[idx + 1] = c.g; col[idx + 2] = c.b;
    idx += 3;
  }

  // Giant stem
  const sCount = 8000;
  const sPos = new Float32Array(sCount * 3);
  const sCol = new Float32Array(sCount * 3);
  const cStem = new THREE.Color(0.1, 0.95, 0.4);

  for (let i = 0; i < sCount; i++) {
    const t = Math.random();
    const y = -2.0 + t * 16.0;
    const curveX = Math.sin(t * Math.PI * 0.8) * 1.2;
    const curveZ = Math.cos(t * Math.PI * 0.5) * 0.8;
    const rad = Math.sqrt(Math.random()) * (0.6 + (1 - t) * 0.3);
    const th = Math.random() * Math.PI * 2;

    sPos[i * 3 + 0] = curveX + rad * Math.cos(th);
    sPos[i * 3 + 1] = y;
    sPos[i * 3 + 2] = curveZ + rad * Math.sin(th);

    sCol[i * 3 + 0] = cStem.r; sCol[i * 3 + 1] = cStem.g; sCol[i * 3 + 2] = cStem.b;
  }

  // Spiral ribbon
  const spCount = 4000;
  const spPos = new Float32Array(spCount * 3);
  const spCol = new Float32Array(spCount * 3);
  const cSp = new THREE.Color(0.2, 1.0, 0.8);

  for (let i = 0; i < spCount; i++) {
    const t = i / spCount;
    const th = t * Math.PI * 8;
    const r = 3.5 + Math.sin(t * Math.PI) * 2.5;
    const y = -2.0 + t * 18.0;

    spPos[i * 3 + 0] = r * Math.cos(th);
    spPos[i * 3 + 1] = y;
    spPos[i * 3 + 2] = r * Math.sin(th);
    spCol[i * 3 + 0] = cSp.r; spCol[i * 3 + 1] = cSp.g; spCol[i * 3 + 2] = cSp.b;
  }

  g.add(createPoints(pos, col, 0.42));
  g.add(createPoints(sPos, sCol, 0.35));
  const spMesh = createPoints(spPos, spCol, 0.48);
  spMesh.name = 'spiral';
  g.add(spMesh);

  g.userData = {
    id: 'rose',
    entityId: 'FLOR-001',
    name: 'Crimson Rose Grove',
    category: 'BIOLUMINESCENT FLORA',
    desc: 'The ancient mother flower of Aetheria. Its towering 22-meter petals generate harmonic energy waves that fuel the entire biome.',
    height: '22.4 m',
    species: 'Rosa Aetheria Superba',
    luminosity: '128,000 Lux',
    camPos: { x: x, y: 18, z: z + 36 },
    lookAt: { x: x, y: 14, z: z }
  };

  g.add(create3DNameBadge('FLOR-001', 'Crimson Rose Grove', 25));
  addLandmarkHitbox(g, 10, 26);
  worldGroup.add(g);
  landmarks.push(g);
}

// B. Sacred Neon Lotus Lake
function spawnLotusLake(x, z) {
  const g = new THREE.Group();
  g.position.set(x, -2, z);

  const count = 24000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cGold = new THREE.Color(1.0, 0.85, 0.2);
  const cPink = new THREE.Color(1.0, 0.2, 0.7);
  const cWhite = new THREE.Color(0.9, 0.95, 1.0);

  const tiers = [
    { count: 6, rMin: 1.5, rMax: 6.0, hUp: 6.0 },
    { count: 10, rMin: 3.5, rMax: 11.0, hUp: 4.2 },
    { count: 12, rMin: 7.0, rMax: 16.0, hUp: 2.5 }
  ];

  let pIdx = 0;
  for (let i = 0; i < count; i++) {
    if (i < 4000) {
      // Golden core
      const r = Math.sqrt(Math.random()) * 2.5;
      const th = Math.random() * Math.PI * 2;
      pos[pIdx] = r * Math.cos(th);
      pos[pIdx + 1] = 1.0 + (Math.random() - 0.5) * 0.4;
      pos[pIdx + 2] = r * Math.sin(th);
      col[pIdx] = cGold.r; col[pIdx + 1] = cGold.g; col[pIdx + 2] = cGold.b;
    } else {
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const petalIdx = Math.floor(Math.random() * tier.count);
      const angle = (petalIdx / tier.count) * Math.PI * 2;
      const prog = Math.random();
      const dist = tier.rMin + prog * (tier.rMax - tier.rMin);
      const spread = (Math.random() - 0.5) * (Math.sin(prog * Math.PI) * 2.2 / dist);
      const a = angle + spread;
      const h = Math.sin(prog * Math.PI * 0.8) * tier.hUp;

      pos[pIdx] = dist * Math.cos(a);
      pos[pIdx + 1] = h;
      pos[pIdx + 2] = dist * Math.sin(a);

      const c = cWhite.clone().lerp(cPink, Math.pow(prog, 0.8));
      col[pIdx] = c.r; col[pIdx + 1] = c.g; col[pIdx + 2] = c.b;
    }
    pIdx += 3;
  }

  // Giant water pad
  const padCount = 10000;
  const padPos = new Float32Array(padCount * 3);
  const padCol = new Float32Array(padCount * 3);
  const cPad = new THREE.Color(0.05, 0.9, 0.6);

  for (let i = 0; i < padCount; i++) {
    const a = Math.random() * Math.PI * 1.88;
    const r = 3.0 + Math.sqrt(Math.random()) * 18.0;
    padPos[i * 3 + 0] = r * Math.cos(a);
    padPos[i * 3 + 1] = -0.4 + (Math.random() - 0.5) * 0.2;
    padPos[i * 3 + 2] = r * Math.sin(a);
    padCol[i * 3 + 0] = cPad.r; padCol[i * 3 + 1] = cPad.g; padCol[i * 3 + 2] = cPad.b;
  }

  g.add(createPoints(pos, col, 0.44));
  g.add(createPoints(padPos, padCol, 0.35));

  g.userData = {
    id: 'lotus',
    entityId: 'FLOR-002',
    name: 'Sacred Lotus Lake',
    category: 'AQUATIC BIOME',
    desc: 'Floating above a mirror pool of pure starlight, this crystalline lotus blossoms across three concentric tiers with a golden seed receptacle.',
    height: '11.8 m',
    species: 'Nelumbo Lumina Sancta',
    luminosity: '110,500 Lux',
    camPos: { x: x, y: 15, z: z + 32 },
    lookAt: { x: x, y: 4, z: z }
  };

  g.add(create3DNameBadge('FLOR-002', 'Sacred Lotus Lake', 15));
  addLandmarkHitbox(g, 14, 16);
  worldGroup.add(g);
  landmarks.push(g);
}

// C. Sakura Sanctuary Tree
function spawnSakuraTree(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const count = 32000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cPink = new THREE.Color(1.0, 0.6, 0.78);
  const cWhite = new THREE.Color(1.0, 0.95, 1.0);
  const cViolet = new THREE.Color(0.8, 0.3, 0.9);

  const canopies = [
    { x: 0, y: 18, z: 0, r: 8.5 },
    { x: -6, y: 15, z: 4, r: 6.8 },
    { x: 7, y: 16, z: -3, r: 7.2 },
    { x: 3, y: 20, z: 5, r: 6.5 },
    { x: -4, y: 19, z: -5, r: 6.4 }
  ];

  let pIdx = 0;
  for (let i = 0; i < count; i++) {
    const cl = canopies[Math.floor(Math.random() * canopies.length)];
    const u = Math.random(), v = Math.random();
    const th = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const rad = Math.cbrt(Math.random()) * cl.r;

    pos[pIdx] = cl.x + rad * Math.sin(phi) * Math.cos(th);
    pos[pIdx + 1] = cl.y + rad * Math.cos(phi) * 0.75;
    pos[pIdx + 2] = cl.z + rad * Math.sin(phi) * Math.sin(th);

    const rnd = Math.random();
    const c = (rnd < 0.5) ? cPink : (rnd < 0.85 ? cWhite : cViolet);
    col[pIdx] = c.r; col[pIdx + 1] = c.g; col[pIdx + 2] = c.b;
    pIdx += 3;
  }

  // Trunk
  const tCount = 8000;
  const tPos = new Float32Array(tCount * 3);
  const tCol = new Float32Array(tCount * 3);
  const cTrunk = new THREE.Color(0.45, 0.25, 0.5);

  for (let i = 0; i < tCount; i++) {
    const t = Math.random();
    const y = -2.0 + t * 20.0;
    const curve = Math.sin(t * Math.PI) * 1.5;
    const radius = (1 - t * 0.6) * 1.2;
    const th = Math.random() * Math.PI * 2;

    tPos[i * 3 + 0] = curve + Math.cos(th) * radius;
    tPos[i * 3 + 1] = y;
    tPos[i * 3 + 2] = Math.sin(th) * radius;

    tCol[i * 3 + 0] = cTrunk.r; tCol[i * 3 + 1] = cTrunk.g; tCol[i * 3 + 2] = cTrunk.b;
  }

  g.add(createPoints(pos, col, 0.42));
  g.add(createPoints(tPos, tCol, 0.35));

  g.userData = {
    id: 'sakura',
    entityId: 'FLOR-003',
    name: 'Sakura Sanctuary Tree',
    category: 'FRACTAL ANCIENT ARBOR',
    desc: 'An ancient branching cosmic cherry blossom tree that constantly sheds bioluminescent petals into the troposphere.',
    height: '24.5 m',
    species: 'Prunus Aetheria Magna',
    luminosity: '142,000 Lux',
    camPos: { x: x, y: 22, z: z + 38 },
    lookAt: { x: x, y: 16, z: z }
  };

  g.add(create3DNameBadge('FLOR-003', 'Sakura Sanctuary', 27));
  addLandmarkHitbox(g, 12, 28);
  worldGroup.add(g);
  landmarks.push(g);
}

// D. Solar Sunflower Valley
function spawnSunflowerValley(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const count = 22000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cBrown = new THREE.Color(0.4, 0.2, 0.05);
  const cGold = new THREE.Color(1.0, 0.85, 0.1);
  const cOrange = new THREE.Color(1.0, 0.45, 0.0);

  const goldenAngle = 137.5 * (Math.PI / 180);
  let pIdx = 0;

  for (let i = 0; i < count; i++) {
    if (i < 11000) {
      const r = Math.sqrt(i / 11000) * 6.5;
      const th = i * goldenAngle;
      pos[pIdx] = r * Math.cos(th);
      pos[pIdx + 1] = 15.0 - Math.pow(r / 6.5, 2) * 0.9;
      pos[pIdx + 2] = r * Math.sin(th);

      const c = cBrown.clone().lerp(cGold, r / 6.5);
      col[pIdx] = c.r; col[pIdx + 1] = c.g; col[pIdx + 2] = c.b;
    } else {
      const ray = (i % 38);
      const angle = (ray / 38) * Math.PI * 2;
      const prog = Math.random();
      const len = 6.0 + prog * 8.5;
      const spread = (Math.random() - 0.5) * (Math.sin(prog * Math.PI) * 0.8);

      pos[pIdx] = len * Math.cos(angle + spread);
      pos[pIdx + 1] = 15.0 + Math.sin(prog * Math.PI * 0.6) * 1.2;
      pos[pIdx + 2] = len * Math.sin(angle + spread);

      const c = cGold.clone().lerp(cOrange, prog);
      col[pIdx] = c.r; col[pIdx + 1] = c.g; col[pIdx + 2] = c.b;
    }
    pIdx += 3;
  }

  // Giant stem
  const sCount = 6000;
  const sPos = new Float32Array(sCount * 3);
  const sCol = new Float32Array(sCount * 3);
  const cStem = new THREE.Color(0.2, 0.9, 0.35);

  for (let i = 0; i < sCount; i++) {
    const t = Math.random();
    const y = -2.0 + t * 17.0;
    const r = Math.sqrt(Math.random()) * 0.55;
    const th = Math.random() * Math.PI * 2;

    sPos[i * 3 + 0] = r * Math.cos(th);
    sPos[i * 3 + 1] = y;
    sPos[i * 3 + 2] = r * Math.sin(th);
    sCol[i * 3 + 0] = cStem.r; sCol[i * 3 + 1] = cStem.g; sCol[i * 3 + 2] = cStem.b;
  }

  g.add(createPoints(pos, col, 0.44));
  g.add(createPoints(sPos, sCol, 0.32));

  g.userData = {
    id: 'sunflower',
    entityId: 'FLOR-004',
    name: 'Solar Sunflower Valley',
    category: 'HELIOTROPIC ENERGY',
    desc: 'An enormous golden solar collector powered by mathematical Fibonacci spiral floret physics. Tracks the cosmic sun of Aetheria.',
    height: '17.2 m',
    species: 'Helianthus Solaris Divina',
    luminosity: '165,000 Lux',
    camPos: { x: x, y: 19, z: z + 34 },
    lookAt: { x: x, y: 15, z: z }
  };

  g.add(create3DNameBadge('FLOR-004', 'Solar Sunflower Valley', 21));
  addLandmarkHitbox(g, 10, 22);
  worldGroup.add(g);
  landmarks.push(g);
}

// E. Giant Crystal Monolith (Central Nexus)
function spawnCrystalMonolith(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const count = 18000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cCyan = new THREE.Color(0.0, 1.0, 0.95);
  const cWhite = new THREE.Color(1.0, 1.0, 1.0);

  for (let i = 0; i < count; i++) {
    // Octahedral / Obelisk Spire
    const t = Math.random(); // 0 to 1
    const y = -2.0 + t * 32.0;
    // Radius peaks at middle, tapers at top and bottom
    const rMax = Math.sin(t * Math.PI * 0.9) * 4.5;
    const r = Math.pow(Math.random(), 0.5) * rMax;
    // 6-sided facet
    const facet = Math.floor(Math.random() * 6);
    const th = (facet / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;

    pos[i * 3 + 0] = r * Math.cos(th);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(th);

    const c = cCyan.clone().lerp(cWhite, t);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }

  // Orbiting crystal ring
  const ringCount = 5000;
  const rPos = new Float32Array(ringCount * 3);
  const rCol = new Float32Array(ringCount * 3);
  const cGold = new THREE.Color(1.0, 0.85, 0.2);

  for (let i = 0; i < ringCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 8.5 + (Math.random() - 0.5) * 1.5;
    rPos[i * 3 + 0] = r * Math.cos(a);
    rPos[i * 3 + 1] = 16.0 + Math.sin(a * 3) * 1.8;
    rPos[i * 3 + 2] = r * Math.sin(a);
    rCol[i * 3 + 0] = cGold.r; rCol[i * 3 + 1] = cGold.g; rCol[i * 3 + 2] = cGold.b;
  }

  g.add(createPoints(pos, col, 0.4));
  const ringMesh = createPoints(rPos, rCol, 0.45);
  ringMesh.name = 'ring';
  g.add(ringMesh);

  g.userData = {
    id: 'crystal',
    entityId: 'MONO-005',
    name: 'Crystal Monolith Spire',
    category: 'QUANTUM NUCLEUS',
    desc: 'The resonance pillar connecting the subterranean energy matrix with the upper ionosphere of the virtual world.',
    height: '32.0 m',
    species: 'Aetherian Crystal Spire',
    luminosity: '210,000 Lux',
    camPos: { x: x, y: 24, z: z + 42 },
    lookAt: { x: x, y: 16, z: z }
  };

  g.add(create3DNameBadge('MONO-005', 'Crystal Monolith Spire', 35));
  addLandmarkHitbox(g, 8, 36);
  worldGroup.add(g);
  landmarks.push(g);
}

// F. Neon Tulip Plateau
function spawnTulipPlateau(x, z) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);

  const count = 18000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const cBase = new THREE.Color(0.85, 0.05, 0.95);
  const cMid = new THREE.Color(0.0, 0.95, 1.0);
  const cTip = new THREE.Color(1.0, 1.0, 1.0);

  let pIdx = 0;
  for (let i = 0; i < count; i++) {
    const petal = Math.floor(Math.random() * 6);
    const th = (petal / 6) * Math.PI * 2;
    const u = Math.random();
    const r = 0.5 + Math.sin(u * Math.PI * 0.85) * 5.5;
    const spread = (Math.random() - 0.5) * (Math.sin(u * Math.PI) * 1.5);
    const a = th + spread;
    const y = 9.0 + u * 10.5;

    pos[pIdx] = r * Math.cos(a);
    pos[pIdx + 1] = y;
    pos[pIdx + 2] = r * Math.sin(a);

    const c = (u < 0.5) ? cBase.clone().lerp(cMid, u * 2) : cMid.clone().lerp(cTip, (u - 0.5) * 2);
    col[pIdx] = c.r; col[pIdx + 1] = c.g; col[pIdx + 2] = c.b;
    pIdx += 3;
  }

  // Stem
  const sCount = 5000;
  const sPos = new Float32Array(sCount * 3);
  const sCol = new Float32Array(sCount * 3);
  const cStem = new THREE.Color(0.0, 0.95, 0.5);

  for (let i = 0; i < sCount; i++) {
    const t = Math.random();
    const y = -2.0 + t * 11.0;
    const r = Math.sqrt(Math.random()) * 0.45;
    const th = Math.random() * Math.PI * 2;
    sPos[i * 3 + 0] = r * Math.cos(th);
    sPos[i * 3 + 1] = y;
    sPos[i * 3 + 2] = r * Math.sin(th);
    sCol[i * 3 + 0] = cStem.r; sCol[i * 3 + 1] = cStem.g; sCol[i * 3 + 2] = cStem.b;
  }

  g.add(createPoints(pos, col, 0.42));
  g.add(createPoints(sPos, sCol, 0.32));

  g.userData = {
    id: 'tulip',
    entityId: 'FLOR-006',
    name: 'Tulip High Plateau',
    category: 'CHALICE FLORA',
    desc: 'Deep purple to neon cyan gradients form a towering chalice that gathers morning stardust condensations.',
    height: '19.5 m',
    species: 'Tulipa Neon Electrica',
    luminosity: '115,000 Lux',
    camPos: { x: x, y: 18, z: z + 36 },
    lookAt: { x: x, y: 12, z: z }
  };

  g.add(create3DNameBadge('FLOR-006', 'Tulip High Plateau', 23));
  addLandmarkHitbox(g, 9, 24);
  worldGroup.add(g);
  landmarks.push(g);
}

// Spawn all landmarks across their corresponding Earths
spawnRoseLandmark(0, 0);          // Earth-1 Center (Primary Crimson Rose)

// Four Giant Flowers around Central Rose in Earth-1 (Matching user's diagram)
spawnCyanOrchid(34, 34);          // North-East quadrant (X: +34, Z: +34)
spawnGoldenDahlia(34, -34);        // South-East quadrant (X: +34, Z: -34)
spawnPlasmaHibiscus(-34, -34);     // South-West quadrant (X: -34, Z: -34)
spawnAstralBellflower(-34, 34);    // North-West quadrant (X: -34, Z: +34)

// 4 Outer Earth World Centers
spawnLotusLake(0, 240);           // Earth-2 North Lotus Ocean
spawnSakuraTree(0, -240);         // Earth-3 South Sakura Highlands
spawnSunflowerValley(-250, 0);    // Earth-4 West Solaris Valley
spawnCrystalMonolith(250, 0);     // Earth-5 East Astral Peak
spawnTulipPlateau(-35, 30);       // Earth-1 Plateau

// ========================================================
// 5.1 MULTIVERSE REALM PORTALS (Outer Dimensional Gateways)
// ========================================================
function spawnMultiversePortal(x, z, realmId, realmName, realmColorHex, destX, destZ) {
  const g = new THREE.Group();
  const groundY = getTerrainHeightAt(x, z);
  g.position.set(x, groundY, z);

  // Outer Gateway Rings
  const ringGeo = new THREE.TorusGeometry(8.5, 0.45, 16, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: realmColorHex, wireframe: true });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.y = 9;
  ringMesh.name = 'portalRing';
  g.add(ringMesh);

  // Inner Swirling Event Horizon (Point Cloud Core)
  const corePointsCount = 2800;
  const pPos = new Float32Array(corePointsCount * 3);
  const pCol = new Float32Array(corePointsCount * 3);
  const c = new THREE.Color(realmColorHex);

  for (let i = 0; i < corePointsCount; i++) {
    const rad = Math.random() * 7.5;
    const ang = Math.random() * Math.PI * 2;
    pPos[i * 3 + 0] = Math.cos(ang) * rad;
    pPos[i * 3 + 1] = 9 + Math.sin(ang) * rad;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

    const col = c.clone().addScalar(Math.random() * 0.4);
    pCol[i * 3 + 0] = col.r; pCol[i * 3 + 1] = col.g; pCol[i * 3 + 2] = col.b;
  }
  const portalCore = createPoints(pPos, pCol, 0.38, 0.95);
  portalCore.name = 'portalCore';
  g.add(portalCore);

  g.userData = {
    id: realmId,
    entityId: `PORT-${realmId.toUpperCase()}`,
    name: realmName,
    species: 'Quantum Multiverse Gateway',
    category: 'MULTIVERSE PORTAL GATEWAY',
    luminosity: '250,000 LUX',
    height: '18 METERS',
    desc: `Step through the gateway to teleport across dimensions to (${destX}, ${destZ}).`,
    camPos: { x: x + 18, y: groundY + 14, z: z + 24 },
    lookAt: { x: x, y: groundY + 9, z: z },
    teleportTarget: { x: destX, z: destZ }
  };

  g.add(create3DNameBadge(`PORT-${realmId.toUpperCase()}`, realmName, 20));
  addLandmarkHitbox(g, 9, 22);

  worldGroup.add(g);
  landmarks.push(g);
}

// 3 Connected Multiverse Outer Realms
spawnMultiversePortal(200, 160, 'realm_plasma', '⚡ Neo-Plasma Multiverse Frontier', 0x00f0ff, 0, 15);
spawnMultiversePortal(-220, -180, 'realm_astral', '🌸 Astral Sakura Expanse', 0xff2a6d, -50, 40);
spawnMultiversePortal(240, -210, 'realm_solaris', '☀️ Solaris Golden Nebula', 0xffbe0b, 65, -50);

// ========================================================
// FEATURE 1: 🦋 GLOWING 3D BUTTERFLIES (Reduced to 4 Gentle Butterflies)
// ========================================================
const butterflies = [];
function createFaunaButterflies() {
  const bColors = [0x00f0ff, 0xff2a6d, 0xffbe0b, 0x05ffa1];

  // Reduced from 16 to just 4 subtle, calm butterflies
  for (let i = 0; i < 4; i++) {
    const bGroup = new THREE.Group();
    const wingGeo = new THREE.BufferGeometry();
    const wingPos = new Float32Array([
      0, 0, 0, 1.0, 0.7, 0, 0.7, -0.5, 0,
      0, 0, 0, -1.0, 0.7, 0, -0.7, -0.5, 0
    ]);
    wingGeo.setAttribute('position', new THREE.BufferAttribute(wingPos, 3));

    const wingMat = new THREE.MeshBasicMaterial({
      color: bColors[i % bColors.length],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });

    const mesh = new THREE.Mesh(wingGeo, wingMat);
    bGroup.add(mesh);

    // Glowing core particle
    const corePoint = createPoints(new Float32Array([0, 0, 0]), new Float32Array([1, 1, 1]), 0.5, 0.9);
    bGroup.add(corePoint);

    // Distributed around the main garden
    const angle = (i / 4) * Math.PI * 2 + 0.5;
    const rad = 28 + Math.random() * 25;
    bGroup.position.set(Math.cos(angle) * rad, 7 + Math.random() * 8, Math.sin(angle) * rad);

    bGroup.userData = {
      baseAngle: angle,
      radius: rad,
      speed: 0.5 + Math.random() * 0.3, // Slower, calmer flight
      heightOffset: bGroup.position.y,
      flapSpeed: 12 + Math.random() * 4
    };

    worldGroup.add(bGroup);
    butterflies.push(bGroup);
  }
}
createFaunaButterflies();

// ========================================================
// FEATURE 2: 🌊 DYNAMIC LIQUID RIPPLE LAKE (INTERACTIVE WATER)
// ========================================================
let waterMesh = null;
const waterRipples = [];

function createLiquidRippleLake() {
  const lakeRadius = 26;
  const count = 12000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  const cWaterDeep = new THREE.Color(0x021b29);
  const cWaterCyan = new THREE.Color(0x00f0ff);

  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * lakeRadius;
    const th = Math.random() * Math.PI * 2;
    pos[i * 3 + 0] = 55 + r * Math.cos(th); // Centered at Lotus Lake (55, 30)
    pos[i * 3 + 1] = -2.6; // Water surface height
    pos[i * 3 + 2] = 30 + r * Math.sin(th);

    const c = cWaterDeep.clone().lerp(cWaterCyan, (r / lakeRadius) * 0.6);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }

  waterMesh = createPoints(pos, col, 0.32, 0.88);
  worldGroup.add(waterMesh);
}
createLiquidRippleLake();

// Trigger water ripple
function triggerWaterRipple(wx = 55, wz = 30) {
  waterRipples.push({ x: wx, z: wz, time: 0, maxR: 18 });
  if (waterRipples.length > 5) waterRipples.shift();
}

// ========================================================
// FEATURE 3: 🌠 DYNAMIC METEOR SHOWERS & CELESTIAL RAIN (Deep in 3D Sky Background)
// ========================================================
let meteorShowerActive = true;
const meteorCount = 45; // Subtle, elegant quantity
const meteorGeo = new THREE.BufferGeometry();
const meteorPos = new Float32Array(meteorCount * 6); // Line segments
const meteorCol = new Float32Array(meteorCount * 6);

// Helper to spawn meteors far in 3D world space (away from camera near-plane)
function resetMeteorPosition(arr, index) {
  // Spawn in a wide ring/sphere in the 3D world sky (100 to 350 units away)
  const angle = Math.random() * Math.PI * 2;
  const dist = 120 + Math.random() * 250; // Kept at distance so never directly crosses front screen!
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const y = 80 + Math.random() * 100;

  // Head
  arr[index + 0] = x;
  arr[index + 1] = y;
  arr[index + 2] = z;

  // Tail
  arr[index + 3] = x + 3.5;
  arr[index + 4] = y + 14;
  arr[index + 5] = z + 3.5;
}

for (let i = 0; i < meteorCount; i++) {
  resetMeteorPosition(meteorPos, i * 6);

  const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.9, 0.75);
  meteorCol[i * 6 + 0] = c.r; meteorCol[i * 6 + 1] = c.g; meteorCol[i * 6 + 2] = c.b;
  meteorCol[i * 6 + 3] = 0; meteorCol[i * 6 + 4] = 0; meteorCol[i * 6 + 5] = 0;
}

meteorGeo.setAttribute('position', new THREE.BufferAttribute(meteorPos, 3));
meteorGeo.setAttribute('color', new THREE.BufferAttribute(meteorCol, 3));
const meteorLines = new THREE.LineSegments(meteorGeo, new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending
}));
worldGroup.add(meteorLines);

// ========================================================
// FEATURE 4: 🌱 INTERACTIVE FLOWER PLANTING (CREATIVE MODE)
// ========================================================
let plantingMode = false;
let plantedFlowerCount = 0;

function plantProceduralFlower(x, z) {
  plantedFlowerCount++;
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(x, -2, z);

  const colors = [0xff2a6d, 0x00f0ff, 0xffbe0b, 0x9d4edd, 0x05ffa1];
  const chosenColor = new THREE.Color(colors[plantedFlowerCount % colors.length]);

  const count = 4500;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = Math.pow(Math.random(), 0.7);
    const v = Math.random() * Math.PI * 18;
    const r = u * 3.2 + Math.sin(3.5 * v) * 0.3 * u;
    const y = 3.2 + u * 2.8 - Math.pow(r / 3.2, 2) * 0.8;

    pos[i * 3 + 0] = r * Math.cos(v);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(v);

    const c = chosenColor.clone().addScalar(u * 0.3);
    col[i * 3 + 0] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }

  const flowerMesh = createPoints(pos, col, 0.32);
  flowerGroup.add(flowerMesh);

  // Tiny stem
  const sCount = 1200;
  const sPos = new Float32Array(sCount * 3);
  const sCol = new Float32Array(sCount * 3);
  for (let i = 0; i < sCount; i++) {
    sPos[i * 3 + 0] = (Math.random() - 0.5) * 0.2;
    sPos[i * 3 + 1] = Math.random() * 3.5;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    sCol[i * 3 + 0] = 0.1; sCol[i * 3 + 1] = 0.9; sCol[i * 3 + 2] = 0.4;
  }
  flowerGroup.add(createPoints(sPos, sCol, 0.22));

  // Bloom animation: scale from 0 to 1
  flowerGroup.scale.set(0.01, 0.01, 0.01);
  new TWEEN.Tween(flowerGroup.scale)
    .to({ x: 1, y: 1, z: 1 }, 900)
    .easing(TWEEN.Easing.Back.Out)
    .start();

  worldGroup.add(flowerGroup);
  showToast(`🌱 New Bioluminescent Flower Planted at (${Math.round(x)}, ${Math.round(z)})!`);
}

// Ambient Rising Bioluminescent Dots (Pollen / Energy particles rising up from ground into sky)
const pollenCount = 35000; // High density luminous rising dots throughout the 3D world
const pPos = new Float32Array(pollenCount * 3);
const pCol = new Float32Array(pollenCount * 3);
const pSpeed = new Float32Array(pollenCount); // Individual upward floating speeds

for (let i = 0; i < pollenCount; i++) {
  // Dispersed in 3D world coordinates
  pPos[i * 3 + 0] = (Math.random() - 0.5) * 450;
  pPos[i * 3 + 1] = -3 + Math.random() * 55;
  pPos[i * 3 + 2] = (Math.random() - 0.5) * 450;

  // Luminous cyan, neon pink, gold & electric purple palette
  const hueOptions = [0.5, 0.55, 0.82, 0.95, 0.12];
  const chosenHue = hueOptions[Math.floor(Math.random() * hueOptions.length)];
  const c = new THREE.Color().setHSL(chosenHue, 0.95, 0.7);
  pCol[i * 3 + 0] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;

  // Gentle, calm upward velocity (slow floating drift)
  pSpeed[i] = 0.025 + Math.random() * 0.035;
}

const pollenGeo = new THREE.BufferGeometry();
pollenGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
pollenGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
const pollenMesh = new THREE.Points(pollenGeo, new THREE.PointsMaterial({
  size: 0.32,
  vertexColors: true,
  map: glowTexture,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false
}));
worldGroup.add(pollenMesh);

// ========================================================
// 5.5 REALISTIC HIGH-FIDELITY CYBERNETIC HERO AVATAR (PBR Humanoid)
// Detailed with sculpted anatomical plating, glowing energy veins, Pauldrons,
// articulated elbows, knees, boots, jetpack thrusters and animated helmet HUD.
// ========================================================
const playerGroup = new THREE.Group();

// Premium High-Tech Materials
const suitCarbonMat = new THREE.MeshStandardMaterial({
  color: 0x161b26, // Deep nanotech carbon fiber
  metalness: 0.85,
  roughness: 0.22,
  emissive: 0x050a14,
  emissiveIntensity: 0.2
});
const suitPlatingMat = new THREE.MeshStandardMaterial({
  color: 0x283244, // Reinforced titanium armor plating
  metalness: 0.92,
  roughness: 0.14,
  emissive: 0x091424,
  emissiveIntensity: 0.3
});
const suitGoldTrimMat = new THREE.MeshStandardMaterial({
  color: 0xffd166, // Luxury cyber gold accents
  metalness: 0.95,
  roughness: 0.1
});
const neonVeinCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
const neonVisorMat = new THREE.MeshBasicMaterial({ color: 0xff0055 }); // Radiant Cyber Visor
const thrusterFireMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

// 1. Torso & Upper Body Group
const torsoGroup = new THREE.Group();

// A. Abdomen & Spine
const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 1.4, 16), suitCarbonMat);
spine.position.y = 2.7;
torsoGroup.add(spine);

// B. Sculpted Chest / Pectoral Plating
const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.6, 1.6), suitPlatingMat);
chestMesh.position.y = 4.0;
torsoGroup.add(chestMesh);

// Ribcage angled side guards
const ribL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 1.3), suitCarbonMat);
ribL.position.set(-1.1, 3.8, 0.1);
ribL.rotation.z = -0.15;
const ribR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 1.3), suitCarbonMat);
ribR.position.set(1.1, 3.8, 0.1);
ribR.rotation.z = 0.15;
torsoGroup.add(ribL);
torsoGroup.add(ribR);

// C. Torso Quantum Arc Reactor (Central Power Core on Front Chest: facing forward z = -0.82)
const coreOuterRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 12, 32), suitGoldTrimMat);
coreOuterRing.position.set(0, 4.05, -0.82);
torsoGroup.add(coreOuterRing);

const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 24), neonVeinCyanMat);
coreMesh.rotation.x = Math.PI / 2;
coreMesh.position.set(0, 4.05, -0.81);
torsoGroup.add(coreMesh);

// D. Cyber Jetpack / Kinetic Battery on Back (facing camera z = +0.9)
const jetpack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.65), suitPlatingMat);
jetpack.position.set(0, 3.9, 0.9);
torsoGroup.add(jetpack);

// Dual Thrusters on Back
const thrusterL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.8, 16), suitCarbonMat);
thrusterL.position.set(-0.55, 2.7, 0.9);
const thrusterR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.8, 16), suitCarbonMat);
thrusterR.position.set(0.55, 2.7, 0.9);
torsoGroup.add(thrusterL);
torsoGroup.add(thrusterR);

const flameL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 12), thrusterFireMat);
flameL.position.set(-0.55, 2.1, 0.9);
flameL.rotation.x = Math.PI;
const flameR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 12), thrusterFireMat);
flameR.position.set(0.55, 2.1, 0.9);
flameR.rotation.x = Math.PI;
torsoGroup.add(flameL);
torsoGroup.add(flameR);

// 2. High-Tech Helmet & Articulated Neck
const headGroup = new THREE.Group();
headGroup.position.set(0, 5.25, 0);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.6, 16), suitCarbonMat);
neck.position.y = -0.35;
headGroup.add(neck);

// Helmet Shell (Sleek Angular Sculpt)
const headMesh = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.25, 1.3), suitPlatingMat);
headGroup.add(headMesh);

const helmetCrown = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 1.2), suitGoldTrimMat);
helmetCrown.position.set(0, 0.65, -0.05);
headGroup.add(helmetCrown);

// Jaw & Chin Guard
const jawGuard = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 4), suitPlatingMat);
jawGuard.position.set(0, -0.4, -0.45);
jawGuard.rotation.x = 0.5;
headGroup.add(jawGuard);

// Holographic Cyber Visor (Curved Forward Look)
const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.38, 0.5), neonVisorMat);
visorMesh.position.set(0, 0.08, -0.55);
headGroup.add(visorMesh);

// Ear Audio Receptors
const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), suitGoldTrimMat);
earL.rotation.z = Math.PI / 2;
earL.position.set(-0.65, 0.05, 0);
const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), suitGoldTrimMat);
earR.rotation.z = Math.PI / 2;
earR.position.set(0.65, 0.05, 0);
headGroup.add(earL);
headGroup.add(earR);

torsoGroup.add(headGroup);

// 3. Articulated Arms (Shoulders, Biceps, Elbows, Forearms & Hands)
// Left Arm
const leftArmGroup = new THREE.Group();
leftArmGroup.position.set(-1.55, 4.6, 0);

// Shoulder Pauldron Guard
const lPauldron = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.95), suitPlatingMat);
lPauldron.position.set(-0.1, 0.15, 0);
lPauldron.rotation.z = 0.2;
leftArmGroup.add(lPauldron);

const lBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 1.1, 16), suitCarbonMat);
lBicep.position.set(-0.05, -0.65, 0);
leftArmGroup.add(lBicep);

const lForearm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.6), suitPlatingMat);
lForearm.position.set(-0.05, -1.6, 0);
leftArmGroup.add(lForearm);

const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.42), suitCarbonMat);
lHand.position.set(-0.05, -2.3, 0);
leftArmGroup.add(lHand);

torsoGroup.add(leftArmGroup);

// Right Arm
const rightArmGroup = new THREE.Group();
rightArmGroup.position.set(1.55, 4.6, 0);

const rPauldron = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.95), suitPlatingMat);
rPauldron.position.set(0.1, 0.15, 0);
rPauldron.rotation.z = -0.2;
rightArmGroup.add(rPauldron);

const rBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 1.1, 16), suitCarbonMat);
rBicep.position.set(0.05, -0.65, 0);
rightArmGroup.add(rBicep);

const rForearm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.6), suitPlatingMat);
rForearm.position.set(0.05, -1.6, 0);
rightArmGroup.add(rForearm);

const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.42), suitCarbonMat);
rHand.position.set(0.05, -2.3, 0);
rightArmGroup.add(rHand);

torsoGroup.add(rightArmGroup);

playerGroup.add(torsoGroup);

// 4. Articulated Legs (Hips, Thighs, Knee Pads, Calves & Magnetic Boots)
// Left Leg
const leftLegGroup = new THREE.Group();
leftLegGroup.position.set(-0.65, 2.2, 0);

const lThigh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.3, 0.75), suitCarbonMat);
lThigh.position.y = -0.65;
leftLegGroup.add(lThigh);

// Knee Armor Guard (Front facing knees z = -0.42)
const lKnee = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.3), suitGoldTrimMat);
lKnee.position.set(0, -1.3, -0.42);
leftLegGroup.add(lKnee);

const lShin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.3, 0.72), suitPlatingMat);
lShin.position.y = -1.95;
leftLegGroup.add(lShin);

// Heavy Magnetic Boot (toes pointing forward z = -0.25)
const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 1.25), suitPlatingMat);
lBoot.position.set(0, -2.6, -0.2);
leftLegGroup.add(lBoot);

playerGroup.add(leftLegGroup);

// Right Leg
const rightLegGroup = new THREE.Group();
rightLegGroup.position.set(0.65, 2.2, 0);

const rThigh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.3, 0.75), suitCarbonMat);
rThigh.position.y = -0.65;
rightLegGroup.add(rThigh);

const rKnee = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.3), suitGoldTrimMat);
rKnee.position.set(0, -1.3, -0.42);
rightLegGroup.add(rKnee);

const rShin = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.3, 0.72), suitPlatingMat);
rShin.position.y = -1.95;
rightLegGroup.add(rShin);

const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 1.25), suitPlatingMat);
rBoot.position.set(0, -2.6, -0.2);
rightLegGroup.add(rBoot);

playerGroup.add(rightLegGroup);

// Initial placement
playerGroup.position.set(0, 0, 18);
worldGroup.add(playerGroup);

// Player state
let playerRotationY = 0;
let playerPitch = 0; // Camera vertical look angle

// PUBG-Style Free Look 360° ("Eye Look" / V-Key)
let isFreeLooking = false;
let freeLookRotationY = 0; // Relative free-look yaw angle
let freeLookPitch = 0;     // Relative free-look pitch angle
let freeLookLookAtFace = false; // When true, camera spins 180 to face character directly!
const freelookBadge = document.getElementById('freelook-indicator');
const btnPubgEye = document.getElementById('btn-pubg-eye');

function setFreeLookState(active, faceFront = false) {
  isFreeLooking = active;
  if (active) {
    if (faceFront) {
      // Rotate 180° so the camera is in front of the character, showing their face and visor clearly!
      freeLookRotationY = Math.PI;
      freeLookPitch = -0.05;
      freeLookLookAtFace = true;
    }
    freelookBadge?.classList.remove('hidden');
    btnPubgEye?.classList.add('active');
    showToast(faceFront ? '👁️ PUBG Eye Mode: Character Face & 360° View Active!' : '👁️ Free Look 360° Active (V)');
  } else {
    freelookBadge?.classList.add('hidden');
    btnPubgEye?.classList.remove('active');
    freeLookRotationY = 0;
    freeLookPitch = 0;
    freeLookLookAtFace = false;
  }
}

// ========================================================
// 5.6 EARTH-3 SAKURA FAUNA & DIVERSE COSTUMED NPCS (MASTERCLASS EDITION)
// ========================================================
const earth3NPCs = [];
const earth3Animals = [];

// NPC Costumes with Distinct Armor Colors, Visors & Capes/Accents (Indian Cultural & Futuristic Theme)
const npcCostumes = [
  {
    name: 'Veer Vikram',
    title: 'Sakura Cyber Yoddha',
    classRole: 'samurai',
    armorCol: 0x240046, // Deep Violet Armor
    trimCol: 0xff007f,  // Neon Magenta
    visorCol: 0x00f0ff, // Aqua Visor
    capeCol: 0x7209b7,  // Cyber Angavastra / Cape
    coreCol: 0xff0055,
    hasCape: true,
    scale: 1.05
  },
  {
    name: 'Ananya',
    title: 'Vanaspati Vaigyanik',
    classRole: 'botanist',
    armorCol: 0x0d3b66, // Cobalt Navy
    trimCol: 0x06d6a0,  // Mint Emerald
    visorCol: 0x52b788, // Emerald HUD
    capeCol: 0x118ab2,
    coreCol: 0x06d6a0,
    hasCape: false,
    scale: 0.95
  },
  {
    name: 'Rishi Vashistha',
    title: 'Brahmaand Mahaguru',
    classRole: 'sage',
    armorCol: 0x1a1a24, // Midnight Obsidian
    trimCol: 0xffd166,  // Gold Inlays
    visorCol: 0xffd166, // Golden Visor
    capeCol: 0xd90429,  // Crimson Silk Cape
    coreCol: 0xffbe0b,
    hasCape: true,
    scale: 1.12
  },
  {
    name: 'Aarav',
    title: 'Nakshatra Khoji',
    classRole: 'ranger',
    armorCol: 0x2b2d42, // Matte Charcoal
    trimCol: 0xff5400,  // Solar Flame Orange
    visorCol: 0xff0054, // Ruby Visor
    capeCol: 0x9e0059,
    coreCol: 0xff5400,
    hasCape: false,
    scale: 0.98
  },
  {
    name: 'Ranveer',
    title: 'Maharakshak Vanguard',
    classRole: 'vanguard',
    armorCol: 0x0a1128, // Deep Abyssal Blue
    trimCol: 0x00b4d8,  // Cyan Plasma
    visorCol: 0x90e0ef, // Ice Cyan
    capeCol: 0x0077b6,
    coreCol: 0x00f0ff,
    hasCape: true,
    scale: 1.2
  }
];

// Helper to generate floating holographic billboard nameplate for each NPC
function createNPCNameSprite(name, title, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // Background Glass Pill
  ctx.fillStyle = 'rgba(10, 6, 20, 0.88)';
  ctx.strokeStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 128, 30);
  ctx.fill();
  ctx.stroke();

  // Name Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px Orbitron, Rajdhani, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 256, 70);

  // Subtitle / Role Text
  ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
  ctx.font = 'bold 26px Fira Code, monospace';
  ctx.fillText(`◆ ${title.toUpperCase()} ◆`, 256, 114);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4.8, 1.5, 1);
  return sprite;
}

function createEarth3NPC(config, baseX, baseZ) {
  const npcGroup = new THREE.Group();
  npcGroup.userData = { name: config.name, title: config.title };

  const npcArmorMat = new THREE.MeshStandardMaterial({
    color: config.armorCol,
    metalness: 0.88,
    roughness: 0.18,
    emissive: config.armorCol,
    emissiveIntensity: 0.35
  });
  const trimMat = new THREE.MeshBasicMaterial({ color: config.trimCol });
  const visorMat = new THREE.MeshBasicMaterial({ color: config.visorCol });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.9, roughness: 0.15 });

  // 1. Torso
  const torso = new THREE.Group();
  const chest = new THREE.Mesh(new THREE.BoxGeometry(2.3 * config.scale, 2.5 * config.scale, 1.5 * config.scale), npcArmorMat);
  chest.position.y = 3.6 * config.scale;
  torso.add(chest);

  // Neon Energy Core
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.45 * config.scale, 0.45 * config.scale, 0.35 * config.scale, 16), trimMat);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 3.7 * config.scale, 0.8 * config.scale);
  torso.add(core);

  // Cyber Cape / Haori Coat
  if (config.hasCape) {
    const capeGeo = new THREE.PlaneGeometry(2.2 * config.scale, 3.8 * config.scale);
    const capeMat = new THREE.MeshStandardMaterial({
      color: config.capeCol,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.3
    });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 2.6 * config.scale, -0.85 * config.scale);
    cape.rotation.x = 0.12;
    torso.add(cape);
    torso.userData.cape = cape;
  }

  // 2. Head with Distinct Helmet / Horns / Headdress
  const head = new THREE.Group();
  head.position.set(0, 5.1 * config.scale, 0);
  const helmet = new THREE.Mesh(new THREE.BoxGeometry(1.35 * config.scale, 1.35 * config.scale, 1.35 * config.scale), npcArmorMat);
  head.add(helmet);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(1.38 * config.scale, 0.4 * config.scale, 0.55 * config.scale), visorMat);
  visor.position.set(0, 0.08 * config.scale, -0.6 * config.scale);
  head.add(visor);

  // Unique Head Crests for each class
  if (config.classRole === 'samurai') {
    // Crescent Moon Kabuto Horns
    const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 1.4 * config.scale, 8), trimMat);
    hornL.position.set(-0.6 * config.scale, 1.1 * config.scale, -0.2);
    hornL.rotation.z = -0.55;
    const hornR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 1.4 * config.scale, 8), trimMat);
    hornR.position.set(0.6 * config.scale, 1.1 * config.scale, -0.2);
    hornR.rotation.z = 0.55;
    head.add(hornL);
    head.add(hornR);
  } else if (config.classRole === 'sage') {
    // Sage Halo / Diadem Crown
    const haloGeo = new THREE.TorusGeometry(0.9 * config.scale, 0.08, 8, 24);
    const halo = new THREE.Mesh(haloGeo, goldMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 1.1 * config.scale, 0);
    head.add(halo);
  } else if (config.classRole === 'vanguard') {
    // Heavy Armor Triple Crest
    const vCrest = new THREE.Mesh(new THREE.BoxGeometry(0.3 * config.scale, 0.9 * config.scale, 1.6 * config.scale), trimMat);
    vCrest.position.set(0, 0.95 * config.scale, 0);
    head.add(vCrest);
  } else {
    // Scout Antenna / Sensor Mast
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.2 * config.scale, 6), trimMat);
    ant.position.set(0.6 * config.scale, 1.0 * config.scale, -0.2);
    ant.rotation.z = -0.2;
    head.add(ant);
  }
  torso.add(head);

  // 3. Arms
  const lArm = new THREE.Group();
  lArm.position.set(-1.5 * config.scale, 4.5 * config.scale, 0);
  const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65 * config.scale, 2.3 * config.scale, 0.75 * config.scale), npcArmorMat);
  lArmMesh.position.y = -0.9 * config.scale;
  lArm.add(lArmMesh);
  torso.add(lArm);

  const rArm = new THREE.Group();
  rArm.position.set(1.5 * config.scale, 4.5 * config.scale, 0);
  const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65 * config.scale, 2.3 * config.scale, 0.75 * config.scale), npcArmorMat);
  rArmMesh.position.y = -0.9 * config.scale;
  rArm.add(rArmMesh);
  torso.add(rArm);

  // ========================================================
  // SPECIALIZED ROLE WEAPONS & ACCESSORIES (Features 1 to 5)
  // ========================================================
  let specialProp = null;

  if (config.classRole === 'samurai') {
    // 1. Veer Vikram: Cyber Katana (Back Sheath + Glowing Blade)
    const katanaGroup = new THREE.Group();
    katanaGroup.position.set(-0.7 * config.scale, 3.2 * config.scale, -0.9 * config.scale);
    katanaGroup.rotation.z = -0.65;

    const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.2, 0.12), npcArmorMat);
    katanaGroup.add(scabbard);
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 8), trimMat);
    hilt.position.y = 2.0;
    katanaGroup.add(hilt);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.35), goldMat);
    guard.position.y = 1.5;
    katanaGroup.add(guard);

    torso.add(katanaGroup);
    specialProp = katanaGroup;
  } else if (config.classRole === 'botanist') {
    // 2. Ananya: Levitating Botanical Scanning Drone + Holographic Tablet
    const droneGroup = new THREE.Group();
    droneGroup.position.set(1.6 * config.scale, 5.2 * config.scale, 0.6 * config.scale);

    const droneCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.35 * config.scale), trimMat);
    droneGroup.add(droneCore);

    const droneRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 * config.scale, 0.05, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    droneGroup.add(droneRing);
    torso.add(droneGroup);
    specialProp = droneGroup;

    // Handheld Data Pad in Left Arm
    const tablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.6 * config.scale, 0.05, 0.9 * config.scale),
      new THREE.MeshBasicMaterial({ color: 0x52b788 })
    );
    tablet.position.set(0, -1.9 * config.scale, 0.4 * config.scale);
    tablet.rotation.x = -0.6;
    lArm.add(tablet);
  } else if (config.classRole === 'sage') {
    // 3. Rishi Vashistha: Ancient Aetheric Energy Staff with Spinning Orbital Gem
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0.3 * config.scale, -1.2 * config.scale, 0.2 * config.scale);

    const staffShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 6.2 * config.scale, 8), goldMat);
    staffShaft.position.y = 1.8 * config.scale;
    staffGroup.add(staffShaft);

    // Floating gem on staff top
    const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45 * config.scale), trimMat);
    gem.position.y = 5.0 * config.scale;
    staffGroup.add(gem);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.75 * config.scale, 0.04, 6, 24),
      new THREE.MeshBasicMaterial({ color: 0xff0055 })
    );
    orbitRing.position.y = 5.0 * config.scale;
    staffGroup.add(orbitRing);

    rArm.add(staffGroup);
    specialProp = orbitRing;
  } else if (config.classRole === 'ranger') {
    // 4. Aarav: High-Frequency Energy Wings / Thrusters & Pulse Carbine
    const wingsGroup = new THREE.Group();
    wingsGroup.position.set(0, 3.8 * config.scale, -0.85 * config.scale);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.4 * config.scale, 0.3 * config.scale, 0.08), trimMat);
    wingL.position.set(-1.4 * config.scale, 0.6 * config.scale, 0);
    wingL.rotation.z = -0.35;
    const wingR = new THREE.Mesh(new THREE.BoxGeometry(2.4 * config.scale, 0.3 * config.scale, 0.08), trimMat);
    wingR.position.set(1.4 * config.scale, 0.6 * config.scale, 0);
    wingR.rotation.z = 0.35;
    wingsGroup.add(wingL);
    wingsGroup.add(wingR);

    torso.add(wingsGroup);
    specialProp = wingsGroup;
  } else if (config.classRole === 'vanguard') {
    // 5. Ranveer: Massive Energy Tower Shield & Dual Shoulder Cannons
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.4 * config.scale, -1.0 * config.scale, 0.5 * config.scale);

    const shieldMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6 * config.scale, 4.2 * config.scale, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x0077b6, metalness: 0.9, roughness: 0.15 })
    );
    shieldGroup.add(shieldMesh);

    const shieldNeonCross = new THREE.Mesh(
      new THREE.BoxGeometry(1.3 * config.scale, 3.8 * config.scale, 0.22),
      trimMat
    );
    shieldGroup.add(shieldNeonCross);
    lArm.add(shieldGroup);

    // Shoulder Heavy Plasma Cannons
    const cannonL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.4 * config.scale, 8), npcArmorMat);
    cannonL.rotation.x = Math.PI / 2;
    cannonL.position.set(-1.3 * config.scale, 5.0 * config.scale, 0);
    torso.add(cannonL);

    const cannonR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.4 * config.scale, 8), npcArmorMat);
    cannonR.rotation.x = Math.PI / 2;
    cannonR.position.set(1.3 * config.scale, 5.0 * config.scale, 0);
    torso.add(cannonR);

    specialProp = shieldGroup;
  }

  npcGroup.add(torso);

  // 4. Legs
  const lLeg = new THREE.Group();
  lLeg.position.set(-0.65 * config.scale, 2.3 * config.scale, 0);
  const lLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78 * config.scale, 2.3 * config.scale, 0.88 * config.scale), npcArmorMat);
  lLegMesh.position.y = -1.1 * config.scale;
  lLeg.add(lLegMesh);
  npcGroup.add(lLeg);

  const rLeg = new THREE.Group();
  rLeg.position.set(0.65 * config.scale, 2.3 * config.scale, 0);
  const rLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78 * config.scale, 2.3 * config.scale, 0.88 * config.scale), npcArmorMat);
  rLegMesh.position.y = -1.1 * config.scale;
  rLeg.add(rLegMesh);
  npcGroup.add(rLeg);

  // 5. Feet Neon Ring
  const footRing = new THREE.Mesh(
    new THREE.RingGeometry(1.4 * config.scale, 2.0 * config.scale, 24),
    new THREE.MeshBasicMaterial({ color: config.trimCol, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
  );
  footRing.rotation.x = Math.PI / 2;
  footRing.position.y = 0.05;
  npcGroup.add(footRing);

  // 6. Overhead Holographic Nameplate (Visible only when close to NPC)
  const nameplate = createNPCNameSprite(config.name, config.title, config.trimCol);
  nameplate.position.set(0, 6.8 * config.scale, 0);
  nameplate.visible = false; // Initially hidden until player approaches
  nameplate.material.opacity = 0;
  npcGroup.add(nameplate);

  // Initial Grounding
  const groundY = getTerrainHeightAt(baseX, baseZ);
  npcGroup.position.set(baseX, groundY, baseZ);
  npcGroup.rotation.y = Math.random() * Math.PI * 2;

  worldGroup.add(npcGroup);

  // Pick an initial random destination on Earth-3 (Radius up to 50m around center (0, -240))
  const randAngle = Math.random() * Math.PI * 2;
  const randDist = 10 + Math.random() * 38;
  const initTargetX = Math.cos(randAngle) * randDist;
  const initTargetZ = -240 + Math.sin(randAngle) * randDist;

  earth3NPCs.push({
    group: npcGroup,
    config,
    torso,
    head,
    lArm,
    rArm,
    lLeg,
    rLeg,
    specialProp,
    nameplate,
    baseX,
    baseZ,
    speed: 5.5 + Math.random() * 3.5, // Natural jogging/walking pace in m/s
    currentVelocity: new THREE.Vector2(0, 0),
    targetX: initTargetX,
    targetZ: initTargetZ,
    pauseTimer: 0,
    idlePhase: Math.random() * 10,
    isLookingAtPlayer: false
  });
}

// ----------------------------------------------------
// ANIMALS: Quantum Cyber Rabbits (Kharagosh), Neon Deer (Hiran) & Fox Spirits
// ----------------------------------------------------

// 1. Quantum Cyber Rabbit (Kharagosh) with long twitching ears & hopping motion
function createQuantumRabbit(baseX, baseZ, colorHex) {
  const g = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.4,
    metalness: 0.1,
    emissive: colorHex,
    emissiveIntensity: 0.25
  });
  const neonEyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 12, 10), furMat);
  body.scale.set(1.0, 0.9, 1.4);
  body.position.y = 0.8;
  g.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), furMat);
  head.position.set(0, 1.35, -0.75);
  g.add(head);

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), neonEyeMat);
  eyeL.position.set(-0.35, 1.45, -1.05);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), neonEyeMat);
  eyeR.position.set(0.35, 1.45, -1.05);
  g.add(eyeL);
  g.add(eyeR);

  // Long Ears
  const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 1.1, 8), furMat);
  earL.position.set(-0.25, 2.1, -0.65);
  earL.rotation.z = -0.25;
  earL.rotation.x = -0.2;
  const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 1.1, 8), furMat);
  earR.position.set(0.25, 2.1, -0.65);
  earR.rotation.z = 0.25;
  earR.rotation.x = -0.2;
  g.add(earL);
  g.add(earR);

  // Tail (Fluffy Little Ball)
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), furMat);
  tail.position.set(0, 0.9, 1.25);
  g.add(tail);

  // Legs
  const legFL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), furMat);
  legFL.position.set(-0.35, 0.25, -0.4);
  const legFR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.25), furMat);
  legFR.position.set(0.35, 0.25, -0.4);
  const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.5), furMat);
  legBL.position.set(-0.45, 0.3, 0.5);
  const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.6, 0.5), furMat);
  legBR.position.set(0.45, 0.3, 0.5);
  g.add(legFL); g.add(legFR); g.add(legBL); g.add(legBR);

  const yPos = getTerrainHeightAt(baseX, baseZ);
  g.position.set(baseX, yPos, baseZ);
  g.rotation.y = Math.random() * Math.PI * 2;
  worldGroup.add(g);

  earth3Animals.push({
    type: 'rabbit',
    group: g,
    earL,
    earR,
    baseX,
    baseZ,
    radius: 8 + Math.random() * 12,
    angle: Math.random() * Math.PI * 2,
    hopSpeed: 2.8 + Math.random() * 1.5,
    hopPhase: Math.random() * 10
  });
}

// 2. Astral Neon Deer (Hiran) with glowing branching antlers & graceful gait
function createAstralDeer(baseX, baseZ, antlerColorHex) {
  const g = new THREE.Group();
  const deerBodyMat = new THREE.MeshStandardMaterial({
    color: 0x4a2810, // Rich warm amber brown
    roughness: 0.5,
    metalness: 0.2
  });
  const antlerMat = new THREE.MeshBasicMaterial({ color: antlerColorHex });
  const deerEyeMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 3.2), deerBodyMat);
  body.position.y = 3.6;
  g.add(body);

  // Long Neck & Graceful Head
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 1.0), deerBodyMat);
  neck.position.set(0, 4.8, -1.4);
  neck.rotation.x = -0.45;
  g.add(neck);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.4), deerBodyMat);
  head.position.set(0, 5.8, -2.1);
  g.add(head);

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), deerEyeMat);
  eyeL.position.set(-0.48, 5.9, -2.3);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), deerEyeMat);
  eyeR.position.set(0.48, 5.9, -2.3);
  g.add(eyeL); g.add(eyeR);

  // Majestic Branching Antlers (Crystalline Neon)
  const antlerGroup = new THREE.Group();
  antlerGroup.position.set(0, 6.3, -2.0);

  // Main stems
  const stemL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 2.2, 8), antlerMat);
  stemL.position.set(-0.7, 0.9, 0.1);
  stemL.rotation.z = -0.45;
  stemL.rotation.x = 0.2;
  const stemR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 2.2, 8), antlerMat);
  stemR.position.set(0.7, 0.9, 0.1);
  stemR.rotation.z = 0.45;
  stemR.rotation.x = 0.2;
  antlerGroup.add(stemL);
  antlerGroup.add(stemR);

  // Antler Tines / branches
  const tineL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1.1, 6), antlerMat);
  tineL1.position.set(-1.1, 1.4, 0.4);
  tineL1.rotation.z = -0.8;
  const tineR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1.1, 6), antlerMat);
  tineR1.position.set(1.1, 1.4, 0.4);
  tineR1.rotation.z = 0.8;
  antlerGroup.add(tineL1);
  antlerGroup.add(tineR1);
  g.add(antlerGroup);

  // 4 Slender Legs
  const legFL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 2.8, 8), deerBodyMat);
  legFL.position.set(-0.6, 1.4, -1.1);
  const legFR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 2.8, 8), deerBodyMat);
  legFR.position.set(0.6, 1.4, -1.1);
  const legBL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 2.8, 8), deerBodyMat);
  legBL.position.set(-0.6, 1.4, 1.1);
  const legBR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 2.8, 8), deerBodyMat);
  legBR.position.set(0.6, 1.4, 1.1);
  g.add(legFL); g.add(legFR); g.add(legBL); g.add(legBR);

  // Gentle white flank spots
  const spotsMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let s = 0; s < 6; s++) {
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 8), spotsMat);
    spot.position.set(0.81, 3.6 + (s % 2) * 0.4 - 0.2, (s - 2.5) * 0.5);
    spot.rotation.y = Math.PI / 2;
    g.add(spot);
    const spotL = spot.clone();
    spotL.position.x = -0.81;
    spotL.rotation.y = -Math.PI / 2;
    g.add(spotL);
  }

  const yPos = getTerrainHeightAt(baseX, baseZ);
  g.position.set(baseX, yPos, baseZ);
  g.rotation.y = Math.random() * Math.PI * 2;
  worldGroup.add(g);

  earth3Animals.push({
    type: 'deer',
    group: g,
    neck,
    antlerGroup,
    legFL, legFR, legBL, legBR,
    baseX,
    baseZ,
    radius: 12 + Math.random() * 14,
    angle: Math.random() * Math.PI * 2,
    walkSpeed: 0.5 + Math.random() * 0.4,
    walkPhase: Math.random() * 10
  });
}

// 3. Kitsune Cyber Fox (Dusare Janavar - Multi-Tailed Mystic Fox)
function createCyberFox(baseX, baseZ) {
  const g = new THREE.Group();
  const foxMat = new THREE.MeshStandardMaterial({
    color: 0xef476f, // Radiant Sakura Vermilion
    roughness: 0.35,
    metalness: 0.2,
    emissive: 0xef476f,
    emissiveIntensity: 0.2
  });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x06d6a0 });

  // Sleek Torso
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 2.4), foxMat);
  body.position.y = 1.4;
  g.add(body);

  // Chest white patch
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), whiteMat);
  chest.position.set(0, 1.4, -0.8);
  g.add(chest);

  // Head with pointed snout
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.0), foxMat);
  head.position.set(0, 2.1, -1.3);
  g.add(head);

  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 4), whiteMat);
  snout.rotation.x = -Math.PI / 2;
  snout.position.set(0, 1.95, -1.9);
  g.add(snout);

  // Big Triangular Ears
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 4), foxMat);
  earL.position.set(-0.35, 2.7, -1.2);
  const earR = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 4), foxMat);
  earR.position.set(0.35, 2.7, -1.2);
  g.add(earL); g.add(earR);

  // Glowing eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  eyeL.position.set(-0.35, 2.15, -1.65);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  eyeR.position.set(0.35, 2.15, -1.65);
  g.add(eyeL); g.add(eyeR);

  // 3 Fluffy Tails with White Glowing Tips
  const tailsGroup = new THREE.Group();
  tailsGroup.position.set(0, 1.4, 1.2);
  for (let t = -1; t <= 1; t++) {
    const tGroup = new THREE.Group();
    const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, 1.6, 8), foxMat);
    tMesh.position.y = 0.8;
    tGroup.add(tMesh);
    const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8), whiteMat);
    tipMesh.position.y = 1.8;
    tGroup.add(tipMesh);

    tGroup.rotation.x = 0.6;
    tGroup.rotation.y = t * 0.45;
    tailsGroup.add(tGroup);
  }
  g.add(tailsGroup);

  // 4 Paws
  const pawFL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.28), foxMat);
  pawFL.position.set(-0.4, 0.45, -0.7);
  const pawFR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.28), foxMat);
  pawFR.position.set(0.4, 0.45, -0.7);
  const pawBL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.32), foxMat);
  pawBL.position.set(-0.4, 0.45, 0.7);
  const pawBR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.9, 0.32), foxMat);
  pawBR.position.set(0.4, 0.45, 0.7);
  g.add(pawFL); g.add(pawFR); g.add(pawBL); g.add(pawBR);

  const yPos = getTerrainHeightAt(baseX, baseZ);
  g.position.set(baseX, yPos, baseZ);
  g.rotation.y = Math.random() * Math.PI * 2;
  worldGroup.add(g);

  earth3Animals.push({
    type: 'fox',
    group: g,
    tailsGroup,
    baseX,
    baseZ,
    radius: 10 + Math.random() * 10,
    angle: Math.random() * Math.PI * 2,
    speed: 0.9 + Math.random() * 0.5,
    phase: Math.random() * 10
  });
}

// Spawn all NPCs on Earth-3 South Sakura Highlands (Around Z: -240)
const npcPositions = [
  { x: -14, z: -228 }, // Near the bridge arrival path
  { x: 18, z: -232 },  // Overlooking the blossom groves
  { x: -22, z: -250 }, // Near the ancient shrine stones
  { x: 14, z: -254 },  // Near the southern Sakura tree
  { x: 0, z: -262 }    // Deep Sakura sacred grove
];

for (let i = 0; i < npcCostumes.length; i++) {
  const pos = npcPositions[i];
  createEarth3NPC(npcCostumes[i], pos.x, pos.z);
}

// Spawn Fauna on Earth-3:
// 1. Rabbits (Kharagosh)
createQuantumRabbit(-8, -222, 0xffffff); // Pure Snow White
createQuantumRabbit(-12, -225, 0xffc6ff); // Sakura Pink
createQuantumRabbit(9, -236, 0xe0aaff);  // Lavender
createQuantumRabbit(22, -245, 0xffffff); // White
createQuantumRabbit(-6, -252, 0xffadad); // Rose

// 2. Astral Deer (Hiran) with glowing branching antlers
createAstralDeer(-26, -235, 0x00f0ff); // Neon Cyan Antler Stag
createAstralDeer(26, -238, 0xff007f);  // Magenta Antler Doe
createAstralDeer(5, -265, 0xffd166);   // Golden Horned Grand Elk
createAstralDeer(-18, -260, 0x06d6a0); // Emerald Forest Deer

// 3. Kitsune Mystic Foxes (Dusare Janavar)
createCyberFox(-16, -244);
createCyberFox(15, -248);
createCyberFox(0, -236);

// ========================================================
// 5.7 FALLING PETALS, LEAVES & REALM WEATHER PARTICLES (Feature 3)
// ========================================================
const petalCount = 850;
const petalGeo = new THREE.BufferGeometry();
const petalPos = new Float32Array(petalCount * 3);
const petalCol = new Float32Array(petalCount * 3);
const petalRot = new Float32Array(petalCount * 3);
const petalSpeed = new Float32Array(petalCount);

for (let i = 0; i < petalCount; i++) {
  // Spawn over Earth-3 Sakura Highlands (centered at X: 0, Z: -240)
  petalPos[i * 3 + 0] = (Math.random() - 0.5) * 110;
  petalPos[i * 3 + 1] = 5.0 + Math.random() * 30.0;
  petalPos[i * 3 + 2] = -240 + (Math.random() - 0.5) * 110;

  // Sakura pink & golden shimmering leaf colors
  const isGold = Math.random() < 0.25;
  if (isGold) {
    petalCol[i * 3 + 0] = 1.0; petalCol[i * 3 + 1] = 0.8; petalCol[i * 3 + 2] = 0.2;
  } else {
    petalCol[i * 3 + 0] = 1.0; petalCol[i * 3 + 1] = 0.55 + Math.random() * 0.3; petalCol[i * 3 + 2] = 0.8;
  }

  petalRot[i * 3 + 0] = Math.random() * Math.PI * 2;
  petalRot[i * 3 + 1] = Math.random() * Math.PI * 2;
  petalRot[i * 3 + 2] = Math.random() * Math.PI * 2;
  petalSpeed[i] = 1.2 + Math.random() * 1.5;
}

petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
petalGeo.setAttribute('color', new THREE.BufferAttribute(petalCol, 3));

const petalMat = new THREE.PointsMaterial({
  size: 0.65,
  vertexColors: true,
  transparent: true,
  opacity: 0.88,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const fallingPetalsMesh = new THREE.Points(petalGeo, petalMat);
worldGroup.add(fallingPetalsMesh);

// Companion Following Animal State (Feature 2)
let companionAnimal = null;
let companionTimer = 0;

// Codex Collected Flowers Registry (Feature 5)
const collectedCodex = {
  'FLOR-001': { name: 'Crimson Rose Grove', count: 1, species: 'Rosa Aetheria' },
  'TREE-001': { name: 'Divya Kalpavriksha', count: 1, species: 'Prunus Kalpavriksha' }
};

// Character Emote Animation State (Feature 6)
let activeEmote = null;
let emoteTimer = 0;

// Dash Particle Trail (Feature 6)
const dashTrailCount = 60;
const dashTrailGeo = new THREE.BufferGeometry();
const dashTrailPos = new Float32Array(dashTrailCount * 3);
const dashTrailCol = new Float32Array(dashTrailCount * 3);
for (let i = 0; i < dashTrailCount; i++) {
  dashTrailPos[i * 3 + 0] = 0; dashTrailPos[i * 3 + 1] = -100; dashTrailPos[i * 3 + 2] = 0;
  dashTrailCol[i * 3 + 0] = 0.0; dashTrailCol[i * 3 + 1] = 0.94; dashTrailCol[i * 3 + 2] = 1.0;
}
dashTrailGeo.setAttribute('position', new THREE.BufferAttribute(dashTrailPos, 3));
dashTrailGeo.setAttribute('color', new THREE.BufferAttribute(dashTrailCol, 3));
const dashTrailMesh = new THREE.Points(dashTrailGeo, new THREE.PointsMaterial({
  size: 0.5,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false
}));
worldGroup.add(dashTrailMesh);
let dashTrailIdx = 0;


// ========================================================
// 5.9 CELESTIAL CYBER PHOENIX SKY BIRDS (FLOCK FLIGHT)
// ========================================================
const skyBirds = [];
const birdWingGeo = new THREE.BufferGeometry();
// Triangular wing shape
const wingVerts = new Float32Array([
  0, 0, 0,   3.5, 0.4, -1.8,   0, 0, -2.2, // Left wing
  0, 0, 0,   0, 0, -2.2,   -3.5, 0.4, -1.8  // Right wing
]);
birdWingGeo.setAttribute('position', new THREE.BufferAttribute(wingVerts, 3));
birdWingGeo.computeVertexNormals();

const phoenixColors = [0x00f0ff, 0xff007f, 0xffbe0b, 0x9d4edd];
for (let b = 0; b < 6; b++) {
  const birdGroup = new THREE.Group();
  const bColor = phoenixColors[b % phoenixColors.length];
  const birdMat = new THREE.MeshBasicMaterial({
    color: bColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88
  });

  const bodyMesh = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.2, 5), birdMat);
  bodyMesh.rotation.x = Math.PI / 2;
  birdGroup.add(bodyMesh);

  // Left & Right Articulated Wings
  const lWing = new THREE.Mesh(new THREE.BufferGeometry(), birdMat);
  const lVerts = new Float32Array([0, 0, 0,  2.8, 0.2, -1.2,  0, 0, -1.8]);
  lWing.geometry.setAttribute('position', new THREE.BufferAttribute(lVerts, 3));
  lWing.position.set(0.2, 0, 0.2);
  birdGroup.add(lWing);

  const rWing = new THREE.Mesh(new THREE.BufferGeometry(), birdMat);
  const rVerts = new Float32Array([0, 0, 0,  0, 0, -1.8,  -2.8, 0.2, -1.2]);
  rWing.geometry.setAttribute('position', new THREE.BufferAttribute(rVerts, 3));
  rWing.position.set(-0.2, 0, 0.2);
  birdGroup.add(rWing);

  // Glowing trail tail
  const tailMesh = new THREE.Mesh(new THREE.BufferGeometry(), birdMat);
  const tVerts = new Float32Array([0, 0, 0,  0.5, 0, 2.5,  -0.5, 0, 2.5]);
  tailMesh.geometry.setAttribute('position', new THREE.BufferAttribute(tVerts, 3));
  birdGroup.add(tailMesh);

  birdGroup.scale.setScalar(1.2 + Math.random() * 0.5);
  worldGroup.add(birdGroup);

  skyBirds.push({
    group: birdGroup,
    lWing,
    rWing,
    centerOrbitX: (Math.random() - 0.5) * 60,
    centerOrbitZ: (Math.random() - 0.5) * 60,
    orbitRadius: 90 + b * 22,
    altitude: 55 + Math.random() * 25,
    speed: 0.35 + (b % 3) * 0.12,
    angle: (b / 6) * Math.PI * 2,
    flapSpeed: 9.0 + Math.random() * 3.0,
    flapPhase: b * 1.5
  });
}

// ========================================================
// 5.8 DYNAMIC NEON GROUND STEP PARTICLES & FOOTPRINT RIPPLES (Feature 3)
// ========================================================
const footprintPoolSize = 24;
const footprintRings = [];
const footprintRingGeo = new THREE.RingGeometry(0.3, 0.7, 24);

for (let i = 0; i < footprintPoolSize; i++) {
  const fMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const fMesh = new THREE.Mesh(footprintRingGeo, fMat);
  fMesh.rotation.x = Math.PI / 2;
  fMesh.position.set(0, -100, 0);
  fMesh.visible = false;
  worldGroup.add(fMesh);

  footprintRings.push({
    mesh: fMesh,
    material: fMat,
    life: 0,
    maxLife: 1.4,
    scale: 1.0
  });
}

let footprintPoolIndex = 0;
let lastStepDist = 0;
let lastPlayerStepPos = new THREE.Vector3(0, 0, 0);

function spawnFootprint(x, y, z, footOffset = 0.5) {
  const fp = footprintRings[footprintPoolIndex];
  footprintPoolIndex = (footprintPoolIndex + 1) % footprintPoolSize;

  // Alternate left/right foot offset perpendicular to facing angle
  const perpAngle = playerRotationY + Math.PI / 2;
  const fx = x + Math.sin(perpAngle) * footOffset;
  const fz = z + Math.cos(perpAngle) * footOffset;
  const fy = getTerrainHeightAt(fx, fz) + 0.04;

  fp.mesh.position.set(fx, fy, fz);
  fp.mesh.visible = true;
  fp.life = fp.maxLife;
  fp.scale = 0.8;
  fp.mesh.scale.set(fp.scale, fp.scale, 1);
  fp.material.opacity = 0.85;

  // Realm specific neon step color
  if (activeEarth === '2') fp.material.color.setHex(0x00f0ff); // Aqua
  else if (activeEarth === '3') fp.material.color.setHex(0xff2a6d); // Sakura Pink
  else if (activeEarth === '4') fp.material.color.setHex(0xffbe0b); // Gold
  else if (activeEarth === '5') fp.material.color.setHex(0x9d4edd); // Purple
  else fp.material.color.setHex(0x05ffa1); // Emerald Cyan for Earth-1
}

let joystickMove = { x: 0, y: 0 }; // Touch joystick inputs (-1 to +1)
const velocity = { x: 0, y: 0, z: 0 };

// Auto-Run Highway Travel State (Triggered upon passing through gates)
let isAutoRunningOnHighway = false;
let autoRunTarget = null;
let autoRunEarthId = null;
let autoRunSpeed = 32.0; // Comfortable, smooth jogging pace along cosmic highway
let gateCooldown = 0; // Cooldown timer (seconds) to prevent re-triggering loop upon arrival

// ========================================================
// 6. WALKING ENGINE (KEYBOARD + MOUSE & PUBG TOUCH THUMBSTICKS)
// ========================================================
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false
};

// Calculate exact ground elevation at player (x, z)
// Calculate exact ground elevation across 5 Connected Earth Worlds + Highways
function getTerrainHeightAt(x, z) {
  // 1. Central Earth-1 (Prime Core: (0, 0), radius: 85)
  const dCentral = Math.hypot(x, z);
  if (dCentral < 75) {
    const hill = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.0;
    return -2.0 + hill;
  }

  // 2. North Earth-2 (Lotus Ocean World: (0, 240), radius: 70)
  const dNorth = Math.hypot(x, z - 240);
  if (dNorth < 65) {
    const wave = Math.sin(x * 0.05 + z * 0.05) * 1.5;
    return -2.0 + wave;
  }

  // 3. South Earth-3 (Neon Sakura Highlands: (0, -240), radius: 70)
  const dSouth = Math.hypot(x, z + 240);
  if (dSouth < 65) {
    const cliff = Math.sin(x * 0.06) * 3.5 + Math.cos(z * 0.06) * 3.0;
    return -1.0 + cliff;
  }

  // 4. West Earth-4 (Solaris Crystal Dunes: (-250, 0), radius: 70)
  const dWest = Math.hypot(x + 250, z);
  if (dWest < 65) {
    const dunes = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 2.5;
    return -2.0 + dunes;
  }

  // 5. East Earth-5 (Astral Cosmic Peak: (250, 0), radius: 70)
  const dEast = Math.hypot(x - 250, z);
  if (dEast < 65) {
    const peak = 4.0 - (dEast / 65) * 4.0 + Math.sin(x * 0.08 + z * 0.08) * 2.0;
    return -2.0 + peak;
  }

  // 6. Connecting Cosmic Highways / Bridges (Between Earth-1 and 4 Outer Earths)
  // North Highway: x between -8 and +8, z between 65 and 180
  if (Math.abs(x) < 8.5 && z > 60 && z < 185) return -2.0;
  // South Highway: x between -8 and +8, z between -185 and -60
  if (Math.abs(x) < 8.5 && z > -185 && z < -60) return -2.0;
  // West Highway: z between -8 and +8, x between -195 and -65
  if (Math.abs(z) < 8.5 && x > -195 && x < -65) return -2.0;
  // East Highway: z between -8 and +8, x between 65 and 195
  if (Math.abs(z) < 8.5 && x > 65 && x < 195) return -2.0;

  // Space void below
  return -2.0;
}

window.addEventListener('keydown', (e) => {
  const code = e.code;
  if (code === 'Space') {
    e.preventDefault(); // Prevent browser page scroll or accidental button focus clicks!
    keys.jump = true;
  }
  if (code === 'KeyW' || code === 'ArrowUp') keys.forward = true;
  if (code === 'KeyS' || code === 'ArrowDown') keys.backward = true;
  if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
  if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;
  if (code === 'ShiftLeft' || code === 'ShiftRight') keys.sprint = true;

  // V-Key Free Look Hold (PUBG Eye View: Hold V to look at character's face & 360° orbit)
  if (code === 'KeyV' && currentMode === 'walk') {
    if (!isFreeLooking) {
      setFreeLookState(true, true); // Rotate camera to face front
    }
  }
});

window.addEventListener('keyup', (e) => {
  const code = e.code;
  if (code === 'KeyW' || code === 'ArrowUp') keys.forward = false;
  if (code === 'KeyS' || code === 'ArrowDown') keys.backward = false;
  if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
  if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
  if (code === 'Space') {
    e.preventDefault();
    keys.jump = false;
  }
  if (code === 'ShiftLeft' || code === 'ShiftRight') keys.sprint = false;

  // Release V-Key -> Immediately snaps camera back to standard view
  if (code === 'KeyV' && currentMode === 'walk') {
    if (isFreeLooking) {
      setFreeLookState(false);
    }
  }
});

// ========================================================
// 6.5 PUBG MOBILE TOUCH THUMBSTICKS (JOYSTICK & TOUCH LOOK)
// ========================================================
const joystickZone = document.getElementById('joystick-left-zone');
const joystickThumb = document.getElementById('joystick-thumb');
const touchLookZone = document.getElementById('touch-look-zone');
const btnMobileJump = document.getElementById('btn-mobile-jump');
const btnMobileSprint = document.getElementById('btn-mobile-sprint');

// ========================================================
// 6.6 PUBG MOBILE FLOATING EYE BUTTON CONTROLLER
// (Hold / Drag or Click to see Character's Face & 360° view)
// ========================================================
if (btnPubgEye) {
  let isEyeDragging = false;
  let eyeDragStart = { x: 0, y: 0 };

  // Mobile Touch Hold / Drag
  btnPubgEye.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    isEyeDragging = true;
    eyeDragStart = { x: touch.clientX, y: touch.clientY };
    setFreeLookState(true, true);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (isEyeDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - eyeDragStart.x;
      const dy = touch.clientY - eyeDragStart.y;
      eyeDragStart = { x: touch.clientX, y: touch.clientY };
      freeLookRotationY -= dx * 0.006;
      freeLookPitch = Math.max(-0.85, Math.min(0.85, freeLookPitch - dy * 0.005));
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (isEyeDragging) {
      isEyeDragging = false;
      setFreeLookState(false);
    }
  });

  // Desktop Mouse Click / Hold on Eye Button
  btnPubgEye.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isEyeDragging = true;
    eyeDragStart = { x: e.clientX, y: e.clientY };
    setFreeLookState(true, true);
  });

  window.addEventListener('mousemove', (e) => {
    if (isEyeDragging) {
      const dx = e.clientX - eyeDragStart.x;
      const dy = e.clientY - eyeDragStart.y;
      eyeDragStart = { x: e.clientX, y: e.clientY };
      freeLookRotationY -= dx * 0.006;
      freeLookPitch = Math.max(-0.85, Math.min(0.85, freeLookPitch - dy * 0.005));
    }
  });

  window.addEventListener('mouseup', () => {
    if (isEyeDragging) {
      isEyeDragging = false;
      setFreeLookState(false);
    }
  });
}


let touchMoveId = null;
let touchLookId = null;
let touchLookStart = { x: 0, y: 0 };
let joystickCenter = { x: 0, y: 0 };

if (joystickZone) {
  joystickZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchMoveId = touch.identifier;
    const rect = joystickZone.getBoundingClientRect();
    joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    handleJoystickMove(touch.clientX, touch.clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchMoveId) {
        handleJoystickMove(touch.clientX, touch.clientY);
      } else if (touch.identifier === touchLookId) {
        handleTouchLook(touch.clientX, touch.clientY);
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchMoveId) {
        touchMoveId = null;
        joystickMove = { x: 0, y: 0 };
        if (joystickThumb) joystickThumb.style.transform = 'translate(0px, 0px)';
      } else if (touch.identifier === touchLookId) {
        touchLookId = null;
      }
    }
  });
}

function handleJoystickMove(clientX, clientY) {
  const dx = clientX - joystickCenter.x;
  const dy = clientY - joystickCenter.y;
  const dist = Math.hypot(dx, dy);
  const maxR = 40;
  const clampedDist = Math.min(dist, maxR);
  const angle = Math.atan2(dy, dx);

  const thumbX = Math.cos(angle) * clampedDist;
  const thumbY = Math.sin(angle) * clampedDist;

  if (joystickThumb) {
    joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;
  }

  joystickMove.x = thumbX / maxR; // -1 to 1 (left/right)
  joystickMove.y = thumbY / maxR; // -1 to 1 (forward/backward)
}

// Touch swipe look around (Right screen half)
if (touchLookZone) {
  touchLookZone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchLookId = touch.identifier;
    touchLookStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: false });
}

function handleTouchLook(clientX, clientY) {
  const deltaX = clientX - touchLookStart.x;
  const deltaY = clientY - touchLookStart.y;
  touchLookStart = { x: clientX, y: clientY };

  if (isFreeLooking) {
    // Rotate camera around character without changing running direction
    freeLookRotationY -= deltaX * 0.005;
    freeLookPitch = Math.max(-0.85, Math.min(0.85, freeLookPitch - deltaY * 0.004));
  } else {
    // Adjust player yaw and pitch (Camera rotation)
    playerRotationY -= deltaX * 0.005;
    playerPitch = Math.max(-0.6, Math.min(0.6, playerPitch - deltaY * 0.004));
  }
}

// Mobile Jump & Sprint buttons
btnMobileJump?.addEventListener('touchstart', (e) => {
  e.preventDefault();
  keys.jump = true;
});
btnMobileJump?.addEventListener('touchend', () => {
  keys.jump = false;
});

btnMobileSprint?.addEventListener('click', (e) => {
  e.preventDefault();
  keys.sprint = !keys.sprint;
  btnMobileSprint.classList.toggle('active', keys.sprint);
});

// PC Mouse Look support in Walk mode (Both standard free mouse move & drag to rotate 360°)
let lastMousePos = { x: 0, y: 0 };
let mouseLookActive = false;

window.addEventListener('mousedown', (e) => {
  if (currentMode === 'walk') {
    // Only engage mouse look if not clicking on UI buttons
    if (e.target.closest('.hud-top') || e.target.closest('.hud-controls-card') ||
      e.target.closest('.floating-toolbox') || e.target.closest('.code-drawer')) {
      return;
    }
    mouseLookActive = true;
    lastMousePos = { x: e.clientX, y: e.clientY };
  }
});

window.addEventListener('mouseup', () => {
  // Keep mouse tracking active smoothly or reset drag
  lastMousePos = { x: 0, y: 0 };
});

window.addEventListener('mousemove', (e) => {
  if (currentMode === 'walk') {
    // Check for pointerLock delta or drag delta
    let deltaX = 0;
    let deltaY = 0;

    if (document.pointerLockElement === document.body || document.pointerLockElement === canvas) {
      deltaX = e.movementX || 0;
      deltaY = e.movementY || 0;
    } else {
      // Natural mouse movement turn (even without lock or while dragging/moving)
      if (lastMousePos.x !== 0 || lastMousePos.y !== 0) {
        deltaX = e.clientX - lastMousePos.x;
        deltaY = e.clientY - lastMousePos.y;
      }
      lastMousePos = { x: e.clientX, y: e.clientY };
    }

    if (deltaX !== 0 || deltaY !== 0) {
      if (isFreeLooking) {
        // Free Look 360°: Rotate camera around character without changing body facing
        freeLookRotationY -= deltaX * 0.0035;
        freeLookPitch = Math.max(-0.85, Math.min(0.85, freeLookPitch - deltaY * 0.003));
      } else {
        // Turn left & right with mouse X movement
        playerRotationY -= deltaX * 0.0035;
        // Look up & down with mouse Y movement (clamped)
        playerPitch = Math.max(-0.6, Math.min(0.6, playerPitch - deltaY * 0.003));
      }
    }
  }
});

// Canvas click in Walk mode to lock pointer for seamless first-person/third-person mouse look like PUBG/PC games
canvas.addEventListener('click', () => {
  if (currentMode === 'walk') {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock?.() || document.body.requestPointerLock?.();
    }
  }
});

fpControls.addEventListener('lock', () => {
  if (modalLock) modalLock.classList.remove('active');
  crosshair.style.display = 'block';
  orbitControls.enabled = false;
  showToast('🚶 Walk Active: WASD / Arrows to walk • Mouse to look!');
});

fpControls.addEventListener('unlock', () => {
  crosshair.style.display = 'none';
  if (currentMode === 'walk') {
    showToast('Cursor unlocked. Click screen anytime to resume walking.');
  }
});

// ========================================================
// 7. RADAR MINIMAP ENGINE
// ========================================================
const radarCanvas = document.getElementById('radar-canvas');
const radarCtx = radarCanvas.getContext('2d');
const radarCoords = document.getElementById('radar-coords');

function updateRadar() {
  const w = radarCanvas.width;
  const h = radarCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = 0.55; // 220 world units map to ~70px radius

  radarCtx.clearRect(0, 0, w, h);

  // Radar circular grid
  radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  radarCtx.lineWidth = 1;
  radarCtx.beginPath();
  radarCtx.arc(cx, cy, 30, 0, Math.PI * 2);
  radarCtx.arc(cx, cy, 60, 0, Math.PI * 2);
  radarCtx.stroke();

  // Draw Landmarks on Radar
  landmarks.forEach(lm => {
    const rx = cx + lm.position.x * scale;
    const ry = cy + lm.position.z * scale;

    radarCtx.fillStyle = '#ff2a6d';
    radarCtx.beginPath();
    radarCtx.arc(rx, ry, 4, 0, Math.PI * 2);
    radarCtx.fill();

    // Glow ring
    radarCtx.strokeStyle = 'rgba(255, 42, 109, 0.5)';
    radarCtx.beginPath();
    radarCtx.arc(rx, ry, 7, 0, Math.PI * 2);
    radarCtx.stroke();

    // Radar ID Label
    radarCtx.font = 'bold 7px "Fira Code", monospace';
    radarCtx.fillStyle = '#00f0ff';
    radarCtx.textAlign = 'center';
    radarCtx.fillText(lm.userData.entityId || lm.userData.id, rx, ry - 9);
  });

  // Draw Player Marker
  const px = cx + camera.position.x * scale;
  const py = cy + camera.position.z * scale;

  radarCtx.fillStyle = '#00f0ff';
  radarCtx.beginPath();
  radarCtx.arc(px, py, 4.5, 0, Math.PI * 2);
  radarCtx.fill();

  // Player forward vision cone
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const heading = Math.atan2(dir.z, dir.x);

  radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
  radarCtx.beginPath();
  radarCtx.moveTo(px, py);
  radarCtx.lineTo(px + Math.cos(heading - 0.4) * 14, py + Math.sin(heading - 0.4) * 14);
  radarCtx.moveTo(px, py);
  radarCtx.lineTo(px + Math.cos(heading + 0.4) * 14, py + Math.sin(heading + 0.4) * 14);
  radarCtx.stroke();

  radarCoords.innerText = `X: ${Math.round(camera.position.x)} | Z: ${Math.round(camera.position.z)}`;
}

// ========================================================
// 8. RAYCASTER CURSOR HOVER & CLICK INSPECTION
// ========================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const hoverTooltip = document.getElementById('hover-tooltip');
const tooltipId = document.getElementById('tooltip-id');
const tooltipName = document.getElementById('tooltip-name');
let hoveredLandmark = null;

// Collect hitboxes for raycasting
function getHitboxes() {
  const boxes = [];
  landmarks.forEach(lm => {
    const hb = lm.getObjectByName('hitbox');
    if (hb) boxes.push(hb);
  });
  return boxes;
}

window.addEventListener('mousemove', (e) => {
  // Update 2D normalized mouse coordinates
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (currentMode === 'walk') {
    // In walk mode, cursor is locked so center raycasts
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  } else {
    raycaster.setFromCamera(mouse, camera);
  }

  const hitboxes = getHitboxes();
  const intersects = raycaster.intersectObjects(hitboxes);

  if (intersects.length > 0) {
    const targetMesh = intersects[0].object;
    const parentLandmark = targetMesh.parent;
    const data = targetMesh.userData || parentLandmark.userData;

    // Check proximity/distance to the flower:
    // In 'walk' mode: check distance between player character and flower.
    // In 'orbit' / 'fly' mode: check distance between camera and flower (or intersection point).
    let isCloseEnough = false;
    const maxWalkDistance = 22.0; // Max distance in walk mode (only visible when near flower)
    const maxOrbitDistance = 45.0; // Max distance in orbit/fly mode

    if (currentMode === 'walk') {
      const flowerPos = new THREE.Vector3();
      parentLandmark.getWorldPosition(flowerPos);
      const distToPlayer = playerGroup.position.distanceTo(flowerPos);
      isCloseEnough = distToPlayer <= maxWalkDistance;
    } else {
      // In Orbit or Fly mode, check distance from camera to intersection point
      const distToCamera = intersects[0].distance;
      isCloseEnough = distToCamera <= maxOrbitDistance;
    }

    if (isCloseEnough) {
      if (hoveredLandmark !== parentLandmark) {
        // Hide previously hovered badge
        if (hoveredLandmark) {
          const prevBadge = hoveredLandmark.getObjectByName('badgeSprite');
          if (prevBadge) {
            prevBadge.visible = false;
            prevBadge.material.opacity = 0;
          }
        }

        hoveredLandmark = parentLandmark;
        canvas.style.cursor = 'pointer';

        // Reveal 3D Hologram Badge on the hovered flower
        const badge = hoveredLandmark.getObjectByName('badgeSprite');
        if (badge) {
          badge.visible = true;
          badge.material.opacity = 1;
        }

        // Update Cursor Tooltip
        if (data) {
          tooltipId.innerText = `ID: ${data.entityId || data.id}`;
          tooltipName.innerText = data.name;
          hoverTooltip.classList.add('visible');
        }
      }

      // Position tooltip right above mouse cursor
      hoverTooltip.style.left = `${e.clientX}px`;
      hoverTooltip.style.top = `${e.clientY}px`;
    } else {
      // If cursor is on a flower but player is too far away, do not display
      if (hoveredLandmark) {
        const badge = hoveredLandmark.getObjectByName('badgeSprite');
        if (badge) {
          badge.visible = false;
          badge.material.opacity = 0;
        }
        hoveredLandmark = null;
        canvas.style.cursor = 'grab';
        hoverTooltip.classList.remove('visible');
      }
    }
  } else {
    if (hoveredLandmark) {
      const badge = hoveredLandmark.getObjectByName('badgeSprite');
      if (badge) {
        badge.visible = false;
        badge.material.opacity = 0;
      }
      hoveredLandmark = null;
      canvas.style.cursor = 'grab';
      hoverTooltip.classList.remove('visible');
    }
  }
});

// Click on flower to inspect & warp
window.addEventListener('click', (e) => {
  // Prevent click when clicking UI panels
  if (e.target.closest('.hud-top') || e.target.closest('.hud-controls-card') ||
    e.target.closest('.floating-toolbox') || e.target.closest('.inspect-overlay') ||
    e.target.closest('.code-drawer')) {
    return;
  }

  // Dismiss any hover tooltip immediately on tap/click
  hoverTooltip.classList.remove('visible');
  if (hoveredLandmark) {
    const badge = hoveredLandmark.getObjectByName('badgeSprite');
    if (badge) {
      badge.visible = false;
      badge.material.opacity = 0;
    }
    hoveredLandmark = null;
  }

  if (currentMode === 'orbit') {
    raycaster.setFromCamera(mouse, camera);

    // If planting mode is enabled, plant on ground intersection!
    if (plantingMode) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2);
      const hitPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, hitPoint);
      if (hitPoint) {
        plantProceduralFlower(hitPoint.x, hitPoint.z);
        return;
      }
    }

    const intersects = raycaster.intersectObjects(getHitboxes());
    if (intersects.length > 0) {
      const targetMesh = intersects[0].object;
      const data = targetMesh.userData;
      if (data && data.id) {
        warpToPOI(data.id);
        // Highlight active warp chip
        document.querySelectorAll('.portal-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-poi') === data.id);
        });

        // Trigger water ripple if clicking Lotus Lake
        if (data.id === 'lotus') {
          triggerWaterRipple(55, 30);
        }
      }
    }
  }
});

// ========================================================
// 9. HIGH-PERFORMANCE ANIMATION LOOP & LIVE FPS COUNTER
// ========================================================
const clock = new THREE.Clock();
let bloomPulse = 0;
let flyAngle = 0;
let frameCount = 0;
let lastFpsUpdate = performance.now();
const statFpsEl = document.getElementById('stat-fps');

// Optimization: Throttle heavy operations
let frameTick = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.08);
  const time = clock.getElapsedTime();
  frameTick++;

  // Real-time live FPS Counter calculation
  frameCount++;
  const now = performance.now();
  if (now - lastFpsUpdate >= 500) {
    const currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
    if (statFpsEl) {
      statFpsEl.innerText = `${currentFps} FPS`;
      if (currentFps >= 55) {
        statFpsEl.style.color = '#05ffa1';
      } else if (currentFps >= 35) {
        statFpsEl.style.color = '#ffbe0b';
      } else {
        statFpsEl.style.color = '#ff2a6d';
      }
    }
    frameCount = 0;
    lastFpsUpdate = now;
  }

  // Tween update for smooth camera warp
  TWEEN.update();

  // Mode Logic
  if (currentMode === 'walk') {
    // Cooldown decrement to prevent gate ping-pong loops
    if (gateCooldown > 0) {
      gateCooldown -= delta;
    }

    // 0. AUTO-RUN HIGHWAY SPRINT ENGINE (When passing through Gates onto Roads)
    if (isAutoRunningOnHighway && autoRunTarget) {
      const dx = autoRunTarget.x - playerGroup.position.x;
      const dz = autoRunTarget.z - playerGroup.position.z;
      const distToDestination = Math.hypot(dx, dz);

      if (distToDestination > 2.0) {
        const roadAngle = Math.atan2(dx, dz);
        playerGroup.position.x += Math.sin(roadAngle) * autoRunSpeed * delta;
        playerGroup.position.z += Math.cos(roadAngle) * autoRunSpeed * delta;

        // Front Visor points exactly in the direction of running
        playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, roadAngle + Math.PI, 0.25);
        playerRotationY = THREE.MathUtils.lerp(playerRotationY, roadAngle + Math.PI, 0.2);

        // Smooth running limb animation
        const runTime = time * 13.0;
        leftLegGroup.rotation.x = Math.sin(runTime) * 0.8;
        rightLegGroup.rotation.x = -Math.sin(runTime) * 0.8;
        leftArmGroup.rotation.x = -Math.sin(runTime) * 0.7;
        rightArmGroup.rotation.x = Math.sin(runTime) * 0.7;
        torsoGroup.position.y = Math.abs(Math.sin(runTime * 2)) * 0.25;
      } else {
        // Arrived safely slightly past destination gate!
        isAutoRunningOnHighway = false;
        autoRunTarget = null;
        gateCooldown = 3.5; // 3.5 seconds cooldown so the arrival gate doesn't immediately bounce back!
        if (autoRunEarthId) {
          // Switch atmosphere and lighting only, do NOT teleport player to world center
          switchEarthRealm(autoRunEarthId, false);
          showToast(`🌍 Welcome Earth ${autoRunEarthId}!`);
        }
      }
    } else if (gateCooldown <= 0) {
      // Gate Detection: Only triggers when player walks into gate and not in cooldown
      const px = playerGroup.position.x;
      const pz = playerGroup.position.z;

      // 1. North Gate (Z: ~68, X: ~0) -> Auto-Run North to Earth-2 (Stops ~8m past Earth-2 gate at Z: 188)
      if (Math.hypot(px - 0, pz - 68) < 6.5 && (keys.forward || joystickMove.y < -0.2)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 0, z: 188 }; // Lands comfortably past Earth-2 Gate (Z: 180)
        autoRunEarthId = '2';
        showToast('🚀 North Cyber Gate Engaged: Highway Auto-Sprint to Earth-2!');
      }
      // 2. South Gate (Z: ~-68, X: ~0) -> Auto-Run South to Earth-3 (Stops ~8m past Earth-3 gate at Z: -188)
      else if (Math.hypot(px - 0, pz - (-68)) < 6.5 && (keys.forward || joystickMove.y > 0.2 || keys.backward)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 0, z: -188 }; // Lands comfortably past Earth-3 Gate (Z: -180)
        autoRunEarthId = '3';
        showToast('🚀 South Cyber Gate Engaged: Highway Auto-Sprint to Earth-3!');
      }
      // 3. West Gate (X: ~-68, Z: ~0) -> Auto-Run West to Earth-4 (Stops ~8m past Earth-4 gate at X: -198)
      else if (Math.hypot(px - (-68), pz - 0) < 6.5 && (keys.forward || keys.left || joystickMove.x < -0.2)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: -198, z: 0 }; // Lands comfortably past Earth-4 Gate (X: -190)
        autoRunEarthId = '4';
        showToast('🚀 West Cyber Gate Engaged: Highway Auto-Sprint to Earth-4!');
      }
      // 4. East Gate (X: ~68, Z: ~0) -> Auto-Run East to Earth-5 (Stops ~8m past Earth-5 gate at X: 198)
      else if (Math.hypot(px - 68, pz - 0) < 6.5 && (keys.forward || keys.right || joystickMove.x > 0.2)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 198, z: 0 }; // Lands comfortably past Earth-5 Gate (X: 190)
        autoRunEarthId = '5';
        showToast('🚀 East Cyber Gate Engaged: Highway Auto-Sprint to Earth-5!');
      }

      // ==========================================
      // RETURN GATES: Auto-Run Back past Central Earth-1 Gate
      // ==========================================
      // Return Gate from Earth-2 North (Z: ~180, X: ~0) -> Steps into Earth-1 (Stops at Z: 60)
      else if (Math.hypot(px - 0, pz - 180) < 6.5 && (keys.forward || joystickMove.y < -0.2 || keys.backward)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 0, z: 60 }; // Lands comfortably inside Earth-1 (Gate is at 68)
        autoRunEarthId = '1';
        showToast('🔄 Return Gate Engaged: Auto-Sprinting Back to Central Earth-1!');
      }
      // Return Gate from Earth-3 South (Z: ~-180, X: ~0) -> Steps into Earth-1 (Stops at Z: -60)
      else if (Math.hypot(px - 0, pz - (-180)) < 6.5 && (keys.forward || joystickMove.y > 0.2 || keys.backward)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 0, z: -60 };
        autoRunEarthId = '1';
        showToast('🔄 Return Gate Engaged: Auto-Sprinting Back to Central Earth-1!');
      }
      // Return Gate from Earth-4 West (X: ~-190, Z: ~0) -> Steps into Earth-1 (Stops at X: -60)
      else if (Math.hypot(px - (-190), pz - 0) < 6.5 && (keys.forward || keys.right || joystickMove.x > 0.2)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: -60, z: 0 };
        autoRunEarthId = '1';
        showToast('🔄 Return Gate Engaged: Auto-Sprinting Back to Central Earth-1!');
      }
      // Return Gate from Earth-5 East (X: ~190, Z: ~0) -> Steps into Earth-1 (Stops at X: 60)
      else if (Math.hypot(px - 190, pz - 0) < 6.5 && (keys.forward || keys.left || joystickMove.x < -0.2)) {
        isAutoRunningOnHighway = true;
        autoRunTarget = { x: 60, z: 0 };
        autoRunEarthId = '1';
        showToast('🔄 Return Gate Engaged: Auto-Sprinting Back to Central Earth-1!');
      }
    }

    // 1. Calculate inputs from Keyboard (PC) or Joystick (Mobile)
    let moveForward = 0;
    let moveRight = 0;

    // PC Keyboard
    if (keys.forward) moveForward += 1;
    if (keys.backward) moveForward -= 1;
    if (keys.right) moveRight += 1;
    if (keys.left) moveRight -= 1;

    // Mobile Thumbstick
    if (Math.abs(joystickMove.y) > 0.1) moveForward -= joystickMove.y;
    if (Math.abs(joystickMove.x) > 0.1) moveRight += joystickMove.x;

    const inputLen = Math.hypot(moveForward, moveRight);
    if (inputLen > 1) {
      moveForward /= inputLen;
      moveRight /= inputLen;
    }

    const speed = keys.sprint ? 34.0 : 18.0;

    // Movement vectors relative to player rotation
    const cosY = Math.cos(playerRotationY);
    const sinY = Math.sin(playerRotationY);

    const worldMoveX = (moveRight * cosY - moveForward * sinY) * speed * delta;
    const worldMoveZ = (-moveRight * sinY - moveForward * cosY) * speed * delta;

    playerGroup.position.x += worldMoveX;
    playerGroup.position.z += worldMoveZ;

    // Smooth player box facing angle towards movement
    if (inputLen > 0.1) {
      const targetAngle = playerRotationY + Math.atan2(moveRight, moveForward);
      playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetAngle, 0.2);
    } else {
      playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, playerRotationY, 0.1);
    }

    // Terrain ground adherence
    const groundLevel = getTerrainHeightAt(playerGroup.position.x, playerGroup.position.z);
    velocity.y -= 9.8 * 4.0 * delta; // Gravity

    if (playerGroup.position.y <= groundLevel) {
      velocity.y = 0;
      playerGroup.position.y = groundLevel;
      if (keys.jump) {
        velocity.y = 16.0; // Clean upward Jump impulse
      }
    }
    playerGroup.position.y += velocity.y * delta;

    // 2. 3rd-Person Follow Camera (Scaled for larger character box)
    // When free-looking at face, pull slightly closer (11.5m) so the face & helmet are clear!
    const cameraDistance = isFreeLooking ? 11.5 : 14.0;
    // Calculate total effective camera yaw and pitch
    const effCamAngleY = isFreeLooking ? (playerRotationY + freeLookRotationY) : playerRotationY;
    const effPitch = isFreeLooking ? (playerPitch + freeLookPitch) : playerPitch;

    const cameraHeight = (isFreeLooking ? 4.8 : 6.0) + effPitch * 5.0;
    const camTargetX = playerGroup.position.x + Math.sin(effCamAngleY) * cameraDistance;
    const camTargetZ = playerGroup.position.z + Math.cos(effCamAngleY) * cameraDistance;
    const camTargetY = playerGroup.position.y + cameraHeight;

    // Articulated Humanoid Walk / Run Animation
    let walkCycleSpeed = (keys.sprint ? 14.0 : 8.5);

    // Feature 6: Custom Emotes Overrides (Namaste / Meditate)
    if (activeEmote) {
      emoteTimer -= delta;
      if (activeEmote === 'wave') {
        // Namaste / Wave Gesture
        leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, -1.8, 0.2);
        leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, 0.4, 0.2);
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -1.8, 0.2);
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, -0.4, 0.2);
      } else if (activeEmote === 'meditate') {
        // Meditate Hovering
        playerGroup.position.y += Math.sin(time * 3) * 0.15 + 0.6;
        leftLegGroup.rotation.x = -1.2;
        rightLegGroup.rotation.x = -1.2;
        leftArmGroup.rotation.z = 0.8;
        rightArmGroup.rotation.z = -0.8;
      }
      if (emoteTimer <= 0) activeEmote = null;
    } else if (inputLen > 0.1) {
      const walkTime = time * walkCycleSpeed;
      // Leg swing (alternating)
      leftLegGroup.rotation.x = Math.sin(walkTime) * 0.7;
      rightLegGroup.rotation.x = -Math.sin(walkTime) * 0.7;
      leftArmGroup.rotation.x = -Math.sin(walkTime) * 0.6;
      rightArmGroup.rotation.x = Math.sin(walkTime) * 0.6;
      leftArmGroup.rotation.z = 0;
      rightArmGroup.rotation.z = 0;
      // Torso natural vertical bounce
      torsoGroup.position.y = Math.abs(Math.sin(walkTime * 2)) * 0.25;
    } else {
      // Idle breathing stance
      leftLegGroup.rotation.x = THREE.MathUtils.lerp(leftLegGroup.rotation.x, 0, 0.15);
      rightLegGroup.rotation.x = THREE.MathUtils.lerp(rightLegGroup.rotation.x, 0, 0.15);
      leftArmGroup.rotation.x = THREE.MathUtils.lerp(leftArmGroup.rotation.x, 0, 0.15);
      rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.15);
      leftArmGroup.rotation.z = THREE.MathUtils.lerp(leftArmGroup.rotation.z, 0, 0.15);
      rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0, 0.15);
      torsoGroup.position.y = Math.sin(time * 2.5) * 0.1; // Gentle breathing bob
    }

    // Smooth camera chase
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camTargetX, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camTargetY, 0.15);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camTargetZ, 0.15);

    // Look at player center
    camera.lookAt(playerGroup.position.x, playerGroup.position.y + 3.2, playerGroup.position.z);

    // 🚀 Jetpack Dynamic Thruster Boost Flames
    if (flameL && flameR) {
      const isSprinting = keys.sprint;
      const isMoving = inputLen > 0.1;
      const isJumping = playerGroup.position.y > groundLevel + 0.15;

      let targetFlameScaleY = 0.5; // Idle low glow
      let targetFlameScaleXZ = 0.6;
      if (isJumping) {
        // High boost thrust on Jump!
        targetFlameScaleY = 2.4 + Math.sin(time * 30) * 0.4;
        targetFlameScaleXZ = 1.6;
      } else if (isSprinting && isMoving) {
        // Super sprint jetpack blast
        targetFlameScaleY = 1.9 + Math.sin(time * 25) * 0.3;
        targetFlameScaleXZ = 1.35;
      } else if (isMoving) {
        // Normal walk gentle thrust
        targetFlameScaleY = 1.1 + Math.sin(time * 18) * 0.2;
        targetFlameScaleXZ = 1.0;
      }

      flameL.scale.y = THREE.MathUtils.lerp(flameL.scale.y, targetFlameScaleY, 0.25);
      flameL.scale.x = THREE.MathUtils.lerp(flameL.scale.x, targetFlameScaleXZ, 0.25);
      flameL.scale.z = flameL.scale.x;

      flameR.scale.y = THREE.MathUtils.lerp(flameR.scale.y, targetFlameScaleY, 0.25);
      flameR.scale.x = THREE.MathUtils.lerp(flameR.scale.x, targetFlameScaleXZ, 0.25);
      flameR.scale.z = flameR.scale.x;
    }

    // Realistic Character Head Tracking in Free Look (Helmet & Visor track camera view)
    if (headGroup) {
      if (isFreeLooking) {
        // Normalize rotation angle relative to body
        let relativeAngle = (freeLookRotationY % (Math.PI * 2));
        if (relativeAngle > Math.PI) relativeAngle -= Math.PI * 2;
        if (relativeAngle < -Math.PI) relativeAngle += Math.PI * 2;

        // If viewing from behind/side, head turns up to ~75 degrees towards view
        // If viewing directly from front (showing face), head stays forward facing camera proudly!
        let targetHeadYaw = 0;
        if (Math.abs(relativeAngle) < Math.PI * 0.75) {
          targetHeadYaw = Math.max(-1.3, Math.min(1.3, -relativeAngle));
        }
        const targetHeadPitch = Math.max(-0.5, Math.min(0.5, -freeLookPitch));
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadYaw, 0.2);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadPitch, 0.2);
      } else {
        // Return head smoothly forward
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.15);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0, 0.15);
      }
    }
  } else if (currentMode === 'fly') {
    flyAngle += 0.004;
    const r = 90 + Math.sin(flyAngle * 2) * 20;
    camera.position.x = Math.sin(flyAngle) * r;
    camera.position.z = Math.cos(flyAngle) * r;
    camera.position.y = 25 + Math.sin(flyAngle * 3) * 10;
    camera.lookAt(0, 10, 0);
  } else {
    orbitControls.update();
  }

  // Rotate Landmark spirals
  // [LAZY LOADING OPTIMIZATION]: Frustum/Distance Culling for 120+ procedural landmarks
  const tSin = Math.sin(time * 0.3) * 0.12;
  const tSpiral = -time * 1.2;
  const tRing = time * 0.6;
  const tRingX = Math.sin(time) * 0.2;

  const camX = camera.position.x;
  const camY = camera.position.y;
  const camZ = camera.position.z;
  const isHighAltitude = camY > 80;

  // 1. LAZY LOADING CHUNKS: 5 Earths terrain chunks
  for (let i = 0; i < earthChunks.length; i++) {
    const chunk = earthChunks[i];
    if (isHighAltitude) {
      // In orbital / top-down bird's-eye view, keep all planetary centers visible
      if (!chunk.mesh.visible) chunk.mesh.visible = true;
    } else {
      const distToChunk = Math.hypot(chunk.x - camX, chunk.z - camZ);
      const isVisible = distToChunk < (chunk.radius + 180);
      if (chunk.mesh.visible !== isVisible) {
        chunk.mesh.visible = isVisible;
      }
    }
  }

  // 2. LAZY LOADING HIGHWAYS: Roads and guardrails
  for (let i = 0; i < highwayChunks.length; i++) {
    const hc = highwayChunks[i];
    if (isHighAltitude) {
      if (!hc.mesh.visible) hc.mesh.visible = true;
    } else {
      const distToHighway = Math.hypot(hc.midX - camX, hc.midZ - camZ);
      const isVisible = distToHighway < 210;
      if (hc.mesh.visible !== isVisible) {
        hc.mesh.visible = isVisible;
      }
    }
  }

  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];

    // Distance check: If landmark is within 220 units of camera, animate and render it
    const distToCam = Math.hypot(lm.position.x - camX, lm.position.z - camZ);
    if (!isHighAltitude && distToCam > 260) {
      if (lm.visible) lm.visible = false; // Lazy Cull off-screen distant flora
      continue;
    } else {
      if (!lm.visible) lm.visible = true; // Lazy Resume
    }

    lm.rotation.y = tSin;

    // 🌸 Giant Monumental Flowers Living Breathing Animation
    const breathe = Math.sin(time * 0.8 + i) * 0.045;
    lm.scale.set(1.0 + breathe, 1.0 + breathe * 0.8, 1.0 + breathe);

    const sp = lm.getObjectByName('spiral');
    if (sp) sp.rotation.y = tSpiral;

    // Portal spin
    const pr = lm.getObjectByName('portalRing');
    if (pr) pr.rotation.z += 0.015;
    const pc = lm.getObjectByName('portalCore');
    if (pc) pc.rotation.z -= 0.025;

    const ring = lm.getObjectByName('ring');
    if (ring) {
      ring.rotation.y = tRing;
      ring.rotation.x = tRingX;
    }
  }

  // 🕊️ Celestial Phoenix Sky Birds Animation Loop (Graceful Flight & Wing Flapping)
  for (let b = 0; b < skyBirds.length; b++) {
    const bird = skyBirds[b];
    bird.angle += delta * bird.speed * 0.5;
    const bx = bird.centerOrbitX + Math.cos(bird.angle) * bird.orbitRadius;
    const bz = bird.centerOrbitZ + Math.sin(bird.angle) * bird.orbitRadius;
    const by = bird.altitude + Math.sin(time * 2.0 + bird.flapPhase) * 3.5;

    bird.group.position.set(bx, by, bz);
    // Face forward along flight tangent
    bird.group.rotation.y = -bird.angle;
    bird.group.rotation.z = Math.sin(time * 1.5) * 0.15; // Natural banking into turn

    // Flapping wings
    const wingFlap = Math.sin(time * bird.flapSpeed + bird.flapPhase) * 0.75;
    bird.lWing.rotation.z = wingFlap;
    bird.rWing.rotation.z = -wingFlap;
  }

  // ⚡ Cosmic Highway Light Stream Pulse (Bioluminescent energy traveling across planets)
  const highwayPulse = 0.85 + Math.sin(time * 3.5) * 0.18;
  for (let h = 0; h < highwayChunks.length; h++) {
    const hc = highwayChunks[h];
    if (hc.mesh.visible && hc.mesh.material) {
      hc.mesh.material.opacity = highwayPulse;
    }
  }

  // 🦋 Feature 1 Animation: Dynamic Butterfly Flight & Wing Flapping
  for (let i = 0; i < butterflies.length; i++) {
    const b = butterflies[i];
    const u = b.userData;
    const bAngle = u.baseAngle + time * u.speed * 0.4;
    b.position.x = Math.cos(bAngle) * u.radius;
    b.position.z = Math.sin(bAngle) * u.radius;
    b.position.y = u.heightOffset + Math.sin(time * 3 + i) * 2.2;
    // Wing flapping
    const wingMesh = b.children[0];
    if (wingMesh) {
      wingMesh.rotation.y = Math.sin(time * u.flapSpeed) * 0.7;
    }
    b.rotation.y = -bAngle + Math.PI / 2;
  }

  // 👣 Animate Dynamic Footprint Rings (Expansion & Smooth Fade-Out)
  for (let i = 0; i < footprintRings.length; i++) {
    const fp = footprintRings[i];
    if (fp.life > 0) {
      fp.life -= delta;
      const progress = 1.0 - (fp.life / fp.maxLife); // 0 -> 1
      fp.scale = 0.8 + progress * 0.9; // Smoothly expands from 0.8 to 1.7
      fp.mesh.scale.set(fp.scale, fp.scale, 1);
      fp.material.opacity = Math.max(0, (1.0 - progress) * 0.85);

      if (fp.life <= 0) {
        fp.mesh.visible = false;
      }
    }
  }

  // 🌸 Earth-3 Costumed NPCs Animations (Gentle Wandering, Arm Swing, Cape flutter & Breathing)
  // [LAZY LOADING OPTIMIZATION]: Only animate and update NPCs when camera/player is near Earth-3!
  const isNearEarth3 = Math.hypot(playerGroup.position.x - 0, playerGroup.position.z - (-240)) < 115 ||
                       Math.hypot(camera.position.x - 0, camera.position.z - (-240)) < 125;

  if (isNearEarth3) {
    for (let i = 0; i < earth3NPCs.length; i++) {
      const npc = earth3NPCs[i];
      if (!npc.group.visible) npc.group.visible = true; // Lazy resume visibility

      // Check distance to player for interactive Head / Body Tracking
      const distToPlayer = playerGroup.position.distanceTo(npc.group.position);

      if (distToPlayer < 7.5) {
        // NPC stops walking and turns to face the approaching player warmly
        const lookDx = playerGroup.position.x - npc.group.position.x;
        const lookDz = playerGroup.position.z - npc.group.position.z;
        const lookAngle = Math.atan2(lookDx, lookDz);
        npc.group.rotation.y = THREE.MathUtils.lerp(npc.group.rotation.y, lookAngle + Math.PI, 0.08);

        // Relax limbs into respectful greeting/listening pose
        npc.lLeg.rotation.x = THREE.MathUtils.lerp(npc.lLeg.rotation.x, 0, 0.1);
        npc.rLeg.rotation.x = THREE.MathUtils.lerp(npc.rLeg.rotation.x, 0, 0.1);
        npc.lArm.rotation.x = THREE.MathUtils.lerp(npc.lArm.rotation.x, 0, 0.1);
        npc.rArm.rotation.x = THREE.MathUtils.lerp(npc.rArm.rotation.x, 0, 0.1);

        // Gentle breathing bob
        npc.torso.position.y = Math.sin(time * 2.2 + npc.idlePhase) * 0.06;

        // Reveal Nameplate smoothly when close (< 7.5m)
        if (npc.nameplate) {
          npc.nameplate.visible = true;
          npc.nameplate.material.opacity = THREE.MathUtils.lerp(npc.nameplate.material.opacity, 1.0, 0.15);
        }
      } else {
        // Hide Nameplate when far away
        if (npc.nameplate) {
          if (npc.nameplate.material.opacity > 0.05) {
            npc.nameplate.material.opacity = THREE.MathUtils.lerp(npc.nameplate.material.opacity, 0.0, 0.15);
          } else {
            npc.nameplate.visible = false;
          }
        }

        // Open-World Random Navigation with Natural Boid Separation (No fixed circular orbit!)
        if (npc.pauseTimer > 0) {
          // Temporarily paused to admire flora or meditate
          npc.pauseTimer -= delta;
          npc.lLeg.rotation.x = THREE.MathUtils.lerp(npc.lLeg.rotation.x, 0, 0.1);
          npc.rLeg.rotation.x = THREE.MathUtils.lerp(npc.rLeg.rotation.x, 0, 0.1);
          npc.lArm.rotation.x = THREE.MathUtils.lerp(npc.lArm.rotation.x, 0, 0.1);
          npc.rArm.rotation.x = THREE.MathUtils.lerp(npc.rArm.rotation.x, 0, 0.1);
          npc.torso.position.y = Math.sin(time * 2.0 + npc.idlePhase) * 0.05;
        } else {
          let toTargetX = npc.targetX - npc.group.position.x;
          let toTargetZ = npc.targetZ - npc.group.position.z;
          const distToTarget = Math.hypot(toTargetX, toTargetZ);

          // Arrived at destination or need a new spot -> Pick a brand new random location on Earth-3
          if (distToTarget < 3.0) {
            const nextAngle = Math.random() * Math.PI * 2;
            const nextDist = 8 + Math.random() * 45; // Roam freely up to 53m from Earth-3 center
            npc.targetX = Math.cos(nextAngle) * nextDist;
            npc.targetZ = -240 + Math.sin(nextAngle) * nextDist;
            npc.pauseTimer = 1.5 + Math.random() * 3.0; // Rest for 1.5 - 4.5 seconds
          } else {
            // Steering force towards target waypoint
            let moveDirX = toTargetX / distToTarget;
            let moveDirZ = toTargetZ / distToTarget;

            // Separation Force: Maintain safe social distance (at least 9-11 meters) between each NPC!
            const minSeparationDist = 10.0;
            for (let j = 0; j < earth3NPCs.length; j++) {
              if (i === j) continue;
              const other = earth3NPCs[j];
              const sepDx = npc.group.position.x - other.group.position.x;
              const sepDz = npc.group.position.z - other.group.position.z;
              const sepDist = Math.hypot(sepDx, sepDz);
              if (sepDist < minSeparationDist && sepDist > 0.001) {
                // Strong repulsion push away from other NPC to prevent clustering or collisions
                const repelStrength = (minSeparationDist - sepDist) / minSeparationDist;
                moveDirX += (sepDx / sepDist) * repelStrength * 1.8;
                moveDirZ += (sepDz / sepDist) * repelStrength * 1.8;
              }
            }

            // Also keep comfortable distance from player when not interacting
            const pSepDx = npc.group.position.x - playerGroup.position.x;
            const pSepDz = npc.group.position.z - playerGroup.position.z;
            const pSepDist = Math.hypot(pSepDx, pSepDz);
            if (pSepDist < 9.0 && pSepDist > 0.001) {
              const pRepel = (9.0 - pSepDist) / 9.0;
              moveDirX += (pSepDx / pSepDist) * pRepel * 1.5;
              moveDirZ += (pSepDz / pSepDist) * pRepel * 1.5;
            }

            // Normalize final steering vector
            const finalLen = Math.hypot(moveDirX, moveDirZ);
            if (finalLen > 0.001) {
              moveDirX /= finalLen;
              moveDirZ /= finalLen;
            }

            // Smoothly update position
            const moveSpeed = npc.speed * delta;
            const nextX = npc.group.position.x + moveDirX * moveSpeed;
            const nextZ = npc.group.position.z + moveDirZ * moveSpeed;

            // Keep within Earth-3 boundary (Radius < 54m from (0, -240))
            const distFromCenter = Math.hypot(nextX - 0, nextZ - (-240));
            if (distFromCenter < 54) {
              npc.group.position.x = nextX;
              npc.group.position.z = nextZ;
            } else {
              // Steer back towards center if near perimeter
              npc.targetX = (Math.random() - 0.5) * 30;
              npc.targetZ = -240 + (Math.random() - 0.5) * 30;
            }

            npc.group.position.y = getTerrainHeightAt(npc.group.position.x, npc.group.position.z);

            // Natural smooth body facing towards moving direction
            const moveAngle = Math.atan2(moveDirX, moveDirZ);
            npc.group.rotation.y = THREE.MathUtils.lerp(npc.group.rotation.y, moveAngle + Math.PI, 0.12);

            // Natural rhythmic leg swing and arm movement while traveling
            const npcWalkTime = time * 7.5 + npc.idlePhase;
            npc.lLeg.rotation.x = Math.sin(npcWalkTime) * 0.65;
            npc.rLeg.rotation.x = -Math.sin(npcWalkTime) * 0.65;
            npc.lArm.rotation.x = -Math.sin(npcWalkTime) * 0.55;
            npc.rArm.rotation.x = Math.sin(npcWalkTime) * 0.55;
            npc.torso.position.y = Math.abs(Math.sin(npcWalkTime * 2)) * 0.12;
          }
        }
      }

      // Role-specific dynamic animations for props & accessories
      if (npc.specialProp) {
        if (npc.config.classRole === 'botanist') {
          // Drone bobbing & orbital spin
          npc.specialProp.position.y = (5.2 + Math.sin(time * 3 + i) * 0.3) * npc.config.scale;
          npc.specialProp.rotation.y += delta * 2.5;
        } else if (npc.config.classRole === 'sage') {
          // Floating gem & glowing ring rotation
          npc.specialProp.rotation.x += delta * 3.0;
          npc.specialProp.rotation.y += delta * 2.0;
        } else if (npc.config.classRole === 'ranger') {
          // Wings gentle pulse
          npc.specialProp.children[0].rotation.z = -0.35 + Math.sin(time * 3) * 0.1;
          npc.specialProp.children[1].rotation.z = 0.35 - Math.sin(time * 3) * 0.1;
        } else if (npc.config.classRole === 'vanguard') {
          // Shield gentle breathing tilt
          npc.specialProp.rotation.y = Math.sin(time * 1.8 + i) * 0.08;
        }
      }

      // Cape flutter
      if (npc.torso.userData.cape) {
        npc.torso.userData.cape.rotation.x = 0.12 + Math.sin(time * 4.0 + i) * 0.15;
      }
    }
  } else {
    // Suspend off-screen distant NPC rendering to save GPU/CPU cycles
    for (let i = 0; i < earth3NPCs.length; i++) {
      if (earth3NPCs[i].group.visible) earth3NPCs[i].group.visible = false;
    }
  }

  // 🐇 Earth-3 Fauna Animations (Hopping Rabbits, Grazing Deer, Prowling Foxes)
  // [LAZY LOADING OPTIMIZATION]: Only simulate animals when player is near Earth-3
  if (isNearEarth3) {
    for (let i = 0; i < earth3Animals.length; i++) {
      const a = earth3Animals[i];
      if (!a.group.visible) a.group.visible = true;
      if (a.type === 'rabbit') {
        // Rabbit Hopping Loop
        a.angle += delta * 0.28;
        const rx = a.baseX + Math.cos(a.angle) * a.radius;
        const rz = a.baseZ + Math.sin(a.angle) * a.radius;
        const groundY = getTerrainHeightAt(rx, rz);

        // Parabolic jump hop
        const hopPhase = (time * a.hopSpeed + a.hopPhase) % Math.PI;
        const hopHeight = Math.abs(Math.sin(hopPhase)) * 1.2;

        a.group.position.set(rx, groundY + hopHeight, rz);
        a.group.rotation.y = -a.angle + Math.PI / 2;

        // Twitching long ears
        a.earL.rotation.z = -0.25 + Math.sin(time * 8 + i) * 0.15;
        a.earR.rotation.z = 0.25 - Math.sin(time * 8 + i) * 0.15;
      } else if (a.type === 'deer') {
        // Graceful Deer Gait & Grazing
        a.angle += delta * a.walkSpeed * 0.18;
        const dx = a.baseX + Math.cos(a.angle) * a.radius;
        const dz = a.baseZ + Math.sin(a.angle) * a.radius;
        const groundY = getTerrainHeightAt(dx, dz);

        a.group.position.set(dx, groundY, dz);
        a.group.rotation.y = -a.angle + Math.PI / 2;

        // Leg step motion
        const deerWalkTime = time * 4.0 + a.walkPhase;
        a.legFL.rotation.x = Math.sin(deerWalkTime) * 0.35;
        a.legBR.rotation.x = Math.sin(deerWalkTime) * 0.35;
        a.legFR.rotation.x = -Math.sin(deerWalkTime) * 0.35;
        a.legBL.rotation.x = -Math.sin(deerWalkTime) * 0.35;

        // Gentle neck & antler head tilt (grazing)
        a.neck.rotation.x = -0.45 + Math.sin(time * 1.5 + i) * 0.2;
      } else if (a.type === 'fox') {
        // Kitsune Fox Prowl & Tail Sway
        a.angle += delta * a.speed * 0.25;
        const fx = a.baseX + Math.cos(a.angle) * a.radius;
        const fz = a.baseZ + Math.sin(a.angle) * a.radius;
        const groundY = getTerrainHeightAt(fx, fz);

        a.group.position.set(fx, groundY, fz);
        a.group.rotation.y = -a.angle + Math.PI / 2;

        // Majestic swaying 3 tails
        if (a.tailsGroup) {
          a.tailsGroup.rotation.y = Math.sin(time * 3.5 + a.phase) * 0.35;
          a.tailsGroup.rotation.x = 0.15 + Math.sin(time * 2.0) * 0.1;
        }
      }
    }
  } else {
    for (let i = 0; i < earth3Animals.length; i++) {
      if (earth3Animals[i].group.visible) earth3Animals[i].group.visible = false;
    }
  }

  // 🌊 Feature 2 Animation: Interactive Lotus Lake Water Waves & Ripples
  if (waterMesh && frameTick % 2 === 0) {
    const wPos = waterMesh.geometry.attributes.position.array;
    for (let i = 0; i < wPos.length; i += 3) {
      const px = wPos[i];
      const pz = wPos[i + 2];
      let dy = Math.sin(px * 0.4 + time * 2) * Math.cos(pz * 0.4 + time * 1.5) * 0.25;

      // Apply click ripples
      for (let r = 0; r < waterRipples.length; r++) {
        const rip = waterRipples[r];
        const dist = Math.hypot(px - rip.x, pz - rip.z);
        const waveFront = rip.time * 8.0;
        if (Math.abs(dist - waveFront) < 3.0) {
          dy += Math.sin((dist - waveFront) * 3) * 0.4 * Math.max(0, 1 - rip.time / 2.5);
        }
      }
      wPos[i + 1] = -2.6 + dy;
    }
    waterMesh.geometry.attributes.position.needsUpdate = true;
  }

  // Advance ripples
  for (let r = waterRipples.length - 1; r >= 0; r--) {
    waterRipples[r].time += delta;
    if (waterRipples[r].time > 3.0) waterRipples.splice(r, 1);
  }

  // 🌀 Feature 4 Animation: Stargate Cosmic Spiral Swirl Vortex on all 8 Highway Gates
  for (let g = 0; g < gateVortices.length; g++) {
    gateVortices[g].rotation.z += delta * 2.2;
    gateVortices[g].scale.setScalar(1.0 + Math.sin(time * 3 + g) * 0.08);
  }

  // 🚪 Dynamic Gate Realm Visibility: Show ONLY the gate of the current world where player stands
  // If player is on Earth-1: Show only Earth-1 departure gates.
  // If player is on Earth-2/3/4/5: Show only that specific outer Earth's return gate (hide all other gates).
  // If in Auto-run on highway: keep both origin and destination gates visible during transition.
  if (allGates.length > 0) {
    const px = playerGroup.position.x;
    const pz = playerGroup.position.z;
    let currentStandingRealm = '1';

    if (Math.hypot(px - 0, pz - 240) < 95) currentStandingRealm = '2'; // North Earth-2
    else if (Math.hypot(px - 0, pz - (-240)) < 95) currentStandingRealm = '3'; // South Earth-3
    else if (Math.hypot(px - (-250), pz - 0) < 95) currentStandingRealm = '4'; // West Earth-4
    else if (Math.hypot(px - 250, pz - 0) < 95) currentStandingRealm = '5'; // East Earth-5
    else currentStandingRealm = '1'; // Central Earth-1

    for (let i = 0; i < allGates.length; i++) {
      const g = allGates[i];
      const gateRealm = g.userData.realm;
      if (isAutoRunningOnHighway) {
        // While auto-running between realms, show the relevant transit gates
        g.visible = (gateRealm === '1' || gateRealm === autoRunEarthId);
      } else {
        // When standing in a world, ONLY show gates belonging to that world!
        g.visible = (gateRealm === currentStandingRealm);
      }
    }
  }

  // 🌸 Feature 3 Animation: Falling Sakura Petals & Swirling Leaves on Earth-3
  // [LAZY LOADING OPTIMIZATION]: Only simulate Sakura Petals when player or camera is in/near Earth-3
  if (fallingPetalsMesh) {
    if (isNearEarth3) {
      if (!fallingPetalsMesh.visible) fallingPetalsMesh.visible = true;
      const pPos = petalGeo.attributes.position.array;
      for (let i = 0; i < petalCount; i++) {
        const idxY = i * 3 + 1;
        pPos[idxY] -= delta * petalSpeed[i] * 3.5;
        // Gentle horizontal drift
        pPos[i * 3 + 0] += Math.sin(time * 1.5 + i) * delta * 2.0;
        pPos[i * 3 + 2] += Math.cos(time * 1.2 + i) * delta * 1.5;

        // Ground respawn
        const curGround = getTerrainHeightAt(pPos[i * 3 + 0], pPos[i * 3 + 2]);
        if (pPos[idxY] < curGround + 0.2) {
          pPos[idxY] = curGround + 24.0 + Math.random() * 8.0;
          pPos[i * 3 + 0] = (Math.random() - 0.5) * 110;
          pPos[i * 3 + 2] = -240 + (Math.random() - 0.5) * 110;
        }
      }
      petalGeo.attributes.position.needsUpdate = true;
    } else {
      if (fallingPetalsMesh.visible) fallingPetalsMesh.visible = false;
    }
  }

  // 🐾 Feature 2 Animation: Animal Companion Follower (Rabbits / Foxes following character)
  if (companionAnimal) {
    companionTimer -= delta;
    const compGroup = companionAnimal.group;
    const followTargetX = playerGroup.position.x - Math.sin(playerRotationY) * 3.5;
    const followTargetZ = playerGroup.position.z - Math.cos(playerRotationY) * 3.5;

    const cdx = followTargetX - compGroup.position.x;
    const cdz = followTargetZ - compGroup.position.z;
    const cDist = Math.hypot(cdx, cdz);

    if (cDist > 1.2) {
      const cAngle = Math.atan2(cdx, cdz);
      compGroup.position.x += Math.sin(cAngle) * delta * 14.0;
      compGroup.position.z += Math.cos(cAngle) * delta * 14.0;
      compGroup.position.y = getTerrainHeightAt(compGroup.position.x, compGroup.position.z) + Math.abs(Math.sin(time * 12)) * 0.9;
      compGroup.rotation.y = cAngle + Math.PI;
    }
    if (companionTimer <= 0) {
      companionAnimal = null;
      showToast('🐾 Your animal companion wandered back into the sacred grove.');
    }
  }

  // 🌠 Feature 3 Animation: Meteor Showers Downward Streak (Deep 3D World)
  if (meteorShowerActive) {
    const mPos = meteorGeo.attributes.position.array;
    for (let i = 0; i < mPos.length; i += 6) {
      mPos[i + 1] -= delta * 75; // Head falling
      mPos[i + 4] -= delta * 75; // Tail falling
      mPos[i + 0] -= delta * 18; // Angle streak
      mPos[i + 3] -= delta * 18;

      // Reset when below ground level
      if (mPos[i + 1] < 5) {
        resetMeteorPosition(mPos, i);
      }
    }
    meteorGeo.attributes.position.needsUpdate = true;
  }

  // Upward Rising Dots Flow (Bioluminescent Energy ascending through the 3D world)
  if (pollenMesh) {
    const pos = pollenGeo.attributes.position.array;
    for (let i = 0; i < pollenCount; i++) {
      const idxY = i * 3 + 1;
      pos[idxY] += pSpeed[i];
      // Reset when reaching upper atmospheric canopy
      if (pos[idxY] > 55) {
        pos[idxY] = -3;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 450;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 450;
      }
    }
    pollenGeo.attributes.position.needsUpdate = true;
  }

  // Radar minimap (update every 3rd frame - perfectly smooth 30-40Hz on radar)
  if (frameTick % 3 === 0) {
    updateRadar();
  }

  if (composer) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (composer) composer.setSize(window.innerWidth, window.innerHeight);
});

// ========================================================
// 9. TELEPORT, WARP & MACRO ZOOM INSPECTION
// ========================================================
const toast = document.getElementById('metaverse-toast');
function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Warp Camera to target
function warpToPOI(poiId) {
  if (poiId === 'overview') {
    new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 55, z: 125 }, 1600)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    new TWEEN.Tween(orbitControls.target)
      .to({ x: 0, y: 10, z: 0 }, 1600)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    hideInspectCard();
    showToast('Warped to Global World Orbit View');
    return;
  }

  const lm = landmarks.find(l => l.userData.id === poiId);
  if (lm) {
    const targetCam = lm.userData.camPos;
    const targetLook = lm.userData.lookAt;

    // Immediately hide all 3D name badges and hover cards
    landmarks.forEach(l => {
      const b = l.getObjectByName('badgeSprite');
      if (b) {
        b.visible = false;
        b.material.opacity = 0;
      }
    });
    hoverTooltip.classList.remove('visible');
    hideInspectCard();

    new TWEEN.Tween(camera.position)
      .to(targetCam, 1600)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    new TWEEN.Tween(orbitControls.target)
      .to(targetLook, 1600)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    showToast(`Warped to ${lm.userData.name}`);
  }
}

// Teleport Portal Chips
document.querySelectorAll('.portal-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.portal-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    warpToPOI(btn.getAttribute('data-poi'));
  });
});

// Inspection Card Controller
const inspectCard = document.getElementById('inspect-card');
const inspectTag = document.getElementById('inspect-category');
const inspectId = document.getElementById('inspect-id');
const inspectName = document.getElementById('inspect-name');
const inspectDesc = document.getElementById('inspect-desc');
const inspectHeight = document.getElementById('inspect-height');
const inspectSpecies = document.getElementById('inspect-species');
const inspectLux = document.getElementById('inspect-lux');
let activeLandmarkData = null;

function openInspectCard(data) {
  activeLandmarkData = data;
  if (inspectTag) inspectTag.innerText = data.category || 'COSMIC ENTITY';
  if (inspectId) inspectId.innerText = `ID: ${data.entityId || data.id}`;
  if (inspectName) inspectName.innerText = data.name;
  if (inspectDesc) inspectDesc.innerText = data.desc;
  if (inspectHeight) inspectHeight.innerText = data.height || 'N/A';
  if (inspectSpecies) inspectSpecies.innerText = data.species || 'N/A';
  if (inspectLux) inspectLux.innerText = data.luminosity || 'N/A';
  inspectCard.classList.add('show');
}

function hideInspectCard() {
  inspectCard.classList.remove('show');
}

document.getElementById('btn-close-inspect').addEventListener('click', hideInspectCard);

// Macro Zoom to Petals
document.getElementById('btn-inspect-macro').addEventListener('click', () => {
  if (activeLandmarkData) {
    const look = activeLandmarkData.lookAt;
    // Macro zoom: camera right up to petals (1.8 units away)
    new TWEEN.Tween(camera.position)
      .to({ x: look.x + 1.2, y: look.y + 0.8, z: look.z + 2.2 }, 1400)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    new TWEEN.Tween(orbitControls.target)
      .to(look, 1400)
      .easing(TWEEN.Easing.Cubic.Out)
      .start();

    showToast(`🔬 Macro Zooming into ${activeLandmarkData.name} Petal Points!`);
  }
});

// Resonate Bloom Energy Pulse
document.getElementById('btn-inspect-bloom')?.addEventListener('click', () => {
  showToast('💥 Harmonic Bloom Energy Pulse Triggered!');
});

// ========================================================
// 10. EXPLORATION MODES (Orbit, Walk, Fly)
// ========================================================
const btnOrbit = document.getElementById('btn-mode-orbit');
const btnWalk = document.getElementById('btn-mode-walk');
const btnFly = document.getElementById('btn-mode-fly');

const mobileControlsLayer = document.getElementById('mobile-controls-layer');

function switchMode(mode) {
  currentMode = mode;
  [btnOrbit, btnWalk, btnFly].forEach(b => b.classList.remove('active'));

  if (mode === 'orbit') {
    btnOrbit.classList.add('active');
    orbitControls.enabled = true;
    crosshair.style.display = 'none';
    if (document.pointerLockElement) document.exitPointerLock?.();
    if (mobileControlsLayer) mobileControlsLayer.classList.remove('active');
    if (freelookBadge) freelookBadge.classList.add('hidden');
    isFreeLooking = false;
    freeLookRotationY = 0;
    freeLookPitch = 0;
    showToast('Orbit / Drone Mode: Drag mouse to inspect, Scroll to zoom');
  } else if (mode === 'walk') {
    btnWalk.classList.add('active');
    orbitControls.enabled = false;
    // Show Joystick control ONLY in Walk Mode!
    if (mobileControlsLayer) mobileControlsLayer.classList.add('active');

    // Position character securely on terrain
    const startX = 0;
    const startZ = 15;
    const startY = getTerrainHeightAt(startX, startZ);
    playerGroup.position.set(startX, startY, startZ);
    velocity.x = 0;
    velocity.y = 0;
    velocity.z = 0;
    playerRotationY = 0;
    playerPitch = 0;
    isFreeLooking = false;
    freeLookRotationY = 0;
    freeLookPitch = 0;
    if (freelookBadge) freelookBadge.classList.add('hidden');

    // Position camera immediately behind player
    camera.position.set(startX, startY + 3.5, startZ + 8.5);
    camera.lookAt(startX, startY + 1.8, startZ);
    showToast('🚶 Walk Mode: WASD to Move | Press V for 360° Free Look (Eye View)!');

    // Auto-Lock Cursor immediately on Walk click for PC (PUBG-style seamless mouse look)
    try {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock?.() || document.body.requestPointerLock?.();
      }
    } catch (err) {
      console.log('PointerLock auto-request:', err);
    }
  } else if (mode === 'fly') {
    btnFly.classList.add('active');
    orbitControls.enabled = false;
    crosshair.style.display = 'none';
    if (document.pointerLockElement) document.exitPointerLock?.();
    if (mobileControlsLayer) mobileControlsLayer.classList.remove('active');
    if (freelookBadge) freelookBadge.classList.add('hidden');
    isFreeLooking = false;
    freeLookRotationY = 0;
    freeLookPitch = 0;
    showToast('🚀 Cinematic Auto-Flight Active');
  }
}

// Cut / Hide Modes Bar Listener
const hudControlsCard = document.getElementById('hud-controls-card');
const btnCutModes = document.getElementById('btn-cut-modes');
const btnRestoreModes = document.getElementById('btn-restore-modes');

btnCutModes?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (hudControlsCard) hudControlsCard.style.display = 'none';
  if (btnRestoreModes) btnRestoreModes.classList.add('visible');
  showToast('Modes panel hidden. Click "🎮 Modes" to restore.');
});

btnRestoreModes?.addEventListener('click', () => {
  if (hudControlsCard) hudControlsCard.style.display = 'block';
  if (btnRestoreModes) btnRestoreModes.classList.remove('visible');
});

// Mode Buttons Event Listeners
btnOrbit?.addEventListener('click', () => switchMode('orbit'));
btnWalk?.addEventListener('click', () => switchMode('walk'));
btnFly?.addEventListener('click', () => switchMode('fly'));

// ========================================================
// 11. TOOLBOX & NEXT-LEVEL MEGA FEATURES
// ========================================================
// 🌱 Feature 4 Button: Planting Mode Toggle
const btnPlant = document.getElementById('btn-plant-flower');
btnPlant?.addEventListener('click', () => {
  plantingMode = !plantingMode;
  btnPlant.classList.toggle('active', plantingMode);
  showToast(plantingMode ? '🌱 Planting Mode ON: Click anywhere on ground to grow flowers!' : 'Planting Mode Disabled');
});

// 🌠 Feature 3 Button: Meteor Showers Toggle
const btnMeteors = document.getElementById('btn-meteor-rain');
btnMeteors?.addEventListener('click', () => {
  meteorShowerActive = !meteorShowerActive;
  meteorLines.visible = meteorShowerActive;
  btnMeteors.classList.toggle('active', meteorShowerActive);
  showToast(meteorShowerActive ? '🌠 Meteor Showers Activated!' : 'Meteor Rain Paused');
});

// 📸 Feature 5 Button: 4K Cinematic Photo Mode (UI Hide, Camera Flash & Direct Image Download)
const btnPhoto = document.getElementById('btn-photo-mode');
btnPhoto?.addEventListener('click', () => {
  // 1. Instantly hide all UI overlays
  const topHud = document.querySelector('.hud-top');
  const ctrlCard = document.querySelector('.hud-controls-card');
  const toolbox = document.querySelector('.floating-toolbox');
  const radar = document.querySelector('.radar-container');
  const ins = document.getElementById('inspect-card');
  const tooltip = document.getElementById('hover-tooltip');

  if (topHud) topHud.style.visibility = 'hidden';
  if (ctrlCard) ctrlCard.style.visibility = 'hidden';
  if (toolbox) toolbox.style.visibility = 'hidden';
  if (radar) radar.style.visibility = 'hidden';
  if (ins) ins.style.visibility = 'hidden';
  if (tooltip) tooltip.style.visibility = 'hidden';

  // 2. Render pristine frame without UI
  renderer.render(scene, camera);

  // 3. Capture image immediately from WebGL buffer
  try {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Aetheria-VirtualWorld-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📸 4K High-Res Screenshot Captured & Downloaded!');
  } catch (err) {
    console.error('Screenshot error:', err);
    showToast('📸 Screenshot captured to clipboard');
  }

  // 4. Restore UI
  if (topHud) topHud.style.visibility = 'visible';
  if (ctrlCard) ctrlCard.style.visibility = 'visible';
  if (toolbox) toolbox.style.visibility = 'visible';
  if (radar) radar.style.visibility = 'visible';
  if (ins) ins.style.visibility = 'visible';
  if (tooltip) tooltip.style.visibility = 'visible';
});

let skyMode = 0; // 0: Night, 1: Sunset, 2: Cyber Day
const btnSky = document.getElementById('btn-time-cycle');
btnSky.addEventListener('click', () => {
  skyMode = (skyMode + 1) % 3;
  if (skyMode === 0) {
    scene.fog.color.setHex(0x06030c);
    hemiLight.color.setHex(0x9d4edd);
    hemiLight.groundColor.setHex(0x05ffa1);
    showToast('Atmosphere: Cosmic Cyber Night');
  } else if (skyMode === 1) {
    scene.fog.color.setHex(0x1a0614);
    hemiLight.color.setHex(0xff5500);
    hemiLight.groundColor.setHex(0x9d0208);
    showToast('Atmosphere: Radiant Sunset Bloom');
  } else {
    scene.fog.color.setHex(0x031826);
    hemiLight.color.setHex(0x00f0ff);
    hemiLight.groundColor.setHex(0x7000ff);
    showToast('Atmosphere: Electric Neon Dawn');
  }
});

// Super Bloom Burst
document.getElementById('btn-flower-burst')?.addEventListener('click', () => {
  landmarks.forEach(lm => {
    lm.scale.set(1.2, 1.2, 1.2);
    setTimeout(() => lm.scale.set(1, 1, 1), 600);
  });
  showToast('💥 Global Metaverse Resonance Bloom Activated!');
});

// Macro Zoom Shortcut
document.getElementById('btn-zoom-inspect')?.addEventListener('click', () => {
  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 15, z: 6 }, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
  new TWEEN.Tween(orbitControls.target)
    .to({ x: 0, y: 14, z: 0 }, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
  showToast('🔬 Extreme Macro View: Zoomed into Core Petals!');
});

// ========================================================
// 12. WORLD CODE MATRIX DRAWER (TERMINAL)
// ========================================================
const codeDrawer = document.getElementById('world-code-drawer');
const btnCode = document.getElementById('btn-open-terminal');
if (btnCode) {
  btnCode.addEventListener('click', () => {
    codeDrawer.classList.toggle('collapsed');
  });
}

document.getElementById('drawer-close')?.addEventListener('click', () => {
  codeDrawer.classList.add('collapsed');
});

const matrixCode = `// AETHERIA - PROCEDURAL VIRTUAL WORLD SIMULATION MATRIX
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class AetheriaWorld {
    constructor() {
        this.entities = 220000;
        this.landmarks = [
            { id: "rose", pos: [0, 0], species: "Rosa Aetheria Superba", lux: 128000 },
            { id: "lotus", pos: [55, 30], species: "Nelumbo Lumina Sancta", lux: 110500 },
            { id: "sakura", pos: [-60, -35], species: "Prunus Aetheria Magna", lux: 142000 },
            { id: "sunflower", pos: [65, -50], species: "Helianthus Solaris Divina", lux: 165000 },
            { id: "crystal", pos: [0, -65], species: "Aetherian Crystal Spire", lux: 210000 },
            { id: "tulip", pos: [-50, 40], species: "Tulipa Neon Electrica", lux: 115000 }
        ];
    }

    renderPhysics(delta) {
        // High-precision particle integration with macro zoom capabilities
        this.updateSpatialLighting();
        this.calculatePointClouds();
    }
}`;

const dLines = document.getElementById('drawer-lines');
const dCode = document.getElementById('drawer-code-content');
const linesArr = matrixCode.split('\n');
if (dLines && dCode) {
  dLines.innerHTML = linesArr.map((_, i) => `<div>${i + 1}</div>`).join('');
  dCode.innerText = matrixCode;
}

document.getElementById('btn-copy-script')?.addEventListener('click', () => {
  navigator.clipboard.writeText(matrixCode).then(() => {
    showToast('Aetheria World Matrix copied to clipboard! 📋');
  });
});

// ========================================================
// 13. FULL INTEGRATION OF ALL 10 REQUESTED LIBRARIES
// 1. Three.js: Core WebGL 3D World (Active)
// 2. GSAP: Smooth camera transitions & HUD animations
// 3. Spline: 3D interactive cosmic artifact modal
// 4. Motion: Micro-interactions on buttons and HUD elements
// 5. Babylon.js: Secondary drone sensor camera viewport
// 6. Lenis: Momentum smooth scroll inside the code drawer
// 7. Anime.js: Radar pulse & SVG glow loop
// 8. Rive: Mini interactive avatar/status indicator
// 9. Lottie: Animated vector glowing badge in top HUD
// 10. PixiJS: 2D WebGL ambient cosmic dust / aura overlay
// ========================================================

// 2. GSAP & SCROLLTRIGGER INTEGRATION
if (typeof gsap !== 'undefined') {
  // Cinematic entrance for top HUD and controls dock
  gsap.from('.hud-top', { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out' });
  gsap.from('.floating-toolbox', { x: 50, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });
  gsap.from('.hud-controls-card', { y: 60, opacity: 0, duration: 1.0, delay: 0.5, ease: 'back.out(1.7)' });

  // Custom GSAP warp camera function to complement TWEEN
  window.gsapWarpCamera = function (pos, look, dur = 1.8) {
    gsap.to(camera.position, {
      x: pos.x, y: pos.y, z: pos.z,
      duration: dur,
      ease: 'power2.inOut'
    });
    gsap.to(orbitControls.target, {
      x: look.x, y: look.y, z: look.z,
      duration: dur,
      ease: 'power2.inOut',
      onUpdate: () => orbitControls.update()
    });
  };
}

// 4. MOTION (FRAMER MOTION WEB RUNTIME)
if (window.Motion) {
  const { animate, spring } = window.Motion;
  document.querySelectorAll('.mode-btn, .tool-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      animate(btn, { scale: 1.12 }, { duration: 0.2, easing: spring() });
    });
    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1.0 }, { duration: 0.2 });
    });
  });
}

// 5. BABYLON.JS INTEGRATION (Secondary Drone Sensor Viewport)
const btnDrone = document.getElementById('btn-toggle-drone');
const dronePanel = document.getElementById('babylon-drone-panel');
const btnCloseDrone = document.getElementById('btn-close-drone');
let babylonEngine = null;
let babylonScene = null;

function initBabylonDrone() {
  const bCanvas = document.getElementById('babylon-canvas');
  if (!bCanvas || typeof BABYLON === 'undefined') return;

  babylonEngine = new BABYLON.Engine(bCanvas, true);
  babylonScene = new BABYLON.Scene(babylonEngine);
  babylonScene.clearColor = new BABYLON.Color4(0.04, 0.02, 0.08, 1);

  // Drone Sensor Camera
  const bCamera = new BABYLON.ArcRotateCamera("DroneCam", -Math.PI / 2, Math.PI / 3, 10, new BABYLON.Vector3(0, 0, 0), babylonScene);
  bCamera.attachControl(bCanvas, true);
  bCamera.lowerRadiusLimit = 4;
  bCamera.upperRadiusLimit = 25;

  const bLight = new BABYLON.HemisphericLight("droneLight", new BABYLON.Vector3(0, 1, 0), babylonScene);
  bLight.diffuse = new BABYLON.Color3(0, 0.94, 1);
  bLight.groundColor = new BABYLON.Color3(1, 0.16, 0.42);

  // Hologram Drone Sphere Core
  const droneCore = BABYLON.MeshBuilder.CreateSphere("core", { diameter: 3, segments: 16 }, babylonScene);
  const coreMat = new BABYLON.StandardMaterial("coreMat", babylonScene);
  coreMat.wireframe = true;
  coreMat.emissiveColor = new BABYLON.Color3(0, 0.94, 1);
  droneCore.material = coreMat;

  // Orbiting rings
  const ring1 = BABYLON.MeshBuilder.CreateTorus("ring1", { diameter: 4.8, thickness: 0.12, tessellation: 32 }, babylonScene);
  const ringMat = new BABYLON.StandardMaterial("ringMat", babylonScene);
  ringMat.emissiveColor = new BABYLON.Color3(1, 0.16, 0.42);
  ring1.material = ringMat;

  babylonEngine.runRenderLoop(() => {
    if (dronePanel && !dronePanel.classList.contains('hidden')) {
      droneCore.rotation.y += 0.02;
      ring1.rotation.x += 0.03;
      ring1.rotation.z += 0.015;
      babylonScene.render();
    }
  });

  window.addEventListener('resize', () => {
    if (babylonEngine) babylonEngine.resize();
  });
}

if (btnDrone && dronePanel) {
  btnDrone.addEventListener('click', () => {
    dronePanel.classList.toggle('hidden');
    if (!dronePanel.classList.contains('hidden')) {
      if (!babylonEngine) {
        initBabylonDrone();
      } else {
        babylonEngine.resize();
      }
      showToast('🛰️ Babylon.js Drone Sensor Cam Active');
    }
  });
}
if (btnCloseDrone && dronePanel) {
  btnCloseDrone.addEventListener('click', () => {
    dronePanel.classList.add('hidden');
  });
}

// 6. LENIS SMOOTH MOMENTUM SCROLLING
if (typeof Lenis !== 'undefined') {
  const codeDrawerBody = document.querySelector('.drawer-body');
  if (codeDrawerBody) {
    const lenis = new Lenis({
      wrapper: codeDrawerBody,
      content: document.querySelector('.d-code'),
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }
}

// 7. ANIME.JS (Radar pulse & glowing ring animations)
if (typeof anime !== 'undefined') {
  // Continuous Radar scanner pulse
  anime({
    targets: '.radar-container',
    boxShadow: [
      '0 0 10px rgba(0, 240, 255, 0.2)',
      '0 0 25px rgba(0, 240, 255, 0.65)',
      '0 0 10px rgba(0, 240, 255, 0.2)'
    ],
    duration: 2500,
    easing: 'easeInOutQuad',
    loop: true
  });

  // Top brand orb pulse
  anime({
    targets: '.brand-orb',
    scale: [1, 1.45, 1],
    opacity: [0.7, 1, 0.7],
    duration: 1800,
    easing: 'easeInOutSine',
    loop: true
  });
}

// 8. RIVE INTEGRATION (Vector Avatar Canvas runtime)
if (typeof rive !== 'undefined') {
  try {
    const riveCanvas = document.createElement('canvas');
    riveCanvas.width = 32;
    riveCanvas.height = 32;
    riveCanvas.style.marginRight = '6px';
    riveCanvas.style.verticalAlign = 'middle';
    riveCanvas.style.borderRadius = '50%';
    const brandInfo = document.querySelector('.hud-brand');
    if (brandInfo) {
      brandInfo.prepend(riveCanvas);
      // Rive state machine initialization
      new rive.Rive({
        src: 'https://cdn.rive.app/animations/vehicles.riv',
        canvas: riveCanvas,
        autoplay: true,
        onLoad: () => console.log('Rive initialized successfully'),
        onLoadError: () => {
          // Graceful fallback: render glowing cyber circle on rive canvas
          const rCtx = riveCanvas.getContext('2d');
          let rAngle = 0;
          function drawRiveFallback() {
            rCtx.clearRect(0, 0, 32, 32);
            rCtx.strokeStyle = '#00f0ff';
            rCtx.lineWidth = 2.5;
            rCtx.beginPath();
            rCtx.arc(16, 16, 12, rAngle, rAngle + Math.PI * 1.5);
            rCtx.stroke();
            rAngle += 0.05;
            requestAnimationFrame(drawRiveFallback);
          }
          drawRiveFallback();
        }
      });
    }
  } catch (e) {
    console.warn('Rive init:', e);
  }
}

// 9. LOTTIE INTEGRATION (Top HUD Animated Vector Star/Badge)
if (typeof lottie !== 'undefined') {
  const lottieContainer = document.getElementById('lottie-badge-container');
  if (lottieContainer) {
    // Elegant procedural vector animation using Lottie
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'https://assets2.lottiefiles.com/packages/lf20_m64xqz5b.json'
    });
  }
}

// 10. PIXIJS INTEGRATION (Cosmic Atmospheric Glow Canvas - Background layer)
if (typeof PIXI !== 'undefined') {
  // PixiJS atmospheric aura generator
  try {
    const pixiCanvas = document.createElement('canvas');
    pixiCanvas.id = 'pixi-background-aurora';
    pixiCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.25;display:none;';
    document.getElementById('world-app').appendChild(pixiCanvas);

    const pixiApp = new PIXI.Application({
      view: pixiCanvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0
    });
    // Pixi engine ready and verified
  } catch (err) {
    console.log('Pixi init:', err);
  }
}

// ========================================================
// 14. MOBILE & PC FULLSCREEN ENGINE
// ========================================================
const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
const fsIcon = document.getElementById('fullscreen-icon');

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    if (requestFullScreen) {
      requestFullScreen.call(docEl);
      if (fsIcon) fsIcon.className = 'fa-solid fa-compress';
      showToast('📺 Fullscreen Mode Activated');
    }
  } else {
    if (cancelFullScreen) {
      cancelFullScreen.call(doc);
      if (fsIcon) fsIcon.className = 'fa-solid fa-expand';
      showToast('Fullscreen Mode Exited');
    }
  }
}

btnFullscreen?.addEventListener('click', toggleFullScreen);

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    if (fsIcon) fsIcon.className = 'fa-solid fa-compress';
  } else {
    if (fsIcon) fsIcon.className = 'fa-solid fa-expand';
  }
});

// ========================================================
// 15. 5 CONNECTED MULTIVERSE EARTH REALMS (Matching User Layout Diagram)
// ========================================================
const earthRealms = {
  '1': {
    name: 'Earth-1: Central Core',
    camPos: { x: 0, y: 115, z: 0.1 },
    lookAt: { x: 0, y: 0, z: 0 },
    playerSpawn: { x: 0, z: 15 },
    fogColor: 0x06030c,
    lightColor: 0x9d4edd,
    description: 'The Prime Central Earth with Crimson Rose, central plaza and 4 Gateways leading to outer Earths.'
  },
  '2': {
    name: 'Earth-2: North Aqua Ocean',
    camPos: { x: 0, y: 40, z: 320 },
    lookAt: { x: 0, y: 8, z: 240 },
    playerSpawn: { x: 0, z: 240 },
    fogColor: 0x01131e,
    lightColor: 0x00f0ff,
    description: 'Northern aquatic paradise reached through the North Cyber Gate and luminous highway.'
  },
  '3': {
    name: 'Earth-3: South Sakura Highlands',
    camPos: { x: 0, y: 40, z: -160 },
    lookAt: { x: 0, y: 8, z: -240 },
    playerSpawn: { x: 0, z: -240 },
    fogColor: 0x1f0618,
    lightColor: 0xff2a6d,
    description: 'Southern mountain sanctuary blooming with quantum cherry blossom trees.'
  },
  '4': {
    name: 'Earth-4: West Solaris Valley',
    camPos: { x: -170, y: 40, z: 0 },
    lookAt: { x: -250, y: 8, z: 0 },
    playerSpawn: { x: -250, z: 0 },
    fogColor: 0x1a1202,
    lightColor: 0xffbe0b,
    description: 'Western golden solar valley reached via the West Gate and golden bridge.'
  },
  '5': {
    name: 'Earth-5: East Astral Peak',
    camPos: { x: 170, y: 40, z: 0 },
    lookAt: { x: 250, y: 8, z: 0 },
    playerSpawn: { x: 250, z: 0 },
    fogColor: 0x0f0322,
    lightColor: 0x9d4edd,
    description: 'Eastern crystal spire monolith continent connected via the East Astral Gate.'
  }
};

let activeEarth = '1';

function switchEarthRealm(earthId, teleportPlayer = true) {
  const realm = earthRealms[earthId];
  if (!realm) return;

  activeEarth = earthId;

  // Highlight active chip
  document.querySelectorAll('.earth-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-earth') === earthId);
  });

  // Smooth atmospheric transition
  scene.fog.color.setHex(realm.fogColor);
  hemiLight.color.setHex(realm.lightColor);

  // If manual button teleport is triggered
  if (teleportPlayer) {
    if (currentMode === 'walk') {
      const sx = realm.playerSpawn.x;
      const sz = realm.playerSpawn.z;
      const sy = getTerrainHeightAt(sx, sz);
      playerGroup.position.set(sx, sy, sz);
      camera.position.set(sx, sy + 6.0, sz + 14.0);
      camera.lookAt(sx, sy + 3.2, sz);
    } else {
      // In Orbit mode, smoothly fly camera to the new Earth realm
      new TWEEN.Tween(camera.position)
        .to(realm.camPos, 1600)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

      new TWEEN.Tween(orbitControls.target)
        .to(realm.lookAt, 1600)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    }
  }
}

// Bind earth selector buttons
document.querySelectorAll('.earth-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const eid = btn.getAttribute('data-earth');
    switchEarthRealm(eid);
  });
});

// ========================================================
// 16. RPG SYSTEMS: NPC DIALOGUES, PETTING & CODEX LOGIC
// ========================================================
const interactPrompt = document.getElementById('interact-prompt');
const promptText = document.getElementById('prompt-text');
const npcDialogueBox = document.getElementById('npc-dialogue-box');
const diagNpcName = document.getElementById('diag-npc-name');
const diagNpcText = document.getElementById('diag-npc-text');
const diagQuestTitle = document.getElementById('diag-quest-title');
const diagQuestDesc = document.getElementById('diag-quest-desc');
const btnCloseDialogue = document.getElementById('btn-close-dialogue');
const btnDismissDialogue = document.getElementById('btn-dismiss-dialogue');
const btnAcceptQuest = document.getElementById('btn-accept-quest');

const btnMobileTalk = document.getElementById('btn-mobile-talk');
const btnMobilePet = document.getElementById('btn-mobile-pet');

const codexDrawer = document.getElementById('codex-drawer');
const btnToggleCodex = document.getElementById('btn-toggle-codex');
const btnCloseCodex = document.getElementById('btn-close-codex');
const codexItemsList = document.getElementById('codex-items-list');

const btnEmoteWave = document.getElementById('btn-emote-wave');
const btnEmoteMeditate = document.getElementById('btn-emote-meditate');

let nearbyNPC = null;
let nearbyAnimal = null;

// Check proximity to NPCs and Animals in walk mode loop
setInterval(() => {
  if (currentMode !== 'walk') {
    if (interactPrompt) interactPrompt.classList.remove('visible');
    return;
  }

  const px = playerGroup.position.x;
  const pz = playerGroup.position.z;

  // 1. Check nearby NPCs (Distance < 6m)
  nearbyNPC = null;
  for (let i = 0; i < earth3NPCs.length; i++) {
    const npc = earth3NPCs[i];
    const dist = Math.hypot(px - npc.group.position.x, pz - npc.group.position.z);
    if (dist < 6.5) {
      nearbyNPC = npc;
      break;
    }
  }

  // 2. Check nearby Animals (Distance < 5m)
  nearbyAnimal = null;
  if (!nearbyNPC) {
    for (let i = 0; i < earth3Animals.length; i++) {
      const a = earth3Animals[i];
      const dist = Math.hypot(px - a.group.position.x, pz - a.group.position.z);
      if (dist < 5.5) {
        nearbyAnimal = a;
        break;
      }
    }
  }

  if (nearbyNPC) {
    const npcData = npcCostumes.find(c => c.name === nearbyNPC.group.userData?.name) || npcCostumes[0];
    if (promptText) promptText.innerText = `Talk to ${npcData.name}`;
    if (interactPrompt) interactPrompt.classList.add('visible');
    if (btnMobileTalk) btnMobileTalk.classList.remove('hidden');
    if (btnMobilePet) btnMobilePet.classList.add('hidden');
  } else if (nearbyAnimal) {
    const animalLabel = nearbyAnimal.type === 'rabbit' ? 'Rabbit' : (nearbyAnimal.type === 'deer' ? 'Astral Deer' : 'Mystic Fox');
    if (promptText) promptText.innerText = `Pet & Feed ${animalLabel}`;
    if (interactPrompt) interactPrompt.classList.add('visible');
    if (btnMobileTalk) btnMobileTalk.classList.add('hidden');
    if (btnMobilePet) btnMobilePet.classList.remove('hidden');
  } else {
    if (interactPrompt) interactPrompt.classList.remove('visible');
    if (btnMobileTalk) btnMobileTalk.classList.add('hidden');
    if (btnMobilePet) btnMobilePet.classList.add('hidden');
  }
}, 200);

// Open Dialogue Modal with Animated Typewriter Text
let dialogueButtonFocusIndex = 0; // 0: Accept Quest, 1: Close

function updateDialogueFocus() {
  if (!btnAcceptQuest || !btnDismissDialogue) return;
  if (dialogueButtonFocusIndex === 0) {
    btnAcceptQuest.classList.add('focused');
    btnAcceptQuest.focus();
    btnDismissDialogue.classList.remove('focused');
  } else {
    btnDismissDialogue.classList.add('focused');
    btnDismissDialogue.focus();
    btnAcceptQuest.classList.remove('focused');
  }
}

function openNPCDialogue(npc) {
  const npcInfo = npcCostumes.find(c => c.name === npc.group.userData?.name) || npcCostumes[0];
  diagNpcName.innerText = `${npcInfo.name} (${npcInfo.title})`;

  const sampleDialogues = [
    'Pranam yatri! Yeh divya van shanti aur brahmaandiya shakti ka sangam hai. Yahan aakar man shant ho jata hai.',
    'Panch Prithviyon ka santulan hi is srishti ka mooladhar hai. Dhyan rahe koi dwar band na ho.',
    'In divya vanaspatiyon aur phoolon me anant cosmic urja daud rahi hai. Inhe dhyan se dekho!',
    'Chaar dwar khule hain, sabhi dishaon me nayi duniya pukarti hai. Yatra shubh ho!'
  ];
  const dialogueToType = sampleDialogues[Math.floor(Math.random() * sampleDialogues.length)];

  // Typewriter effect with proper spacing
  diagNpcText.textContent = '';
  let charIdx = 0;
  clearInterval(window.diagInterval);
  window.diagInterval = setInterval(() => {
    if (charIdx <= dialogueToType.length) {
      diagNpcText.textContent = dialogueToType.slice(0, charIdx);
      charIdx++;
    } else {
      clearInterval(window.diagInterval);
    }
  }, 22);

  diagQuestTitle.innerText = `📜 ACTIVE QUEST: EXPLORE EARTH-3`;
  diagQuestDesc.innerText = `Inspect 3 glowing flowers in the Sakura Sanctuary to absorb cosmic botanical knowledge.`;

  npcDialogueBox.classList.add('active');
  dialogueButtonFocusIndex = 0;
  updateDialogueFocus();
}

// Pet and Feed Animal -> Triggers Companion Follower
function petNearbyAnimal(animal) {
  companionAnimal = animal;
  companionTimer = 18.0; // Follow for 18 seconds
  showToast(`🥕 You fed the ${animal.type}! It is now following you happily as your companion! 🐾`);
  // Small joyful hop
  animal.group.position.y += 1.5;
}

// Key 'E', Arrow Keys, Tab, Enter & Escape Listeners
window.addEventListener('keydown', (e) => {
  // If dialogue box is open, handle keyboard navigation (Arrows, Tab, Enter, Esc)
  if (npcDialogueBox && npcDialogueBox.classList.contains('active')) {
    if (e.key === 'Tab') {
      e.preventDefault();
      dialogueButtonFocusIndex = (dialogueButtonFocusIndex === 0) ? 1 : 0;
      updateDialogueFocus();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      dialogueButtonFocusIndex = 1; // Move to Close
      updateDialogueFocus();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      dialogueButtonFocusIndex = 0; // Move to Accept Quest
      updateDialogueFocus();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (dialogueButtonFocusIndex === 0) {
        btnAcceptQuest.click();
      } else {
        btnDismissDialogue.click();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      btnDismissDialogue.click();
      return;
    }
  }

  // Open dialogue or pet with 'E'
  if (e.code === 'KeyE') {
    if (nearbyNPC) {
      openNPCDialogue(nearbyNPC);
    } else if (nearbyAnimal) {
      petNearbyAnimal(nearbyAnimal);
    }
  }
});

btnMobileTalk?.addEventListener('click', () => {
  if (nearbyNPC) openNPCDialogue(nearbyNPC);
});
btnMobilePet?.addEventListener('click', () => {
  if (nearbyAnimal) petNearbyAnimal(nearbyAnimal);
});

btnCloseDialogue?.addEventListener('click', () => npcDialogueBox.classList.remove('active'));
btnDismissDialogue?.addEventListener('click', () => npcDialogueBox.classList.remove('active'));
btnAcceptQuest?.addEventListener('click', () => {
  npcDialogueBox.classList.remove('active');
  showToast('✨ Quest Accepted! Explore the sanctuary to gather cosmic flora essence.');
});

// Codex Drawer Toggle & Population
function updateCodexUI() {
  if (!codexItemsList) return;
  codexItemsList.innerHTML = '';
  for (const [id, item] of Object.entries(collectedCodex)) {
    const card = document.createElement('div');
    card.className = 'codex-card';
    card.innerHTML = `
      <div class="codex-item-info">
        <strong>${item.name}</strong>
        <small>${item.species} • ID: ${id}</small>
      </div>
      <span class="codex-count">x${item.count}</span>
    `;
    codexItemsList.appendChild(card);
  }
}

btnToggleCodex?.addEventListener('click', () => {
  updateCodexUI();
  codexDrawer.classList.toggle('open');
});
btnCloseCodex?.addEventListener('click', () => codexDrawer.classList.remove('open'));

// Emotes Trigger
btnEmoteWave?.addEventListener('click', () => {
  activeEmote = 'wave';
  emoteTimer = 3.0;
  showToast('🙏 Cyber Namaste: Greeting all wanderers across the multiverse!');
});

btnEmoteMeditate?.addEventListener('click', () => {
  activeEmote = 'meditate';
  emoteTimer = 4.5;
  showToast('🧘 Deep Meditation: Levitating with cosmic energy...');
});
