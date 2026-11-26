/**
 * Parijat (Neon Weeping Willow Tree)
 * Location: Earth-2 North Aqua Ocean (X: -22, Z: 235)
 * Characteristic: Sacred aquatic Parijat with dripping cyan/aqua bioluminescent fiber-optic vines
 */
(function(global) {
  'use strict';

  const ParijatTree = {
    id: 'parijat_tree',
    entityId: 'TREE-002',
    name: 'Pavitra Parijat Vriksha',
    realm: 'Earth-2',
    category: 'BIOLUMINESCENT HYDRO-ARBOR',
    species: 'Salix Parijata Aqua',
    height: '18.2 m',
    luminosity: '115,000 Lux',
    desc: 'A celestial aquatic tree whose trailing quantum vines absorb humidity and emit radiant aqua light.',
    spawnPosition: { x: -22, z: 235 },
    foliageColors: {
      cyan: 0x00f0ff,
      aqua: 0x70e000,
      ice: 0xd8f3dc
    },
    trunkColor: 0x0b2545
  };

  global.Tree_Parijat = ParijatTree;
  global.Tree_NeonWillow = ParijatTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParijatTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
