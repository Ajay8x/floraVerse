/**
 * Ratnavriksha (Astral Crystal Tree)
 * Location: Earth-5 East Astral Peak (X: 238, Z: -20)
 * Characteristic: Gemstone mineral tree formed from amethyst & quartz mineral spires
 */
(function(global) {
  'use strict';

  const RatnavrikshaTree = {
    id: 'ratnavriksha_tree',
    entityId: 'TREE-004',
    name: 'Ratnavriksha Sphatik Tree',
    realm: 'Earth-5',
    category: 'MINERAL RESONANCE ARBOR',
    species: 'Arbor Ratnavriksha Amethystea',
    height: '26.8 m',
    luminosity: '190,000 Lux',
    desc: 'Crystalline resonance tree growing amidst eastern mineral spires, pulsing cosmic frequencies.',
    spawnPosition: { x: 238, z: -20 },
    foliageColors: {
      violet: 0x9d4edd,
      amethyst: 0xc77dff,
      starlight: 0xe0aaff
    },
    trunkColor: 0x240046
  };

  global.Tree_Ratnavriksha = RatnavrikshaTree;
  global.Tree_AstralCrystal = RatnavrikshaTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RatnavrikshaTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
