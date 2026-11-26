/**
 * Aarav - Nakshatra Khoji (Star Scout) NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Lightweight Matte Charcoal Suit with Solar Flame Trims & Ruby Visor
 */
(function(global) {
  'use strict';

  const Aarav = {
    id: 'npc_aarav',
    name: 'Aarav',
    title: 'Nakshatra Khoji',
    realm: 'Earth-3',
    dialogue: 'Chaar dwar khule hain, sabhi dishaon me nayi duniya pukarti hai.',
    config: {
      armorCol: 0x2b2d42, // Matte Charcoal
      trimCol: 0xff5400,  // Solar Flame Orange
      visorCol: 0xff0054, // Ruby Visor
      capeCol: 0x9e0059,
      coreCol: 0xff5400,
      hasCape: false,
      scale: 0.98
    },
    spawnPosition: { x: 14, z: -254 }
  };

  global.NPC_Aarav = Aarav;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Aarav;
  }
})(typeof window !== 'undefined' ? window : globalThis);
