/**
 * Astral Neon Deer (Hiran) Configuration & Spawner
 * Location: Earth-3 South Sakura Highlands
 * Characteristics: Graceful gait, crystalline neon branching antlers, tranquil grazing
 */
(function(global) {
  'use strict';

  const AstralDeer = {
    type: 'fauna_deer',
    category: 'Astral Neon Deer',
    species: 'Cervus Astral Grandis',
    spawns: [
      { x: -26, z: -235, antlerColorHex: 0x00f0ff, name: 'Cyan Antler Stag' },
      { x: 26, z: -238, antlerColorHex: 0xff007f, name: 'Magenta Antler Doe' },
      { x: 5, z: -265, antlerColorHex: 0xffd166, name: 'Golden Horned Grand Stag' },
      { x: -18, z: -260, antlerColorHex: 0x06d6a0, name: 'Emerald Forest Deer' }
    ]
  };

  global.Fauna_AstralDeer = AstralDeer;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AstralDeer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
