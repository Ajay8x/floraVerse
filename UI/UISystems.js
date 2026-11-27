/**
 * UI Systems Module (UI/UISystems.js)
 * Real-time 2D Radar Minimap, Inspection Modal, RPG Dialogue & Codex Drawer
 */
(function(global) {
  'use strict';

  global.Aetheria = global.Aetheria || {};

  global.Aetheria.UI = {
    minimap: {
      canvasId: 'radar-canvas',
      coordsId: 'radar-coords',
      scale: 0.55,
      features: ['Player Position', 'Orientation Needle', 'Sanctuary Radar Grid']
    },

    dialogue: {
      boxId: 'npc-dialogue-box',
      typewriterSpeedMs: 22,
      controls: {
        navigate: 'Tab / Arrow Keys',
        accept: 'Enter',
        dismiss: 'Escape'
      }
    },

    toolbox: {
      tools: ['Photo Capture (High-Res)', 'Sky Mode (Overhead Drone)']
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.Aetheria.UI;
  }
})(typeof window !== 'undefined' ? window : globalThis);
