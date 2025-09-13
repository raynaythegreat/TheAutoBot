const fs = require('fs');
const path = require('path');

// The complete blue brain SVG from the main logo
const brainSVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#2E5BBA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
        </linearGradient>
        <filter id="brainShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
        </filter>
    </defs>
    
    <!-- White Background Circle -->
    <circle cx="100" cy="100" r="95" fill="white" stroke="#e0e0e0" stroke-width="2"/>
    
    <!-- Brain Shape - Left Hemisphere -->
    <ellipse cx="80" cy="100" rx="45" ry="65" fill="url(#brainGradient)" filter="url(#brainShadow)"/>
    
    <!-- Brain Shape - Right Hemisphere -->
    <ellipse cx="120" cy="100" rx="45" ry="65" fill="url(#brainGradient)" filter="url(#brainShadow)"/>
    
    <!-- Brain Connection -->
    <rect x="80" y="80" width="40" height="40" fill="url(#brainGradient)" filter="url(#brainShadow)"/>
    
    <!-- Brain Folds - More Prominent -->
    <path d="M 35 80 Q 80 55 125 80" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 35 120 Q 80 145 125 120" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 65 80 Q 120 55 165 80" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 65 120 Q 120 145 165 120" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    
    <!-- Neural Network - More Visible -->
    <g stroke="#60A5FA" stroke-width="3" fill="none" stroke-linecap="round">
        <line x1="55" y1="80" x2="95" y2="120"/>
        <line x1="70" y1="70" x2="110" y2="110"/>
        <line x1="90" y1="90" x2="130" y2="130"/>
        <line x1="60" y1="120" x2="100" y2="80"/>
        <line x1="75" y1="130" x2="115" y2="90"/>
        <line x1="95" y1="90" x2="135" y2="130"/>
    </g>
    
    <!-- AI Circuit Nodes - Larger -->
    <g fill="#93C5FD">
        <circle cx="70" cy="90" r="3"/>
        <circle cx="80" cy="100" r="3"/>
        <circle cx="90" cy="110" r="3"/>
        <circle cx="100" cy="90" r="3"/>
        <circle cx="110" cy="100" r="3"/>
        <circle cx="120" cy="110" r="3"/>
        <circle cx="75" cy="120" r="3"/>
        <circle cx="85" cy="130" r="3"/>
        <circle cx="95" cy="80" r="3"/>
        <circle cx="105" cy="120" r="3"/>
        <circle cx="115" cy="80" r="3"/>
        <circle cx="125" cy="130" r="3"/>
    </g>
    
    <!-- Central Processing Unit - More Prominent -->
    <rect x="95" y="95" width="10" height="10" fill="#1E3A8A" rx="2"/>
    <rect x="97" y="97" width="6" height="6" fill="#60A5FA" rx="1"/>
    
    <!-- Data Flow Lines - More Visible -->
    <g stroke="#3B82F6" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8">
        <path d="M 80 80 Q 100 70 120 80"/>
        <path d="M 80 120 Q 100 130 120 120"/>
        <path d="M 60 100 Q 80 100 100 100"/>
        <path d="M 100 100 Q 120 100 140 100"/>
    </g>
