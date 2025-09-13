const fs = require('fs');
const path = require('path');

// Create a simple brain icon generator using canvas-like approach
function generateBrainIcon(size) {
    // This is a simplified approach - in a real implementation, you'd use a canvas library
    // For now, we'll create SVG-based icons that can be converted to PNG
    
    const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2E5BBA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Brain Background -->
  <ellipse cx="200" cy="256" rx="120" ry="180" fill="url(#brainGradient)" filter="url(#glow)"/>
  <ellipse cx="312" cy="256" rx="120" ry="180" fill="url(#brainGradient)" filter="url(#glow)"/>
  <rect x="200" y="200" width="112" height="112" fill="url(#brainGradient)" filter="url(#glow)"/>
  
  <!-- Brain Folds -->
  <path d="M 100 200 Q 200 150 300 200" stroke="#1E3A8A" stroke-width="8" fill="none"/>
  <path d="M 100 312 Q 200 362 300 312" stroke="#1E3A8A" stroke-width="8" fill="none"/>
  <path d="M 212 200 Q 312 150 412 200" stroke="#1E3A8A" stroke-width="8" fill="none"/>
  <path d="M 212 312 Q 312 362 412 312" stroke="#1E3A8A" stroke-width="8" fill="none"/>
  
  <!-- Neural Network -->
  <g stroke="#60A5FA" stroke-width="3" fill="none">
    <line x1="150" y1="200" x2="250" y2="300"/>
    <line x1="180" y1="180" x2="280" y2="280"/>
    <line x1="220" y1="220" x2="320" y2="320"/>
    <line x1="160" y1="320" x2="260" y2="220"/>
    <line x1="190" y1="340" x2="290" y2="240"/>
    <line x1="230" y1="240" x2="330" y2="340"/>
  </g>
  
  <!-- AI Circuit Nodes -->
  <g fill="#93C5FD">
    <circle cx="170" cy="220" r="4"/>
    <circle cx="200" cy="250" r="4"/>
    <circle cx="230" cy="280" r="4"/>
    <circle cx="260" cy="220" r="4"/>
    <circle cx="290" cy="250" r="4"/>
    <circle cx="320" cy="280" r="4"/>
    <circle cx="180" cy="300" r="4"/>
    <circle cx="210" cy="330" r="4"/>
    <circle cx="240" cy="200" r="4"/>
    <circle cx="270" cy="300" r="4"/>
    <circle cx="300" cy="200" r="4"/>
    <circle cx="330" cy="330" r="4"/>
  </g>
  
  <!-- Central Processing Unit -->
  <rect x="240" y="240" width="32" height="32" fill="#1E3A8A" rx="4"/>
  <rect x="244" y="244" width="24" height="24" fill="#60A5FA" rx="2"/>
  
  <!-- Data Flow Lines -->
  <g stroke="#3B82F6" stroke-width="2" fill="none" opacity="0.7">
    <path d="M 200 200 Q 256 180 312 200"/>
    <path d="M 200 312 Q 256 332 312 312"/>
    <path d="M 150 256 Q 200 256 250 256"/>
    <path d="M 262 256 Q 312 256 362 256"/>
  </g>
</svg>`;

    return svg;
}

// Generate icons for all required sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure assets/icons directory exists
const iconsDir = path.join(__dirname, 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files for each size
sizes.forEach(size => {
    const svg = generateBrainIcon(size);
    const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('All brain icons generated successfully!');
console.log('Note: You may need to convert SVG to PNG for PWA compatibility.');
