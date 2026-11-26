/**
 * Kitsune Mystic Foxes (Dusare Janavar) Configuration & Spawner
 * Location: Earth-3 South Sakura Highlands
 * Characteristics: 3 fluffy glowing tails, vermilion coat, graceful swaying prowl
 */
(function(global) {
  'use strict';

  const KitsuneFoxes = {
    type: 'fauna_fox',
    category: 'Kitsune Mystic Foxes',
    species: 'Vulpes Kitsune Mystica',
    spawns: [
      { x: -16, z: -244, name: 'Crimson 3-Tailed Fox' },
      { x: 15, z: -248, name: 'Moonlit Grove Fox' },
      { x: 0, z: -236, name: 'Radiant Sun Fox' }
    ]
  };

  global.Fauna_KitsuneFoxes = KitsuneFoxes;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KitsuneFoxes;
  }
})(typeof window !== 'undefined' ? window : globalThis);
