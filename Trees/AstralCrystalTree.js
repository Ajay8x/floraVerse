/**
 * AstralCrystalTree.js
 * Location: Earth-5 East Astral Peak (X: 238, Z: -20)
 * Characteristic: Deep crystalline fractal tree formed from amethyst & quartz mineral spires
 */
(function(global) {
  'use strict';

  const AstralCrystalTree = {
    id: 'astral_crystal_tree',
    entityId: 'TREE-004',
    name: 'Astral Crystal Spire Tree',
    realm: 'Earth-5',
    category: 'MINERAL RESONANCE ARBOR',
    species: 'Arbor Crystallus Amethystea',
    height: '26.8 m',
    luminosity: '190,000 Lux',
    desc: 'Crystalline resonance arbor growing amidst eastern mineral spires, pulsing cosmic frequencies.',
    spawnPosition: { x: 238, z: -20 },
    foliageColors: {
      violet: 0x9d4edd,
      amethyst: 0xc77dff,
      starlight: 0xe0aaff
    },
    trunkColor: 0x240046
  };

  global.Tree_AstralCrystal = AstralCrystalTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AstralCrystalTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
