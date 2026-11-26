/**
 * Ananya - Vanaspati Vaigyanik (Quantum Botanist) NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Cobalt Navy & Mint Emerald Botanical Research Suit
 */
(function(global) {
  'use strict';

  const Ananya = {
    id: 'npc_ananya',
    name: 'Ananya',
    title: 'Vanaspati Vaigyanik',
    realm: 'Earth-3',
    dialogue: 'In phoolon ki har pankhudi me brahmaand ki divya urja basti hai.',
    config: {
      armorCol: 0x0d3b66, // Cobalt Navy
      trimCol: 0x06d6a0,  // Mint Emerald
      visorCol: 0x52b788, // Emerald HUD Visor
      capeCol: 0x118ab2,
      coreCol: 0x06d6a0,
      hasCape: false,
      scale: 0.95
    },
    spawnPosition: { x: 18, z: -232 }
  };

  global.NPC_Ananya = Ananya;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ananya;
  }
})(typeof window !== 'undefined' ? window : globalThis);
