/**
 * Grand Sage Ren - Aether Elder NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Midnight Obsidian with Golden Inlays and Crimson Silk Cape
 */
(function(global) {
  'use strict';

  const GrandSageRen = {
    id: 'npc_grand_sage_ren',
    name: 'Grand Sage Ren',
    title: 'Aether Elder',
    realm: 'Earth-3',
    dialogue: 'Honor the five Earths, for they are woven from single light.',
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

  global.NPC_GrandSageRen = GrandSageRen;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GrandSageRen;
  }
})(typeof window !== 'undefined' ? window : globalThis);
