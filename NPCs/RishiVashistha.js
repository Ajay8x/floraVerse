/**
 * Rishi Vashistha - Brahmaand Rishi (Aether Sage) NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Midnight Obsidian with Golden Inlays and Crimson Silk Cape
 */
(function(global) {
  'use strict';

  const RishiVashistha = {
    id: 'npc_rishi_vashistha',
    name: 'Rishi Vashistha',
    title: 'Brahmaand Mahaguru',
    realm: 'Earth-3',
    dialogue: 'Panch Prithviyon ka santulan hi is srishti ka mooladhar hai.',
    config: {
      armorCol: 0x1a1a24, // Midnight Obsidian
      trimCol: 0xffd166,  // Gold Inlays
      visorCol: 0xffd166, // Golden Visor
      capeCol: 0xd90429,  // Crimson Silk Cape
      coreCol: 0xffbe0b,
      hasCape: true,
      scale: 1.12
    },
    spawnPosition: { x: -22, z: -250 }
  };

  global.NPC_RishiVashistha = RishiVashistha;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RishiVashistha;
  }
})(typeof window !== 'undefined' ? window : globalThis);
