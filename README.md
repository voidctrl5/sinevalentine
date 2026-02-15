# sinevalentine
A Valentine's Day animation where a single mathematical equation draws a heart — using nothing but waves.
What it does
As k increases from 0 → 100, the curve:
y = x² + 0.9 · sin(kx) · √(5 − x²)
starts as a smooth parabola and oscillates faster and faster — until the waves naturally fill out the silhouette of a heart. No pre-drawn outline. No tricks. Just math.
Inspired by @quantumquesterr on Instagram.

File Structure
math-heart/
├── index.html   # markup & layout
├── style.css    # dark theme, glowing title, fonts
└── script.js    # canvas drawing, math, animation loop

Features

Smooth 9-second eased animation
Glowing red curve with canvas shadow blur
Dashed coordinate axes with tick labels
Live k counter updating each frame
Replay button
Fully responsive — adapts to any screen size

Built With

HTML5 Canvas — curve rendering
Vanilla JavaScript — requestAnimationFrame animation loop
CSS3 — dark background, pulsing glow on the title
Google Fonts — Dancing Script + Courier Prime
