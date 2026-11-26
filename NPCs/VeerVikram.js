/**
 * Veer Vikram - Sakura Cyber Yoddha (Samurai) NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Deep Violet Cyber Armor with Neon Magenta Accents & Angavastra/Haori Cape
 */
(function(global) {
  'use strict';

  const VeerVikram = {
    id: 'npc_veer_vikram',
    name: 'Veer Vikram',
    title: 'Sakura Cyber Yoddha',
    realm: 'Earth-3',
    dialogue: 'Pranam yatri! Yeh divya van shanti aur shakti ka sangam hai.',
    config: {
      armorCol: 0x240046, // Deep Violet Armor
      trimCol: 0xff007f,  // Neon Magenta
      visorCol: 0x00f0ff, // Aqua Visor
      capeCol: 0x7209b7,  // Cyber Angavastra / Cape
      coreCol: 0xff0055,
      hasCape: true,
      scale: 1.05
    },
    spawnPosition: { x: -14, z: -228 }
  };

  global.NPC_VeerVikram = VeerVikram;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VeerVikram;
  }
})(typeof window !== 'undefined' ? window : globalThis);
