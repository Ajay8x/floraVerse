/**
 * World Module (World/WorldTerrain.js)
 * 5 Earth Realms, Cosmic Highways, Archway Gates, Dimensional Portals & Weather
 */
(function(global) {
  'use strict';

  global.Aetheria = global.Aetheria || {};

  global.Aetheria.World = {
    realms: [
      { id: '1', name: 'Earth-1: Central Core', x: 0, z: 0, rMax: 72, colHex: 0x05ffa1, altCol: 0x00f0ff },
      { id: '2', name: 'Earth-2: North Aqua Lotus', x: 0, z: 240, rMax: 62, colHex: 0x00f0ff, altCol: 0x0077ff },
      { id: '3', name: 'Earth-3: South Neon Sakura', x: 0, z: -240, rMax: 62, colHex: 0xff2a6d, altCol: 0x9d4edd },
      { id: '4', name: 'Earth-4: West Solaris Dunes', x: -250, z: 0, rMax: 62, colHex: 0xffbe0b, altCol: 0xff5500 },
      { id: '5', name: 'Earth-5: East Astral Peak', x: 250, z: 0, rMax: 62, colHex: 0x9d4edd, altCol: 0xff2a6d }
    ],

    highways: [
      { id: '2', name: 'North Highway to Earth-2', from: [0, 68], to: [0, 180], color: 0x00f0ff },
      { id: '3', name: 'South Highway to Earth-3', from: [0, -68], to: [0, -180], color: 0xff2a6d },
      { id: '4', name: 'West Highway to Earth-4', from: [-68, 0], to: [-190, 0], color: 0xffbe0b },
      { id: '5', name: 'East Highway to Earth-5', from: [68, 0], to: [190, 0], color: 0x9d4edd }
    ],

    weather: {
      type: 'Falling Sakura Petals & Celestial Star Meteors',
      sakuraCenter: { x: 0, z: -240 },
      meteorCount: 45
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Aetheria.World;
  }
})(typeof window !== 'undefined' ? window : globalThis);
