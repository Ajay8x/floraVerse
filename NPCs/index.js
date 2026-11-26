/**
 * NPCs and Fauna Barrel Export & Spawner Engine (Indian Characters)
 */
(function(global) {
  'use strict';

  const NPCsRegistry = {
    characters: [
      global.NPC_VeerVikram,
      global.NPC_Ananya,
      global.NPC_RishiVashistha,
      global.NPC_Aarav,
      global.NPC_Ranveer
    ].filter(Boolean),

    fauna: {
      rabbits: global.Fauna_QuantumRabbits,
      deer: global.Fauna_AstralDeer,
      foxes: global.Fauna_KitsuneFoxes
    },

    getAllCharacters() {
      return this.characters;
    },

    getCharacterById(id) {
      return this.characters.find(c => c && c.id === id);
    }
  };

  global.NPCsRegistry = NPCsRegistry;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NPCsRegistry;
  }
})(typeof window !== 'undefined' ? window : globalThis);
