// Simple icon generator for The POT Bot PWA
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
function createSVGIcon(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad)" stroke="#00d4ff" stroke-width="${size/32}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size*0.6}" text-anchor="middle" dominant-baseline="middle" fill="#00d4ff">🤖</text>
        <text x="50%" y="80%" font-family="Arial, sans-serif" font-size="${size*0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#ffffff">POT</text>
    </svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for all required sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const svg = createSVGIcon(size);
    const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`Generated ${filename}`);
});

console.log('All SVG icons generated!');
console.log('Note: For production, convert these SVG files to PNG format.');
