/**
 * AETHERIA - WorldModel (M in MVC)
 * Manages all data, state, landmarks, particles, and physics data.
 */
export class WorldModel {
  constructor() {
    this.currentMode = 'orbit'; // 'orbit' | 'walk' | 'fly'
    this.skyMode = 0; // 0: Night, 1: Sunset, 2: Cyber Day
    this.plantingMode = false;
    this.meteorShowerActive = true;
    
    // Player Character state
    this.player = {
      position: { x: 0, y: 0, z: 15 },
      rotationY: 0,
      pitch: 0,
      velocity: { x: 0, y: 0, z: 0 },
      isGrounded: false
    };

    // Input States
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      sprint: false
    };

    this.joystickMove = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };

    // World Entities & Landmarks Definition
    this.landmarks = [
      {
        id: 'rose',
        entityId: 'FLOR-001',
        name: 'Crimson Rose Grove',
        species: 'Rosa Aetheria Superba',
        category: 'PRIMARY BOTANICAL CORE',
        luminosity: '128,000 LUX',
        height: '42 METERS',
        desc: 'The central hyper-dimensional flower of Aetheria. Its petals emit harmonic quantum resonance.',
        pos: [0, 0, 0],
        camPos: { x: 0, y: 18, z: 32 },
        lookAt: { x: 0, y: 12, z: 0 }
      },
      {
        id: 'lotus',
        entityId: 'FLOR-002',
        name: 'Sacred Lotus Lake',
        species: 'Nelumbo Lumina Sancta',
        category: 'AQUATIC BIOLUMINESCENCE',
        luminosity: '110,500 LUX',
        height: '18 METERS',
        desc: 'Floats upon a sea of liquid starlight with interactive responsive ripple waves.',
        pos: [55, 0, 30],
        camPos: { x: 55, y: 16, z: 58 },
        lookAt: { x: 55, y: 8, z: 30 }
      },
      {
        id: 'sakura',
        entityId: 'FLOR-003',
        name: 'Quantum Sakura Tree',
        species: 'Prunus Aetheria Magna',
        category: 'CELESTIAL ARBORETUM',
        luminosity: '142,000 LUX',
        height: '38 METERS',
        desc: 'Spreads luminous cherry blossom branches across the southern cyber cliffs.',
        pos: [-60, 0, -35],
        camPos: { x: -60, y: 22, z: -10 },
        lookAt: { x: -60, y: 14, z: -35 }
      },
      {
        id: 'sunflower',
        entityId: 'FLOR-004',
        name: 'Solaris Sunflower Valley',
        species: 'Helianthus Solaris Divina',
        category: 'SOLAR RADIATION HARVESTER',
        luminosity: '165,000 LUX',
        height: '32 METERS',
        desc: 'Channels stellar beams into golden radiant spirals and micro-energy bursts.',
        pos: [65, 0, -50],
        camPos: { x: 65, y: 20, z: -25 },
        lookAt: { x: 65, y: 12, z: -50 }
      },
      {
        id: 'monolith',
        entityId: 'MONO-005',
        name: 'Prismatic Monolith Spire',
        species: 'Aetherian Crystal Spire',
        category: 'ANCIENT CYBER MONOLITH',
        luminosity: '210,000 LUX',
        height: '56 METERS',
        desc: 'Emits laser telemetry data upwards into the cosmic aurora nebula.',
        pos: [0, 0, -65],
        camPos: { x: 0, y: 28, z: -35 },
        lookAt: { x: 0, y: 20, z: -65 }
      },
      {
        id: 'tulip',
        entityId: 'FLOR-006',
        name: 'Electric Tulip Plateau',
        species: 'Tulipa Neon Electrica',
        category: 'NEON FLORAL PLATEAU',
        luminosity: '115,000 LUX',
        height: '24 METERS',
        desc: 'Vibrant cyan and magenta petals charging the atmospheric grid.',
        pos: [-50, 0, 40],
        camPos: { x: -50, y: 16, z: 65 },
        lookAt: { x: -50, y: 10, z: 40 }
      }
    ];

    this.activeLandmark = null;
    this.hoveredLandmark = null;
  }

  getTerrainHeightAt(x, z) {
    const hill1 = Math.sin(x * 0.035) * Math.cos(z * 0.035) * 4.8;
    const hill2 = Math.sin(x * 0.07 + z * 0.05) * 2.2;
    const micro = Math.sin(x * 0.15) * 0.4;
    return hill1 + hill2 + micro - 2.0;
  }

  setMode(mode) {
    this.currentMode = mode;
  }

  cycleSkyMode() {
    this.skyMode = (this.skyMode + 1) % 3;
    return this.skyMode;
  }
}
