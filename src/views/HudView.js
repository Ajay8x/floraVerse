/**
 * AETHERIA - HudView (V in MVC - User Interface)
 * Handles all HUD elements, tooltips, toasts, radar, and modals.
 */
export class HudView {
  constructor() {
    this.canvas = document.getElementById('metaverse-canvas');
    this.crosshair = document.getElementById('crosshair');
    this.hoverTooltip = document.getElementById('hover-tooltip');
    this.tooltipId = document.getElementById('tooltip-id');
    this.tooltipName = document.getElementById('tooltip-name');
    this.toast = document.getElementById('metaverse-toast');
    this.statFps = document.getElementById('stat-fps');
    this.radarCanvas = document.getElementById('radar-canvas');
    this.radarCtx = this.radarCanvas ? this.radarCanvas.getContext('2d') : null;
    this.radarCoords = document.getElementById('radar-coords');

    this.btnOrbit = document.getElementById('btn-mode-orbit');
    this.btnWalk = document.getElementById('btn-mode-walk');
    this.btnFly = document.getElementById('btn-mode-fly');
    this.hudControlsCard = document.getElementById('hud-controls-card');
    this.btnCutModes = document.getElementById('btn-cut-modes');
    this.btnRestoreModes = document.getElementById('btn-restore-modes');

    this.inspectCard = document.getElementById('inspect-card');
    this.inspectId = document.getElementById('inspect-id');
    this.inspectName = document.getElementById('inspect-name');
    this.inspectSpecies = document.getElementById('inspect-species');
    this.btnCloseInspect = document.getElementById('btn-close-inspect');
    this.btnInspectMacro = document.getElementById('btn-inspect-macro');

    // Drawer
    this.codeDrawer = document.getElementById('world-code-drawer');
    this.btnOpenTerminal = document.getElementById('btn-open-terminal');
    this.btnDrawerClose = document.getElementById('drawer-close');

    // Additional 10 Libraries Panes
    this.btnToggleDrone = document.getElementById('btn-toggle-drone');
    this.dronePanel = document.getElementById('babylon-drone-panel');
    this.btnCloseDrone = document.getElementById('btn-close-drone');

    this.btnToggleSpline = document.getElementById('btn-toggle-spline');
    this.splinePanel = document.getElementById('spline-modal-panel');
    this.btnCloseSpline = document.getElementById('btn-close-spline');

    this.initCutButtons();
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.innerText = message;
    this.toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.toast.classList.remove('show'), 3000);
  }

  showTooltip(x, y, entityId, name) {
    if (!this.hoverTooltip) return;
    this.tooltipId.innerText = `ID: ${entityId}`;
    this.tooltipName.innerText = name;
    this.hoverTooltip.style.left = `${x}px`;
    this.hoverTooltip.style.top = `${y}px`;
    this.hoverTooltip.classList.add('visible');
  }

  hideTooltip() {
    if (this.hoverTooltip) {
      this.hoverTooltip.classList.remove('visible');
    }
  }

  setModeButtons(activeMode) {
    [this.btnOrbit, this.btnWalk, this.btnFly].forEach(b => b?.classList.remove('active'));
    if (activeMode === 'orbit') this.btnOrbit?.classList.add('active');
    if (activeMode === 'walk') this.btnWalk?.classList.add('active');
    if (activeMode === 'fly') this.btnFly?.classList.add('active');
  }

  initCutButtons() {
    this.btnCutModes?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.hudControlsCard) this.hudControlsCard.style.display = 'none';
      if (this.btnRestoreModes) this.btnRestoreModes.classList.add('visible');
      this.showToast('Modes panel hidden. Click "🎮 Modes" to restore.');
    });

    this.btnRestoreModes?.addEventListener('click', () => {
      if (this.hudControlsCard) this.hudControlsCard.style.display = 'block';
      if (this.btnRestoreModes) this.btnRestoreModes.classList.remove('visible');
    });

    this.btnCloseInspect?.addEventListener('click', () => {
      this.inspectCard?.classList.remove('show');
    });

    this.btnOpenTerminal?.addEventListener('click', () => {
      this.codeDrawer?.classList.toggle('collapsed');
    });

    this.btnDrawerClose?.addEventListener('click', () => {
      this.codeDrawer?.classList.add('collapsed');
    });
  }

  updateRadar(playerPos, landmarks, isWalk) {
    if (!this.radarCtx) return;
    const ctx = this.radarCtx;
    const size = 160;
    const center = size / 2;
    const scale = 0.35;

    ctx.clearRect(0, 0, size, size);

    // Grid circles
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center, center, 30, 0, Math.PI * 2);
    ctx.arc(center, center, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(center, 10); ctx.lineTo(center, size - 10);
    ctx.moveTo(10, center); ctx.lineTo(size - 10, center);
    ctx.stroke();

    // Landmarks
    landmarks.forEach(lm => {
      const rx = center + lm.pos[0] * scale;
      const rz = center + lm.pos[2] * scale;
      ctx.fillStyle = '#ff2a6d';
      ctx.beginPath();
      ctx.arc(rx, rz, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player Pin
    const px = center + playerPos.x * scale;
    const pz = center + playerPos.z * scale;
    ctx.fillStyle = '#05ffa1';
    ctx.beginPath();
    ctx.arc(px, pz, isWalk ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (this.radarCoords) {
      this.radarCoords.innerText = `X: ${Math.round(playerPos.x)} | Z: ${Math.round(playerPos.z)}`;
    }
  }
}
