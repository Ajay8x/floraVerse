/**
 * Kalpavriksha (Sakura Sanctuary Tree)
 * Location: Earth-3 South Sakura Highlands (X: 0, Z: -240)
 * Characteristic: Divya Kalpavriksha with pink-golden bioluminescent petal clouds
 */
(function(global) {
  'use strict';

  const KalpavrikshaTree = {
    id: 'kalpavriksha_tree',
    entityId: 'TREE-001',
    name: 'Divya Kalpavriksha (Sakura Tree)',
    realm: 'Earth-3',
    category: 'DIVYA ANCIENT ARBOR',
    species: 'Prunus Kalpavriksha Magna',
    height: '24.5 m',
    luminosity: '142,000 Lux',
    desc: 'An ancient branching cosmic wish-fulfilling tree that constantly sheds bioluminescent petals into the troposphere.',
    spawnPosition: { x: 0, z: -240 },
    foliageColors: {
      pink: 0xff99c8,
      white: 0xfff0f5,
      violet: 0xcc44e6
    },
    trunkColor: 0x733f80,
    canopies: [
      { x: 0, y: 18, z: 0, r: 8.5 },
      { x: -6, y: 15, z: 4, r: 6.8 },
      { x: 7, y: 16, z: -3, r: 7.2 },
      { x: 3, y: 20, z: 5, r: 6.5 },
      { x: -4, y: 19, z: -5, r: 6.4 }
    ]
  };

  global.Tree_Kalpavriksha = KalpavrikshaTree;
  global.Tree_SakuraSanctuary = KalpavrikshaTree;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KalpavrikshaTree;
  }
})(typeof window !== 'undefined' ? window : globalThis);
