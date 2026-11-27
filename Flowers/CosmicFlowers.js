/**
 * Flowers & Flora Module (Flowers/CosmicFlowers.js)
 * Monumental Living Breathing Flowers:
 * Central Crimson Rose, Orchid, Dahlia, Lily, Lotus & Flower Planting System
 */
(function(global) {
  'use strict';

  global.Aetheria = global.Aetheria || {};

  global.Aetheria.Flowers = {
    monumentalFlowers: [
      {
        id: 'FLOWER-001',
        name: 'The Central Cosmic Rose',
        realm: 'Earth-1 Prime Core',
        pos: { x: 0, z: 0 },
        height: '18.5 m',
        colors: { petal: 0xff1744, glow: 0xff2a6d }
      },
      {
        id: 'FLOWER-002',
        name: 'Monumental Cyber Orchid',
        realm: 'Earth-1 East Grove',
        pos: { x: 38, z: 28 },
        height: '14.0 m',
        colors: { petal: 0xcc00ff, glow: 0xe056fd }
      },
      {
        id: 'FLOWER-003',
        name: 'Monumental Solar Dahlia',
        realm: 'Earth-1 West Sanctuary',
        pos: { x: -38, z: -28 },
        height: '15.2 m',
        colors: { petal: 0xffaa00, glow: 0xffd166 }
      },
      {
        id: 'FLOWER-004',
        name: 'Monumental Celestial Lily',
        realm: 'Earth-1 North Plateau',
        pos: { x: -28, z: 42 },
        height: '16.8 m',
        colors: { petal: 0x00f0ff, glow: 0x05ffa1 }
      },
      {
        id: 'FLOWER-005',
        name: 'Divya Sahasrara Padma (Monumental Lotus)',
        realm: 'Earth-1 South Garden',
        pos: { x: 28, z: -42 },
        height: '13.5 m',
        colors: { petal: 0xff70a6, glow: 0xff9770 }
      }
    ],

    animation: {
      breathingSpeed: 1.8, // Radian pulse per second
      scaleRange: [0.95, 1.05]
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Aetheria.Flowers;
  }
})(typeof window !== 'undefined' ? window : globalThis);
