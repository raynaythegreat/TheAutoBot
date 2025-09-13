// The POT Bot App Controller
class POTBotApp {
    constructor() {
        this.isInitialized = false;
        this.currentPage = 'main';
        
        this.initializeApp();
    }
    
    async initializeApp() {
        try {
            console.log('Initializing The POT Bot...');
            
            // Check for required APIs
            await this.checkRequirements();
            
            // Initialize components
            this.initializeComponents();
            
            // Bind global events
            this.bindGlobalEvents();
            
            this.isInitialized = true;
            console.log('The POT Bot initialized successfully');
            
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
        // Wait for Camera module to be available
        this.waitForCameraModule().then(() => {
            console.log('Camera module loaded successfully');
        }).catch(error => {
            console.error('Failed to load camera module:', error);
            this.showError('Failed to load camera module. Please refresh and try again.');
        });
    }
    
    async waitForCameraModule() {
        // Wait for Camera module
        let attempts = 0;
        while (!window.potBotCamera && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.potBotCamera) {
            throw new Error('POT Bot Camera module not loaded');
        }
        
        console.log('Camera module loaded successfully');
    }
    
    bindGlobalEvents() {
        // Handle start camera button
        const startCameraBtn = document.getElementById('startCameraBtn');
        if (startCameraBtn) {
            startCameraBtn.addEventListener('click', () => {
                this.startCamera();
            });
        }
        
        // Handle PocketOption button
        const openPocketOptionBtn = document.getElementById('openPocketOptionBtn');
        if (openPocketOptionBtn) {
            openPocketOptionBtn.addEventListener('click', () => {
                this.openPocketOption();
            });
        }
        
        // Handle app visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onAppHidden();
            } else {
                this.onAppVisible();
            }
        });
    }
    
    startCamera() {
        try {
            // Switch to camera page
            this.showPage('camera');
            
            // Start camera after a short delay to ensure page is visible
            setTimeout(() => {
                if (window.potBotCamera) {
                    window.potBotCamera.startCamera();
                }
            }, 100);
            
        } catch (error) {
            console.error('Failed to start camera:', error);
            this.showError('Failed to start camera. Please try again.');
        }
    }
    
    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }
    
    openPocketOption() {
        const url = 'https://pocket-friends.com/r/k9fb7vp1y9';
        window.open(url, '_blank');
        this.showNotification('Opening Pocket Option registration...');
    }
    
    onAppHidden() {
        console.log('App hidden');
        if (this.currentPage === 'camera' && window.potBotCamera && window.potBotCamera.isActive) {
            // Pause camera when app is hidden
            if (window.potBotCamera.stream) {
                window.potBotCamera.stream.getTracks().forEach(track => track.enabled = false);
            }
        }
    }
    
    onAppVisible() {
        console.log('App visible');
        if (this.currentPage === 'camera' && window.potBotCamera && window.potBotCamera.isActive) {
            // Resume camera when app is visible
            if (window.potBotCamera.stream) {
                window.potBotCamera.stream.getTracks().forEach(track => track.enabled = true);
            }
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
    getCurrentPage() {
        return this.currentPage;
    }
    
    isCameraActive() {
        return window.pocketOptionCamera && window.pocketOptionCamera.isActive;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.potBotApp = new POTBotApp();
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