/**
 * Botanist Aya - Quantum Arborist NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Cobalt Navy & Mint Emerald Botanical Research Suit
 */
(function(global) {
  'use strict';

  const BotanistAya = {
    id: 'npc_botanist_aya',
    name: 'Botanist Aya',
    title: 'Quantum Arborist',
    realm: 'Earth-3',
    dialogue: 'Every quantum petal carries a memory from ancient Aetheria.',
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

  global.NPC_BotanistAya = BotanistAya;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BotanistAya;
  }
})(typeof window !== 'undefined' ? window : globalThis);
