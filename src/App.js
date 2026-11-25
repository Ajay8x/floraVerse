/**
 * AETHERIA - Application Entrypoint (MVC Bootstrap)
 */
import { WorldModel } from './models/WorldModel.js';
import { World3DView } from './views/World3DView.js';
import { HudView } from './views/HudView.js';
import { WorldController } from './controllers/WorldController.js';

window.addEventListener('DOMContentLoaded', () => {
  // 1. Model (Data & State)
  const model = new WorldModel();

  // 2. Views (3D World Graphics & 2D HUD UI)
  const worldView = new World3DView(model);
  const hudView = new HudView();

  // 3. Controller (Inputs, Physics, Animations & Orchestration)
  const controller = new WorldController(model, worldView, hudView);

  // Start unified animation loop
  controller.animate();

  console.log('✨ AETHERIA MVC Architecture Initialized Successfully');
});
