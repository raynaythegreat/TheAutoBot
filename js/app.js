// PocketOption AI Signals App Controller
class PocketOptionApp {
    constructor() {
        this.isInitialized = false;
        this.currentSignal = null;
        this.signalHistory = [];
        
        this.initializeApp();
    }
    
    async initializeApp() {
        try {
            console.log('Initializing PocketOption AI Signals App...');
            
            // Check for required APIs
            await this.checkRequirements();
            
            // Initialize components
            this.initializeComponents();
            
            // Bind global events
            this.bindGlobalEvents();
            
            this.isInitialized = true;
            console.log('PocketOption AI Signals App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app. Please refresh and try again.');
        }
    }
    
    async checkRequirements() {
        // Check for required browser APIs
        const requiredAPIs = [
            { name: 'Camera API', check: () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia },
            { name: 'Canvas API', check: () => document.createElement('canvas').getContext },
            { name: 'Local Storage', check: () => typeof Storage !== 'undefined' }
        ];
        
        const missingAPIs = requiredAPIs.filter(api => !api.check());
        
        if (missingAPIs.length > 0) {
            throw new Error(`Missing required APIs: ${missingAPIs.map(api => api.name).join(', ')}`);
        }
        
        // Check for HTTPS (required for camera)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            throw new Error('HTTPS is required for camera access. Please use HTTPS or localhost.');
        }
    }
    
    initializeComponents() {
        // Initialize PocketOption AI (already done in ai-analysis.js)
        if (!window.pocketOptionAI) {
            throw new Error('PocketOption AI not initialized');
        }
        
        // Initialize Camera (already done in camera.js)
        if (!window.pocketOptionCamera) {
            throw new Error('PocketOption Camera not initialized');
        }
        
        // Initialize PocketOption integration
        this.initializePocketOptionIntegration();
    }
    
    initializePocketOptionIntegration() {
        const openPocketOptionBtn = document.getElementById('openPocketOptionBtn');
        if (openPocketOptionBtn) {
            openPocketOptionBtn.addEventListener('click', () => {
                this.openPocketOption();
            });
        }
    }
    
    bindGlobalEvents() {
        // Handle app visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onAppHidden();
            } else {
                this.onAppVisible();
            }
        });
        
        // Handle retry analysis button
        const retryBtn = document.getElementById('retryAnalysisBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryAnalysis();
            });
        }
        
        // Handle execute signal button
        const executeBtn = document.getElementById('executeSignalBtn');
        if (executeBtn) {
            executeBtn.addEventListener('click', () => {
                this.executeCurrentSignal();
            });
        }
    }
    
    openPocketOption() {
        const url = 'https://pocketoption.com/en/trade';
        window.open(url, '_blank');
        this.showNotification('Opening PocketOption...');
    }
    
    retryAnalysis() {
        if (window.pocketOptionCamera && window.pocketOptionCamera.isActive) {
            window.pocketOptionCamera.captureAndAnalyze();
        } else {
            this.showError('Camera not active. Please start camera first.');
        }
    }
    
    executeCurrentSignal() {
        if (this.currentSignal) {
            window.pocketOptionCamera.executeTrade(this.currentSignal);
        } else {
            this.showError('No signal available. Please analyze a chart first.');
        }
    }
    
    onAppHidden() {
        console.log('App hidden - pausing camera');
        if (window.pocketOptionCamera && window.pocketOptionCamera.isActive) {
            window.pocketOptionCamera.pauseCamera();
        }
    }
    
    onAppVisible() {
        console.log('App visible - resuming camera');
        if (window.pocketOptionCamera && window.pocketOptionCamera.isActive) {
            window.pocketOptionCamera.resumeCamera();
        }
    }
    
    showError(message) {
        console.error('App Error:', message);
        alert(message);
    }
    
    showNotification(message) {
        console.log('App Notification:', message);
        alert(message);
    }
    
    // Public API methods
    getCurrentSignal() {
        return this.currentSignal;
    }
    
    getSignalHistory() {
        return this.signalHistory;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pocketOptionApp = new PocketOptionApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}