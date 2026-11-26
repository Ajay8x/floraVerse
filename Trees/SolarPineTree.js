/**
 * Suryakant (Solar Needle Pine Tree)
 * Location: Earth-4 West Solaris Valley (X: -238, Z: 25)
 * Characteristic: Golden geometric Suryakant tree absorbing high-energy solar rays
 */
(function(global) {
  'use strict';

  const SuryakantTree = {
    id: 'suryakant_tree',
    entityId: 'TREE-003',
    name: 'Suryakant Swarna Vriksha',
    realm: 'Earth-4',
    category: 'PHOTO-VOLTAIC SOLAR ARBOR',
    species: 'Pinus Suryakanta Aurea',
    height: '21.0 m',
    luminosity: '165,000 Lux',
    desc: 'Golden tiered evergreen tree storing solar coronal warmth inside crystalline needle arrays.',
    spawnPosition: { x: -238, z: 25 },
    foliageColors: {
      gold: 0xffbe0b,
      amber: 0xfb5607,
      sunlight: 0xffe49e
    },
    trunkColor: 0x3d2605
  };

  global.Tree_Suryakant = SuryakantTree;
  global.Tree_SolarPine = SuryakantTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuryakantTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
