/**
 * AETHERIA - WorldController (C in MVC)
 * Orchestrates user inputs, physics, camera animations, and 10 integrated libraries.
 */
export class WorldController {
  constructor(model, worldView, hudView) {
    this.model = model;
    this.worldView = worldView;
    this.hudView = hudView;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initKeyboardControls();
    this.initMouseLookControls();
    this.initTouchControls();
    this.initHudInteractions();
    this.init10Libraries();
  }

  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      const c = e.code;
      if (c === 'KeyW' || c === 'ArrowUp') this.model.keys.forward = true;
      if (c === 'KeyS' || c === 'ArrowDown') this.model.keys.backward = true;
      if (c === 'KeyA' || c === 'ArrowLeft') this.model.keys.left = true;
      if (c === 'KeyD' || c === 'ArrowRight') this.model.keys.right = true;
      if (c === 'Space') this.model.keys.jump = true;
      if (c === 'ShiftLeft' || c === 'ShiftRight') this.model.keys.sprint = true;
    });

    window.addEventListener('keyup', (e) => {
      const c = e.code;
      if (c === 'KeyW' || c === 'ArrowUp') this.model.keys.forward = false;
      if (c === 'KeyS' || c === 'ArrowDown') this.model.keys.backward = false;
      if (c === 'KeyA' || c === 'ArrowLeft') this.model.keys.left = false;
      if (c === 'KeyD' || c === 'ArrowRight') this.model.keys.right = false;
      if (c === 'Space') this.model.keys.jump = false;
      if (c === 'ShiftLeft' || c === 'ShiftRight') this.model.keys.sprint = false;
    });
  }

  initMouseLookControls() {
    let lastMousePos = { x: 0, y: 0 };

    window.addEventListener('mousedown', (e) => {
      if (this.model.currentMode === 'walk') {
        if (e.target.closest('.hud-top') || e.target.closest('.hud-controls-card') || 
            e.target.closest('.floating-toolbox') || e.target.closest('.code-drawer')) {
          return;
        }
        lastMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mousemove', (e) => {
      // Raycasting for Hover Tooltip (Orbit Mode)
      if (this.model.currentMode === 'orbit') {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.worldView.camera);
        const hits = this.raycaster.intersectObjects(this.worldView.hitboxes);

        if (hits.length > 0) {
          const data = hits[0].object.userData;
          this.hudView.showTooltip(e.clientX, e.clientY, data.entityId, data.name);
          this.worldView.canvas.style.cursor = 'pointer';
        } else {
          this.hudView.hideTooltip();
          this.worldView.canvas.style.cursor = 'grab';
        }
      }

      // Mouse Look for Walk Mode (Turns Left & Right smoothly)
      if (this.model.currentMode === 'walk') {
        let deltaX = 0;
        let deltaY = 0;

        if (document.pointerLockElement === this.worldView.canvas || document.pointerLockElement === document.body) {
          deltaX = e.movementX || 0;
          deltaY = e.movementY || 0;
        } else if (lastMousePos.x !== 0 || lastMousePos.y !== 0) {
          deltaX = e.clientX - lastMousePos.x;
          deltaY = e.clientY - lastMousePos.y;
          lastMousePos = { x: e.clientX, y: e.clientY };
        }

        if (deltaX !== 0 || deltaY !== 0) {
          this.model.player.rotationY -= deltaX * 0.0035;
          this.model.player.pitch = Math.max(-0.6, Math.min(0.6, this.model.player.pitch - deltaY * 0.003));
        }
      }
    });

    this.worldView.canvas.addEventListener('click', () => {
      this.hudView.hideTooltip();
      if (this.model.currentMode === 'walk') {
        if (document.pointerLockElement !== this.worldView.canvas) {
          this.worldView.canvas.requestPointerLock?.() || document.body.requestPointerLock?.();
        }
      }
    });
  }

  initTouchControls() {
    const jZone = document.getElementById('joystick-left-zone');
    const jThumb = document.getElementById('joystick-thumb');
    let jActive = false, jTouchId = null, jCenter = { x: 0, y: 0 };

    if (jZone && jThumb) {
      jZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.changedTouches[0];
        jActive = true;
        jTouchId = t.identifier;
        const rect = jZone.getBoundingClientRect();
        jCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (!jActive) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === jTouchId) {
            const dx = t.clientX - jCenter.x;
            const dy = t.clientY - jCenter.y;
            const dist = Math.hypot(dx, dy);
            const maxR = 40;
            const angle = Math.atan2(dy, dx);
            const r = Math.min(dist, maxR);
            jThumb.style.transform = `translate(calc(-50% + ${Math.cos(angle)*r}px), calc(-50% + ${Math.sin(angle)*r}px))`;
            this.model.joystickMove.x = (Math.cos(angle) * r) / maxR;
            this.model.joystickMove.y = (Math.sin(angle) * r) / maxR;
            break;
          }
        }
      });

      const endJ = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === jTouchId) {
            jActive = false;
            jThumb.style.transform = 'translate(-50%, -50%)';
            this.model.joystickMove.x = 0;
            this.model.joystickMove.y = 0;
            break;
          }
        }
      };
      window.addEventListener('touchend', endJ);
      window.addEventListener('touchcancel', endJ);
    }
  }

  initHudInteractions() {
    this.hudView.btnOrbit?.addEventListener('click', () => this.switchMode('orbit'));
    this.hudView.btnWalk?.addEventListener('click', () => this.switchMode('walk'));
    this.hudView.btnFly?.addEventListener('click', () => this.switchMode('fly'));

    // Meteor Toggle
    document.getElementById('btn-meteor-rain')?.addEventListener('click', () => {
      this.model.meteorShowerActive = !this.model.meteorShowerActive;
      this.worldView.meteorLines.visible = this.model.meteorShowerActive;
      this.hudView.showToast(this.model.meteorShowerActive ? '🌠 Meteor Showers Activated!' : 'Meteor Rain Paused');
    });

    // Sky cycle
    document.getElementById('btn-time-cycle')?.addEventListener('click', () => {
      const mode = this.model.cycleSkyMode();
      if (mode === 0) {
        this.worldView.scene.fog.color.setHex(0x06030c);
        this.worldView.hemiLight.color.setHex(0x9d4edd);
        this.hudView.showToast('Atmosphere: Cosmic Cyber Night');
      } else if (mode === 1) {
        this.worldView.scene.fog.color.setHex(0x1a0614);
        this.worldView.hemiLight.color.setHex(0xff5500);
        this.hudView.showToast('Atmosphere: Radiant Sunset Bloom');
      } else {
        this.worldView.scene.fog.color.setHex(0x031826);
        this.worldView.hemiLight.color.setHex(0x00f0ff);
        this.hudView.showToast('Atmosphere: Electric Neon Dawn');
      }
    });

    // Macro Zoom button
    document.getElementById('btn-zoom-inspect')?.addEventListener('click', () => {
      new TWEEN.Tween(this.worldView.camera.position)
        .to({ x: 0, y: 15, z: 6 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
      new TWEEN.Tween(this.worldView.orbitControls.target)
        .to({ x: 0, y: 14, z: 0 }, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
      this.hudView.showToast('🔬 Extreme Macro View: Zoomed into Core Petals!');
    });
  }

  switchMode(mode) {
    this.model.setMode(mode);
    this.hudView.setModeButtons(mode);

    if (mode === 'orbit') {
      this.worldView.orbitControls.enabled = true;
      this.hudView.showToast('Orbit Mode: Drag mouse to inspect, Scroll to zoom');
    } else if (mode === 'walk') {
      this.worldView.orbitControls.enabled = false;
      const startX = 0, startZ = 15;
      const startY = this.model.getTerrainHeightAt(startX, startZ);
      this.model.player.position = { x: startX, y: startY, z: startZ };
      this.model.player.velocity = { x: 0, y: 0, z: 0 };
      this.model.player.rotationY = 0;
      this.model.player.pitch = 0;

      this.worldView.playerGroup.position.set(startX, startY, startZ);
      this.worldView.camera.position.set(startX, startY + 3.5, startZ + 8.5);
      this.worldView.camera.lookAt(startX, startY + 1.8, startZ);
      this.hudView.showToast('🚶 Walk Mode: Use WASD / Mouse or Mobile Joystick!');
    } else if (mode === 'fly') {
      this.worldView.orbitControls.enabled = false;
      this.hudView.showToast('🚀 Cinematic Auto-Flight Active');
    }
  }

  init10Libraries() {
    // 2. GSAP
    if (typeof gsap !== 'undefined') {
      gsap.from('.hud-top', { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out' });
      gsap.from('.floating-toolbox', { x: 50, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });
    }

    // 3. Spline
    this.hudView.btnToggleSpline?.addEventListener('click', () => {
      this.hudView.splinePanel?.classList.toggle('hidden');
    });
    this.hudView.btnCloseSpline?.addEventListener('click', () => {
      this.hudView.splinePanel?.classList.add('hidden');
    });

    // 4. Motion
    if (window.Motion) {
      const { animate, spring } = window.Motion;
      document.querySelectorAll('.mode-btn, .tool-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.12 }, { duration: 0.2, easing: spring() }));
        btn.addEventListener('mouseleave', () => animate(btn, { scale: 1.0 }, { duration: 0.2 }));
      });
    }

    // 5. Babylon.js
    let bEngine = null;
    this.hudView.btnToggleDrone?.addEventListener('click', () => {
      this.hudView.dronePanel?.classList.toggle('hidden');
      if (!this.hudView.dronePanel?.classList.contains('hidden') && !bEngine) {
        const bCanvas = document.getElementById('babylon-canvas');
        if (bCanvas && typeof BABYLON !== 'undefined') {
          bEngine = new BABYLON.Engine(bCanvas, true);
          const bScene = new BABYLON.Scene(bEngine);
          bScene.clearColor = new BABYLON.Color4(0.04, 0.02, 0.08, 1);
          const bCam = new BABYLON.ArcRotateCamera("DroneCam", -Math.PI / 2, Math.PI / 3, 10, new BABYLON.Vector3(0, 0, 0), bScene);
          bCam.attachControl(bCanvas, true);
          const bLight = new BABYLON.HemisphericLight("droneLight", new BABYLON.Vector3(0, 1, 0), bScene);
          const sphere = BABYLON.MeshBuilder.CreateSphere("core", { diameter: 3 }, bScene);
          const mat = new BABYLON.StandardMaterial("coreMat", bScene);
          mat.wireframe = true;
          mat.emissiveColor = new BABYLON.Color3(0, 0.94, 1);
          sphere.material = mat;
          bEngine.runRenderLoop(() => {
            sphere.rotation.y += 0.02;
            bScene.render();
          });
        }
      }
    });
    this.hudView.btnCloseDrone?.addEventListener('click', () => {
      this.hudView.dronePanel?.classList.add('hidden');
    });

    // 6. Lenis
    if (typeof Lenis !== 'undefined') {
      const drawerBody = document.querySelector('.drawer-body');
      if (drawerBody) {
        const lenis = new Lenis({ wrapper: drawerBody, content: document.querySelector('.d-code'), smoothWheel: true });
        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }

    // 7. Anime.js
    if (typeof anime !== 'undefined') {
      anime({ targets: '.radar-container', boxShadow: ['0 0 10px rgba(0,240,255,0.2)', '0 0 25px rgba(0,240,255,0.65)', '0 0 10px rgba(0,240,255,0.2)'], duration: 2500, loop: true, easing: 'easeInOutQuad' });
      anime({ targets: '.brand-orb', scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7], duration: 1800, loop: true, easing: 'easeInOutSine' });
    }

    // 8. Rive
    if (typeof rive !== 'undefined') {
      const rCanvas = document.createElement('canvas');
      rCanvas.width = 32; rCanvas.height = 32;
      rCanvas.style.marginRight = '6px';
      document.querySelector('.hud-brand')?.prepend(rCanvas);
      new rive.Rive({
        src: 'https://cdn.rive.app/animations/vehicles.riv',
        canvas: rCanvas,
        autoplay: true,
        onLoadError: () => {
          const ctx = rCanvas.getContext('2d');
          let a = 0;
          const draw = () => {
            ctx.clearRect(0,0,32,32); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(16,16,12,a,a+Math.PI*1.5); ctx.stroke();
            a += 0.05; requestAnimationFrame(draw);
          };
          draw();
        }
      });
    }

    // 9. Lottie
    if (typeof lottie !== 'undefined') {
      const lContainer = document.getElementById('lottie-badge-container');
      if (lContainer) {
        lottie.loadAnimation({
          container: lContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets2.lottiefiles.com/packages/lf20_m64xqz5b.json'
        });
      }
    }
  }

  updatePhysics(delta) {
    if (this.model.currentMode === 'walk') {
      let moveForward = 0, moveRight = 0;
      if (this.model.keys.forward) moveForward += 1;
      if (this.model.keys.backward) moveForward -= 1;
      if (this.model.keys.right) moveRight += 1;
      if (this.model.keys.left) moveRight -= 1;

      if (Math.abs(this.model.joystickMove.y) > 0.1) moveForward -= this.model.joystickMove.y;
      if (Math.abs(this.model.joystickMove.x) > 0.1) moveRight += this.model.joystickMove.x;

      const len = Math.hypot(moveForward, moveRight);
      if (len > 1) { moveForward /= len; moveRight /= len; }

      const speed = this.model.keys.sprint ? 34.0 : 18.0;
      const cosY = Math.cos(this.model.player.rotationY);
      const sinY = Math.sin(this.model.player.rotationY);

      this.model.player.position.x += (moveRight * cosY - moveForward * sinY) * speed * delta;
      this.model.player.position.z += (-moveRight * sinY - moveForward * cosY) * speed * delta;

      // Facing
      if (len > 0.1) {
        const targetA = this.model.player.rotationY + Math.atan2(moveRight, moveForward);
        this.worldView.playerGroup.rotation.y = THREE.MathUtils.lerp(this.worldView.playerGroup.rotation.y, targetA, 0.2);
      } else {
        this.worldView.playerGroup.rotation.y = THREE.MathUtils.lerp(this.worldView.playerGroup.rotation.y, this.model.player.rotationY, 0.1);
      }

      // Terrain ground adhesion
      const ground = this.model.getTerrainHeightAt(this.model.player.position.x, this.model.player.position.z);
      this.model.player.velocity.y -= 9.8 * 4.0 * delta;

      if (this.model.player.position.y <= ground) {
        this.model.player.velocity.y = 0;
        this.model.player.position.y = ground;
        if (this.model.keys.jump) this.model.player.velocity.y = 16.0;
      }
      this.model.player.position.y += this.model.player.velocity.y * delta;

      this.worldView.playerGroup.position.set(this.model.player.position.x, this.model.player.position.y, this.model.player.position.z);

      // Follow Camera behind player
      const camDist = 8.5;
      const camH = 3.5 + this.model.player.pitch * 4.0;
      const tX = this.model.player.position.x + Math.sin(this.model.player.rotationY) * camDist;
      const tZ = this.model.player.position.z + Math.cos(this.model.player.rotationY) * camDist;
      const tY = this.model.player.position.y + camH;

      this.worldView.camera.position.x = THREE.MathUtils.lerp(this.worldView.camera.position.x, tX, 0.15);
      this.worldView.camera.position.y = THREE.MathUtils.lerp(this.worldView.camera.position.y, tY, 0.15);
      this.worldView.camera.position.z = THREE.MathUtils.lerp(this.worldView.camera.position.z, tZ, 0.15);
      this.worldView.camera.lookAt(this.model.player.position.x, this.model.player.position.y + 1.8, this.model.player.position.z);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.1);

    TWEEN.update();
    this.updatePhysics(delta);

    if (this.model.currentMode === 'orbit') {
      this.worldView.orbitControls.update();
    }

    this.worldView.updateRisingDots();
    this.worldView.updateMeteors(delta);
    this.hudView.updateRadar(this.model.player.position, this.model.landmarks, this.model.currentMode === 'walk');
    this.worldView.render();
  }
}
