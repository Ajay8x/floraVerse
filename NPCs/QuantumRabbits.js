/**
 * Quantum Rabbits (Kharagosh) Configuration & Spawner
 * Location: Earth-3 South Sakura Highlands
 * Characteristics: Glowing eyes, twitching ears, energetic parabolic hops
 */
(function(global) {
  'use strict';

  const QuantumRabbits = {
    type: 'fauna_rabbit',
    category: 'Quantum Rabbits (Kharagosh)',
    species: 'Lepus Aetheris Nanus',
    spawns: [
      { x: -8, z: -222, colorHex: 0xffffff, name: 'Snow Quantum Rabbit' },
      { x: -12, z: -225, colorHex: 0xffc6ff, name: 'Sakura Petal Rabbit' },
      { x: 9, z: -236, colorHex: 0xe0aaff, name: 'Astral Lavender Rabbit' },
      { x: 22, z: -245, colorHex: 0xffffff, name: 'Pristine White Rabbit' },
      { x: -6, z: -252, colorHex: 0xffadad, name: 'Rose Blossom Rabbit' }
    ]
  };

  global.Fauna_QuantumRabbits = QuantumRabbits;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumRabbits;
  }
})(typeof window !== 'undefined' ? window : globalThis);
