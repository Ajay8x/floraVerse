/**
 * SolarPineTree.js
 * Location: Earth-4 West Solaris Valley (X: -238, Z: 25)
 * Characteristic: Golden geometric solar-needle pine absorbing high-energy solar rays
 */
(function(global) {
  'use strict';

  const SolarPineTree = {
    id: 'solar_pine_tree',
    entityId: 'TREE-003',
    name: 'Solar Needle Pine',
    realm: 'Earth-4',
    category: 'PHOTO-VOLTAIC ARBOR',
    species: 'Pinus Solaris Aurea',
    height: '21.0 m',
    luminosity: '165,000 Lux',
    desc: 'Golden tiered evergreen pine storing solar coronal warmth inside needle arrays.',
    spawnPosition: { x: -238, z: 25 },
    foliageColors: {
      gold: 0xffbe0b,
      amber: 0xfb5607,
      sunlight: 0xffe49e
    },
    trunkColor: 0x3d2605
  };

  global.Tree_SolarPine = SolarPineTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarPineTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
