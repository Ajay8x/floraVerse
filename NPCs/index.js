/**
 * NPCs and Fauna Barrel Export & Spawner Engine
 * Organizes all character entities into a structured registry
 */
(function(global) {
  'use strict';

  const NPCsRegistry = {
    characters: [
      global.NPC_RoninKaelen,
      global.NPC_BotanistAya,
      global.NPC_GrandSageRen,
      global.NPC_ScoutMaya,
      global.NPC_GuardianJin
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
