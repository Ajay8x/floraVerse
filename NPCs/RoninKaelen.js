/**
 * Ronin Kaelen - Sakura Cyber Samurai NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Deep Violet Cyber Armor with Neon Magenta Accents & Haori Cape
 */
(function(global) {
  'use strict';

  const RoninKaelen = {
    id: 'npc_ronin_kaelen',
    name: 'Ronin Kaelen',
    title: 'Sakura Cyber Samurai',
    realm: 'Earth-3',
    dialogue: 'The cherry blossoms bloom timelessly under the cyber canopy.',
    config: {
      armorCol: 0x240046, // Deep Violet Armor
      trimCol: 0xff007f,  // Neon Magenta
      visorCol: 0x00f0ff, // Aqua Visor
      capeCol: 0x7209b7,  // Cyber Kimono / Haori
      coreCol: 0xff0055,
      hasCape: true,
      scale: 1.05
    },
    spawnPosition: { x: -14, z: -228 }
  };

  global.NPC_RoninKaelen = RoninKaelen;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoninKaelen;
  }
})(typeof window !== 'undefined' ? window : globalThis);
