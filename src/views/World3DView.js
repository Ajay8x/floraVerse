/**
 * AETHERIA - World3DView (V in MVC - 3D Graphics View)
 * Manages Three.js WebGL Scene, Meshes, Cameras, Lighting, and Rendering.
 */
export class World3DView {
  constructor(model) {
    this.model = model;
    this.canvas = document.getElementById('metaverse-canvas');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06030c, 0.008);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 35, 95);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      depth: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

    this.orbitControls = new THREE.OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.maxDistance = 450;
    this.orbitControls.minDistance = 1.0;
    this.orbitControls.target.set(0, 8, 0);

    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.landmarkGroups = [];
    this.hitboxes = [];

    this.initLights();
    this.initGlowTexture();
    this.initTerrain();
    this.initLandmarks();
    this.initPlayerBox();
    this.initRisingDots();
    this.initMeteors();

    window.addEventListener('resize', () => this.onResize());
  }

  initLights() {
    this.hemiLight = new THREE.HemisphereLight(0x9d4edd, 0x05ffa1, 0.6);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xff2a6d, 1.2);
    this.dirLight.position.set(50, 100, 50);
    this.scene.add(this.dirLight);
  }

  initGlowTexture() {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.2, 'rgba(255, 240, 250, 0.95)');
    g.addColorStop(0.55, 'rgba(0, 240, 255, 0.4)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    this.glowTexture = new THREE.CanvasTexture(c);
  }

  initTerrain() {
    const terrainRes = 240;
    const terrainSize = 500;
    const geo = new THREE.BufferGeometry();
    const count = terrainRes * terrainRes;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    let idx = 0;
    for (let i = 0; i < terrainRes; i++) {
      for (let j = 0; j < terrainRes; j++) {
        const u = i / terrainRes - 0.5;
        const v = j / terrainRes - 0.5;
        const x = u * terrainSize;
        const z = v * terrainSize;
        const y = this.model.getTerrainHeightAt(x, z);

        positions[idx * 3 + 0] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        const dist = Math.hypot(x, z);
        const col = new THREE.Color();
        if (dist < 40) {
          col.setHSL(0.92, 0.9, 0.6);
        } else if (dist < 110) {
          col.setHSL(0.55, 0.95, 0.6);
        } else {
          col.setHSL(0.75, 0.85, 0.5);
        }

        colors[idx * 3 + 0] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;
        idx++;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.terrainMesh = new THREE.Points(geo, mat);
    this.worldGroup.add(this.terrainMesh);
  }

  createNameBadge(entityId, name) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 8, 28, 0.88)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 108);
    ctx.fillRect(10, 10, 492, 108);

    ctx.font = 'bold 24px "Fira Code", monospace';
    ctx.fillStyle = '#ff2a6d';
    ctx.textAlign = 'center';
    ctx.fillText(`[ ID: ${entityId} ]`, 256, 45);

    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, 256, 92);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, 22, 0);
    sprite.scale.set(14, 3.5, 1);
    sprite.visible = false;
    sprite.name = 'badgeSprite';
    return sprite;
  }

  initLandmarks() {
    this.model.landmarks.forEach(data => {
      const g = new THREE.Group();
      g.position.set(data.pos[0], data.pos[1], data.pos[2]);
      g.userData = data;

      // Holographic Core
      const coreGeo = new THREE.SphereGeometry(3, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 8;
      g.add(core);

      // Hitbox for raycasting
      const hitGeo = new THREE.CylinderGeometry(8, 8, 24, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 10;
      hitMesh.userData = data;
      g.add(hitMesh);
      this.hitboxes.push(hitMesh);

      // 3D Billboard Badge
      const badge = this.createNameBadge(data.entityId, data.name);
      g.add(badge);

      this.worldGroup.add(g);
      this.landmarkGroups.push(g);
    });
  }

  initPlayerBox() {
    this.playerGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.6, 2.4, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0e1726,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x050f1f
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1.2;
    this.playerGroup.add(bodyMesh);

    const edgeGeo = new THREE.EdgesGeometry(bodyGeo);
    const edgeLines = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 }));
    bodyMesh.add(edgeLines);

    const visorGeo = new THREE.BoxGeometry(1.1, 0.45, 0.4);
    const visorMesh = new THREE.Mesh(visorGeo, new THREE.MeshBasicMaterial({ color: 0xff2a6d }));
    visorMesh.position.set(0, 1.8, -0.62);
    this.playerGroup.add(visorMesh);

    this.playerGroup.position.set(0, 0, 15);
    this.worldGroup.add(this.playerGroup);
  }

  initRisingDots() {
    this.pollenCount = 35000;
    const pPos = new Float32Array(this.pollenCount * 3);
    const pCol = new Float32Array(this.pollenCount * 3);
    this.pSpeed = new Float32Array(this.pollenCount);

    const hues = [0.5, 0.55, 0.82, 0.95, 0.12];
    for (let i = 0; i < this.pollenCount; i++) {
      pPos[i * 3 + 0] = (Math.random() - 0.5) * 450;
      pPos[i * 3 + 1] = -3 + Math.random() * 55;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 450;

      const c = new THREE.Color().setHSL(hues[i % hues.length], 0.95, 0.7);
      pCol[i * 3 + 0] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
      this.pSpeed[i] = 0.08 + Math.random() * 0.12;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    this.pollenGeo = geo;

    this.pollenMesh = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    this.worldGroup.add(this.pollenMesh);
  }

  initMeteors() {
    this.meteorCount = 45;
    this.meteorGeo = new THREE.BufferGeometry();
    this.meteorPos = new Float32Array(this.meteorCount * 6);
    const meteorCol = new Float32Array(this.meteorCount * 6);

    for (let i = 0; i < this.meteorCount; i++) {
      this.resetMeteor(this.meteorPos, i * 6);
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.9, 0.75);
      meteorCol[i * 6 + 0] = c.r; meteorCol[i * 6 + 1] = c.g; meteorCol[i * 6 + 2] = c.b;
      meteorCol[i * 6 + 3] = 0;   meteorCol[i * 6 + 4] = 0;   meteorCol[i * 6 + 5] = 0;
    }

    this.meteorGeo.setAttribute('position', new THREE.BufferAttribute(this.meteorPos, 3));
    this.meteorGeo.setAttribute('color', new THREE.BufferAttribute(meteorCol, 3));
    this.meteorLines = new THREE.LineSegments(this.meteorGeo, new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    }));
    this.worldGroup.add(this.meteorLines);
  }

  resetMeteor(arr, idx) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 250;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const y = 80 + Math.random() * 100;
    arr[idx + 0] = x;     arr[idx + 1] = y;      arr[idx + 2] = z;
    arr[idx + 3] = x + 3; arr[idx + 4] = y + 14; arr[idx + 5] = z + 3;
  }

  updateRisingDots() {
    if (!this.pollenMesh) return;
    const pos = this.pollenGeo.attributes.position.array;
    for (let i = 0; i < this.pollenCount; i++) {
      const idxY = i * 3 + 1;
      pos[idxY] += this.pSpeed[i];
      if (pos[idxY] > 55) {
        pos[idxY] = -3;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 450;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 450;
      }
    }
    this.pollenGeo.attributes.position.needsUpdate = true;
  }

  updateMeteors(delta) {
    if (!this.model.meteorShowerActive || !this.meteorLines) return;
    const arr = this.meteorGeo.attributes.position.array;
    for (let i = 0; i < this.meteorCount; i++) {
      const idx = i * 6;
      arr[idx + 1] -= delta * 75;
      arr[idx + 4] -= delta * 75;
      arr[idx + 0] -= delta * 18;
      arr[idx + 3] -= delta * 18;
      if (arr[idx + 1] < 5) {
        this.resetMeteor(arr, idx);
      }
    }
    this.meteorGeo.attributes.position.needsUpdate = true;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
