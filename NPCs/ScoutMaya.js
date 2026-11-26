/**
 * Scout Maya - Neon Ranger NPC
 * Location: Earth-3 South Sakura Highlands
 * Theme: Lightweight Matte Charcoal Suit with Solar Flame Trims & Ruby Visor
 */
(function(global) {
  'use strict';

  const ScoutMaya = {
    id: 'npc_scout_maya',
    name: 'Scout Maya',
    title: 'Neon Ranger',
    realm: 'Earth-3',
    dialogue: 'The paths between worlds are shifting. Keep your visor sharp!',
    config: {
      armorCol: 2829890, // 0x2b2d42 Matte Charcoal
      trimCol: 16733184,  // 0xff5400 Solar Flame Orange
      visorCol: 16711764, // 0xff0054 Ruby Visor
      capeCol: 10354777,  // 0x9e0059
      coreCol: 16733184,
      hasCape: false,
      scale: 0.98
    },
    spawnPosition: { x: 14, z: -254 }
  };

  global.NPC_ScoutMaya = ScoutMaya;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoutMaya;
  }
})(typeof window !== 'undefined' ? window : globalThis);