</svg>`;

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple HTML file that can be used to generate PNG icons
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Brain Icon Generator</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        .icon-container { 
            display: inline-block; 
            margin: 10px; 
            padding: 10px; 
            background: white; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .icon-container h3 { margin: 0 0 10px 0; text-align: center; }
        .icon { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <h1>The Auto Bot - Brain Icon Generator</h1>
    <p>Right-click on each icon and "Save image as..." to save as PNG files.</p>
    
    ${iconSizes.map(size => `
        <div class="icon-container">
            <h3>${size}x${size}</h3>
            <svg class="icon" width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="brainGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#2E5BBA;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
                    </linearGradient>
                    <filter id="brainShadow${size}">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
                    </filter>
                </defs>
                
                <!-- White Background Circle -->
                <circle cx="100" cy="100" r="95" fill="white" stroke="#e0e0e0" stroke-width="2"/>
                
                <!-- Brain Shape - Left Hemisphere -->
                <ellipse cx="80" cy="100" rx="45" ry="65" fill="url(#brainGradient${size})" filter="url(#brainShadow${size})"/>
                
                <!-- Brain Shape - Right Hemisphere -->
                <ellipse cx="120" cy="100" rx="45" ry="65" fill="url(#brainGradient${size})" filter="url(#brainShadow${size})"/>
                
                <!-- Brain Connection -->
                <rect x="80" y="80" width="40" height="40" fill="url(#brainGradient${size})" filter="url(#brainShadow${size})"/>
                
                <!-- Brain Folds - More Prominent -->
                <path d="M 35 80 Q 80 55 125 80" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M 35 120 Q 80 145 125 120" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M 65 80 Q 120 55 165 80" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M 65 120 Q 120 145 165 120" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
                
                <!-- Neural Network - More Visible -->
                <g stroke="#60A5FA" stroke-width="3" fill="none" stroke-linecap="round">
                    <line x1="55" y1="80" x2="95" y2="120"/>
                    <line x1="70" y1="70" x2="110" y2="110"/>
                    <line x1="90" y1="90" x2="130" y2="130"/>
                    <line x1="60" y1="120" x2="100" y2="80"/>
                    <line x1="75" y1="130" x2="115" y2="90"/>
                    <line x1="95" y1="90" x2="135" y2="130"/>
                </g>
                
                <!-- AI Circuit Nodes - Larger -->
                <g fill="#93C5FD">
                    <circle cx="70" cy="90" r="3"/>
                    <circle cx="80" cy="100" r="3"/>
                    <circle cx="90" cy="110" r="3"/>
                    <circle cx="100" cy="90" r="3"/>
                    <circle cx="110" cy="100" r="3"/>
                    <circle cx="120" cy="110" r="3"/>
                    <circle cx="75" cy="120" r="3"/>
                    <circle cx="85" cy="130" r="3"/>
                    <circle cx="95" cy="80" r="3"/>
                    <circle cx="105" cy="120" r="3"/>
                    <circle cx="115" cy="80" r="3"/>
                    <circle cx="125" cy="130" r="3"/>
                </g>
                
                <!-- Central Processing Unit - More Prominent -->
                <rect x="95" y="95" width="10" height="10" fill="#1E3A8A" rx="2"/>
                <rect x="97" y="97" width="6" height="6" fill="#60A5FA" rx="1"/>
                
                <!-- Data Flow Lines - More Visible -->
                <g stroke="#3B82F6" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8">
                    <path d="M 80 80 Q 100 70 120 80"/>
                    <path d="M 80 120 Q 100 130 120 120"/>
                    <path d="M 60 100 Q 80 100 100 100"/>
                    <path d="M 100 100 Q 120 100 140 100"/>
                </g>
            </svg>
        </div>
    `).join('')}
    
    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 10px;">
        <h2>Instructions:</h2>
        <ol>
            <li>Right-click on each icon above</li>
            <li>Select "Save image as..."</li>
            <li>Save with the filename: icon-[size]x[size].png (e.g., icon-192x192.png)</li>
            <li>Save all icons to the assets/icons/ folder</li>
        </ol>
        
        <h3>Required Files:</h3>
        <ul>
            ${iconSizes.map(size => `<li>icon-${size}x${size}.png</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;

// Write the HTML file
fs.writeFileSync('generate-brain-icons.html', htmlContent);

console.log('✅ Brain icon generator created: generate-brain-icons.html');
console.log('📱 Open this file in your browser to generate all required icon sizes');
console.log('🎯 Each icon will match the main blue brain logo exactly');
console.log('💾 Save all icons to assets/icons/ folder with proper filenames');