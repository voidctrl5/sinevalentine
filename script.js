const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

// ── Constants ─────────────────────────────────────────────────────────
const SQ5  = Math.sqrt(5);   // x domain boundary ≈ 2.2361
const XMIN = -2.5, XMAX = 2.5;
const YMIN = -1.1, YMAX = 5.2;
const STEPS    = 2000;       // curve resolution
const K_MAX    = 100;
const DURATION = 9000;       // animation duration in ms

// ── Sizing ────────────────────────────────────────────────────────────
function resize() {
  const s = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.56, 480);
  canvas.width  = Math.round(s);
  canvas.height = Math.round(s * 0.86);
}

resize();
window.addEventListener('resize', () => {
  resize();
  if (!running) drawAt(curK);
});

// ── Coordinate mapping ────────────────────────────────────────────────
// Maps math coordinates (x, y) to canvas pixel coordinates.
// y is flipped: higher math-y → lower canvas-y (up on screen).
function toCanvas(x, y) {
  const W = canvas.width, H = canvas.height;
  const pad = 0.065;
  const px = W * pad, py = H * pad;
  const cx = px + (x - XMIN) / (XMAX - XMIN) * (W - 2 * px);
  const cy = (H - py) - (y - YMIN) / (YMAX - YMIN) * (H - 2 * py);
  return [cx, cy];
}

// ── Axes ──────────────────────────────────────────────────────────────
function drawAxes() {
  const W = canvas.width;
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 60, 80, 0.28)';
  ctx.lineWidth   = 0.7;
  ctx.setLineDash([4, 7]);

  // x-axis (y = 0)
  const [ax, ay] = toCanvas(XMIN, 0);
  const [bx, by] = toCanvas(XMAX, 0);
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();

  // y-axis (x = 0)
  const [cx2, cy2] = toCanvas(0, YMIN);
  const [dx2, dy2] = toCanvas(0, YMAX);
  ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(dx2, dy2); ctx.stroke();

  ctx.setLineDash([]);

  // Tick marks & labels
  ctx.fillStyle = 'rgba(200, 90, 105, 0.45)';
  ctx.font = `${Math.max(9, W * 0.025)}px "Courier Prime", monospace`;
  ctx.textAlign = 'center';

  for (const xi of [-2, -1, 1, 2]) {
    const [tx, ty] = toCanvas(xi, 0);
    ctx.strokeStyle = 'rgba(200, 90, 105, 0.35)';
    ctx.lineWidth   = 0.7;
    ctx.beginPath(); ctx.moveTo(tx, ty - 3); ctx.lineTo(tx, ty + 3); ctx.stroke();
    ctx.fillText(xi, tx, ty + 13);
  }

  ctx.restore();
}

// ── Draw curve at a given k ───────────────────────────────────────────
// Equation: y = x² + 0.9 · sin(k·x) · √(5 − x²)
// At k=0: smooth parabola. As k grows: sine waves fill heart shape.
function drawAt(k) {
  const W = canvas.width, H = canvas.height;
  const dx = (2 * SQ5) / STEPS;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0e0407';
  ctx.fillRect(0, 0, W, H);

  drawAxes();

  // — Glow pass (wide, soft) —
  ctx.save();
  ctx.lineWidth   = 3;
  ctx.strokeStyle = 'rgba(200, 30, 55, 0.12)';
  ctx.shadowColor = 'rgba(220, 30, 55, 0.5)';
  ctx.shadowBlur  = 18;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i <= STEPS; i++) {
    const x  = -SQ5 + i * dx;
    const s2 = 5 - x * x;
    if (s2 < 0) { started = false; continue; }
    const y = x * x + 0.9 * Math.sin(k * x) * Math.sqrt(s2);
    const [cx, cy] = toCanvas(x, y);
    if (!started) { ctx.moveTo(cx, cy); started = true; }
    else            ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  ctx.restore();

  // — Main crisp curve —
  ctx.save();
  ctx.lineWidth   = 1.4;
  ctx.strokeStyle = '#e02040';
  ctx.shadowColor = 'rgba(224, 32, 64, 0.6)';
  ctx.shadowBlur  = 5;
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  started = false;
  for (let i = 0; i <= STEPS; i++) {
    const x  = -SQ5 + i * dx;
    const s2 = 5 - x * x;
    if (s2 < 0) { started = false; continue; }
    const y = x * x + 0.9 * Math.sin(k * x) * Math.sqrt(s2);
    const [cx, cy] = toCanvas(x, y);
    if (!started) { ctx.moveTo(cx, cy); started = true; }
    else            ctx.lineTo(cx, cy);
  }
  ctx.stroke();
  ctx.restore();
}

// ── Animation ─────────────────────────────────────────────────────────
let t0 = null, rafId = null, curK = 0, running = false;

function ease(t) {
  // ease-in-out quad
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function frame(ts) {
  if (!t0) t0 = ts;
  const raw = Math.min((ts - t0) / DURATION, 1);
  curK = ease(raw) * K_MAX;
  drawAt(curK);
  document.getElementById('kd').textContent = `k = ${curK.toFixed(2)}`;
  if (raw < 1) {
    rafId = requestAnimationFrame(frame);
  } else {
    running = false;
    document.getElementById('kd').textContent = `k = ${K_MAX}.00`;
  }
}

function restart() {
  if (rafId) cancelAnimationFrame(rafId);
  t0 = null; curK = 0; running = true;
  rafId = requestAnimationFrame(frame);
}

restart();
