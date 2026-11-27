/**
 * Fauna Module (Fauna/FaunaAnimals.js)
 * Living Wildlife: Quantum Cyber Rabbits, Golden Astral Deer, Kitsune Mystic Foxes,
 * Glowing Butterflies & Celestial Cyber Phoenix Birds
 */
(function(global) {
  'use strict';

  global.Aetheria = global.Aetheria || {};

  global.Aetheria.Fauna = {
    species: [
      {
        type: 'Quantum Cyber Rabbit (Kharagosh)',
        characteristics: 'Bioluminescent fur, twitching ears, hopping locomotion & player following when fed',
        realm: 'Earth-3 Sakura Highlands',
        count: 5
      },
      {
        type: 'Astral Horned Deer (Divya Hiran)',
        characteristics: 'Luminous antlers, grazing idle animation, pristine metallic fur',
        realm: 'Earth-3 Sakura Highlands',
        count: 2
      },
      {
        type: 'Kitsune Mystic Fox (Dusare Janavar)',
        characteristics: 'Multi-tail flame glow, agile roaming & curiosity behaviors',
        realm: 'Earth-3 Sakura Highlands',
        count: 3
      },
      {
        type: 'Celestial Cyber Phoenix (Sky Birds)',
        characteristics: 'Dual holographic flapping wings, high-altitude flocking flight path',
        realm: 'Global Sky Troposphere',
        count: 8
      },
      {
        type: 'Bioluminescent Butterflies (Titliyan)',
        characteristics: 'Fluttering wing physics, hovering around giant luminous blossoms',
        realm: 'Central Sanctuary & Highlands',
        count: 4
      }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Aetheria.Fauna;
  }
})(typeof window !== 'undefined' ? window : globalThis);
