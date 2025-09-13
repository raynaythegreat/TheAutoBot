// Create a simple brain icon as a data URL that can be converted to PNG
const brainIconSVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
    
    <!-- Brain Folds -->
    <path d="M 35 80 Q 80 55 125 80" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 35 120 Q 80 145 125 120" stroke="#1E3A8A" stroke-width="4" fill="none" stroke-linecap="round"/>
    
    <!-- Neural Network -->
    <g stroke="#60A5FA" stroke-width="3" fill="none" stroke-linecap="round">
        <line x1="55" y1="80" x2="95" y2="120"/>
        <line x1="70" y1="70" x2="110" y2="110"/>
        <line x1="90" y1="90" x2="130" y2="130"/>
    </g>
    
    <!-- AI Circuit Nodes -->
    <g fill="#93C5FD">
        <circle cx="70" cy="90" r="3"/>
        <circle cx="80" cy="100" r="3"/>
        <circle cx="90" cy="110" r="3"/>
        <circle cx="100" cy="90" r="3"/>
        <circle cx="110" cy="100" r="3"/>
        <circle cx="120" cy="110" r="3"/>
    </g>
    
    <!-- Central Processing Unit -->
    <rect x="95" y="95" width="10" height="10" fill="#1E3A8A" rx="2"/>
    <rect x="97" y="97" width="6" height="6" fill="#60A5FA" rx="1"/>
</svg>`;

// Convert SVG to data URL
const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(brainIconSVG).toString('base64');

console.log('Brain Icon SVG Data URL:');
console.log(svgDataUrl);
console.log('\nUse this data URL to create PNG files for the PWA icons.');
