/**
 * Player Module (Player/PlayerAvatar.js)
 * Hero Humanoid Avatar with Arc Reactor (Front), Jetpack Thrusters (Back),
 * Articulated Limbs & Free Look 360° V-Key Controls
 */
(function(global) {
  'use strict';

  global.Aetheria = global.Aetheria || {};

  global.Aetheria.Player = {
    name: 'Cybernetic Hero Avatar',
    version: '2.0.0',
    arcReactorOffsetZ: -0.82,  // FRONT Chest
    jetpackOffsetZ: 0.90,     // BACK Thrusters
    kneeGuardOffsetZ: -0.42,   // FRONT Knee
    
    // Config info
    materials: {
      carbonFiber: 0x161b26,
      titaniumPlating: 0x283244,
      cyberGold: 0xffd166,
      neonCyanVein: 0x00f0ff,
      crimsonCore: 0xff2a6d
    },

    getControlsGuide() {
      return {
        move: 'WASD / Arrow Keys',
        jump: 'Spacebar',
        sprint: 'Shift',
        freeLook: 'Hold V (Face look / 360 view)',
        inspect: 'Click on Flowers / NPCs',
        interact: 'E'
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Aetheria.Player;
  }
})(typeof window !== 'undefined' ? window : globalThis);
