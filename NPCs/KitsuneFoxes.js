/**
 * Kitsune Cyber Foxes (Dusare Janavar) Configuration & Spawner
 * Location: Earth-3 South Sakura Highlands
 * Characteristics: 3 fluffy glowing tails, vermilion coat, graceful swaying prowl
 */
(function(global) {
  'use strict';

  const KitsuneFoxes = {
    type: 'fauna_fox',
    category: 'Kitsune Mystic Foxes (Dusare Janavar)',
    species: 'Vulpes Tristis Mystica',
    spawns: [
      { x: -16, z: -244, name: 'Verdant Eye Kitsune' },
      { x: 15, z: -248, name: 'Sakura Grove Prowler' },
      { x: 0, z: -236, name: 'Sanctuary Guardian Kitsune' }
    ]
  };

  global.Fauna_KitsuneFoxes = KitsuneFoxes;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KitsuneFoxes;
  }
})(typeof window !== 'undefined' ? window : globalThis);
