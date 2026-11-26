/**
 * Guardian Jin - Heavy Mecha Vanguard NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Abyssal Blue Heavy Plating with Ice Cyan Shield & Dual Core
 */
(function(global) {
  'use strict';

  const GuardianJin = {
    id: 'npc_guardian_jin',
    name: 'Guardian Jin',
    title: 'Heavy Mecha Vanguard',
    realm: 'Earth-3',
    dialogue: 'None shall disturb the peace of the Sakura Sanctuary.',
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

  global.NPC_GuardianJin = GuardianJin;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GuardianJin;
  }
})(typeof window !== 'undefined' ? window : globalThis);
