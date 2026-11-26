/**
 * Ranveer - Maharakshak (Mecha Vanguard) NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Abyssal Blue Heavy Plating with Ice Cyan Shield & Dual Core
 */
(function(global) {
  'use strict';

  const Ranveer = {
    id: 'npc_ranveer',
    name: 'Ranveer',
    title: 'Maharakshak Vanguard',
    realm: 'Earth-3',
    dialogue: 'Koi dushpravritti is pavitra van ke andar pravesh nahi kar sakti.',
    config: {
      armorCol: 0x0a1128, // Deep Abyssal Blue
      trimCol: 0x00b4d8,  // Cyan Plasma
      visorCol: 0x90e0ef, // Ice Cyan
      capeCol: 0x0077b6,
      coreCol: 0x00f0ff,
      hasCape: true,
      scale: 1.2
    },
    spawnPosition: { x: 0, z: -262 }
  };

  global.NPC_Ranveer = Ranveer;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Ranveer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
