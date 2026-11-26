/**
 * NeonWillowTree.js
 * Location: Earth-2 North Aqua Ocean (X: -22, Z: 235)
 * Characteristic: Weeping willow tree with dripping cyan/aqua bioluminescent fiber-optic vines
 */
(function(global) {
  'use strict';

  const NeonWillowTree = {
    id: 'neon_willow_tree',
    entityId: 'TREE-002',
    name: 'Neon Weeping Willow',
    realm: 'Earth-2',
    category: 'BIOLUMINESCENT HYDRO-ARBOR',
    species: 'Salix Cyber Aqua',
    height: '18.2 m',
    luminosity: '115,000 Lux',
    desc: 'A celestial aquatic weeping willow whose trailing quantum vines absorb humidity and emit radiant aqua light.',
    spawnPosition: { x: -22, z: 235 },
    foliageColors: {
      cyan: 0x00f0ff,
      aqua: 0x70e000,
      ice: 0xd8f3dc
    },
    trunkColor: 0x0b2545
  };

  global.Tree_NeonWillow = NeonWillowTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeonWillowTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
