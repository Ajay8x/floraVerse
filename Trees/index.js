/**
 * Trees Registry & Spawner Engine (Trees/index.js)
 * Collects all tree definitions across the 5 Earth realms
 */
(function(global) {
  'use strict';

  const TreesRegistry = {
    trees: [
      global.Tree_SakuraSanctuary,
      global.Tree_NeonWillow,
      global.Tree_SolarPine,
      global.Tree_AstralCrystal
    ].filter(Boolean),

    getAllTrees() {
      return this.trees;
    },

    getTreeById(id) {
      return this.trees.find(t => t && t.id === id);
    },

    getTreesByRealm(realm) {
      return this.trees.filter(t => t && t.realm === realm);
    }
  };

  global.TreesRegistry = TreesRegistry;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreesRegistry;
  }
})(typeof window !== 'undefined' ? window : globalThis);
