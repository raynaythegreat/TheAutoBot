// Camera functionality for chart analysis
class CameraManager {
    constructor() {
        this.stream = null;
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('captureCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.startBtn = document.getElementById('startCameraBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.stopBtn = document.getElementById('stopCameraBtn');
        
        this.analysisResults = document.getElementById('analysisResults');
        this.createSignalBtn = document.getElementById('createSignalBtn');
        this.retryAnalysisBtn = document.getElementById('retryAnalysisBtn');
        
        this.isAnalyzing = false;
        this.lastCapture = null;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.captureAndAnalyze());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        this.createSignalBtn.addEventListener('click', () => this.createSignalFromAnalysis());
        this.retryAnalysisBtn.addEventListener('click', () => this.retryAnalysis());
    }
    
    async startCamera() {
        try {
            // Request camera access with specific constraints for chart analysis
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    frameRate: { ideal: 30, min: 15 }
                },
                audio: false
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            
            // Update UI state
            this.startBtn.disabled = true;
            this.captureBtn.disabled = false;
            this.stopBtn.disabled = false;
            
            // Show camera preview
            this.video.style.display = 'block';
            
            // Add camera quality indicator
            this.showCameraStatus('Camera active - Point at PocketOption chart');
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Unable to access camera. Please ensure camera permissions are granted.');
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.video.style.display = 'none';
        
        // Reset UI state
        this.startBtn.disabled = false;
        this.captureBtn.disabled = true;
        this.stopBtn.disabled = true;
        
        // Hide analysis results
        this.analysisResults.style.display = 'none';
        
        this.showCameraStatus('Camera stopped');
    }
    
    async captureAndAnalyze() {
        if (this.isAnalyzing) return;
        
        try {
            this.isAnalyzing = true;
            this.captureBtn.disabled = true;
            
            // Show loading state
            this.showLoading('Capturing and analyzing chart...');
            
            // Capture frame from video
            const imageData = this.captureFrame();
            this.lastCapture = imageData;
            
            // Simulate AI analysis delay
            await this.delay(2000);
            
            // Perform AI analysis
            const analysisResult = await this.analyzeChart(imageData);
            
            // Display results
            this.displayAnalysisResults(analysisResult);
            
            // Hide loading
            this.hideLoading();
            
        } catch (error) {
            console.error('Error during capture and analysis:', error);
            this.showError('Analysis failed. Please try again.');
            this.hideLoading();
        } finally {
            this.isAnalyzing = false;
            this.captureBtn.disabled = false;
        }
    }
    
    captureFrame() {
        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0);
        
        // Get image data
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }
    
    async analyzeChart(imageData) {
        // Simulate AI analysis of the captured chart
        // In a real implementation, this would send the image to an AI service
        
        const mockAnalysis = {
            detectedAsset: this.detectAsset(),
            chartPattern: this.detectPattern(),
            trendDirection: this.detectTrend(),
            confidenceLevel: this.calculateConfidence(),
            recommendedAction: this.getRecommendation(),
            technicalIndicators: this.getTechnicalIndicators(),
            marketConditions: this.getMarketConditions()
        };
        
        return mockAnalysis;
    }
    
    detectAsset() {
        // Simulate asset detection based on chart characteristics
        const assets = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY'];
        return assets[Math.floor(Math.random() * assets.length)];
    }
    
    detectPattern() {
        const patterns = [
            'Ascending Triangle',
            'Descending Triangle',
            'Head and Shoulders',
            'Double Top',
            'Double Bottom',
            'Flag Pattern',
            'Pennant',
            'Wedge Formation',
            'Channel Breakout',
            'Support/Resistance'
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    detectTrend() {
        const trends = ['Bullish', 'Bearish', 'Sideways'];
        return trends[Math.floor(Math.random() * trends.length)];
    }
    
    calculateConfidence() {
        // Generate confidence between 65% and 95%
        return Math.floor(Math.random() * 30) + 65;
    }
    
    getRecommendation() {
        const actions = ['CALL', 'PUT'];
        return actions[Math.floor(Math.random() * actions.length)];
    }
    
    getTechnicalIndicators() {
        return {
            rsi: Math.floor(Math.random() * 40) + 30, // 30-70
            macd: (Math.random() - 0.5) * 0.02, // -0.01 to 0.01
            bollinger: Math.random() > 0.5 ? 'Upper Band' : 'Lower Band',
            movingAverage: Math.random() > 0.5 ? 'Above' : 'Below'
        };
    }
    
    getMarketConditions() {
        return {
            volatility: Math.floor(Math.random() * 3) + 1, // 1-3
            volume: Math.floor(Math.random() * 3) + 1, // 1-3
            momentum: Math.floor(Math.random() * 3) + 1 // 1-3
        };
    }
    
    displayAnalysisResults(analysis) {
        // Update analysis result elements
        document.getElementById('detectedAsset').textContent = analysis.detectedAsset;
        document.getElementById('chartPattern').textContent = analysis.chartPattern;
        document.getElementById('trendDirection').textContent = analysis.trendDirection;
        document.getElementById('confidenceLevel').textContent = `${analysis.confidenceLevel}%`;
        document.getElementById('recommendedAction').textContent = analysis.recommendedAction;
        
        // Style the recommended action
        const actionElement = document.getElementById('recommendedAction');
        actionElement.className = 'value';
        if (analysis.recommendedAction === 'CALL') {
            actionElement.style.color = '#00ff88';
            actionElement.style.fontWeight = 'bold';
        } else {
            actionElement.style.color = '#ff4444';
            actionElement.style.fontWeight = 'bold';
        }
        
        // Show analysis results
        this.analysisResults.style.display = 'block';
        
        // Store analysis for signal creation
        this.currentAnalysis = analysis;
    }
    
    async createSignalFromAnalysis() {
        if (!this.currentAnalysis) return;
        
        try {
            this.showLoading('Creating signal from analysis...');
            
            // Create signal based on analysis
            const signal = {
                id: Date.now(),
                asset: this.currentAnalysis.detectedAsset,
                action: this.currentAnalysis.recommendedAction,
                confidence: this.currentAnalysis.confidenceLevel,
                timeframe: this.getOptimalTimeframe(),
                pattern: this.currentAnalysis.chartPattern,
                trend: this.currentAnalysis.trendDirection,
                technicalIndicators: this.currentAnalysis.technicalIndicators,
                marketConditions: this.currentAnalysis.marketConditions,
                timestamp: new Date(),
                source: 'Camera Analysis',
                imageData: this.lastCapture
            };
            
            // Add to signals list
            window.signalsManager.addSignal(signal);
            
            // Show success message
            this.showSuccess('Signal created successfully!');
            
            // Switch to signals tab
            window.app.switchTab('signals');
            
        } catch (error) {
            console.error('Error creating signal:', error);
            this.showError('Failed to create signal. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    getOptimalTimeframe() {
        const timeframes = ['1m', '5m', '15m', '30m', '1h'];
        return timeframes[Math.floor(Math.random() * timeframes.length)];
    }
    
    retryAnalysis() {
        if (this.lastCapture) {
            this.captureAndAnalyze();
        } else {
            this.showError('No previous capture available. Please capture a new image.');
        }
    }
    
    showCameraStatus(message) {
        // Update camera status in UI
        const statusElement = document.querySelector('.camera-header p');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
    
    showLoading(message) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        loadingText.textContent = message;
        loadingOverlay.classList.add('active');
    }
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('active');
    }
    
    showError(message) {
        // Create and show error notification
        this.showNotification(message, 'error');
    }
    
    showSuccess(message) {
        // Create and show success notification
        this.showNotification(message, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Cleanup method
    destroy() {
        this.stopCamera();
        // Remove event listeners
        this.startBtn.removeEventListener('click', this.startCamera);
        this.captureBtn.removeEventListener('click', this.captureAndAnalyze);
        this.stopBtn.removeEventListener('click', this.stopCamera);
        this.createSignalBtn.removeEventListener('click', this.createSignalFromAnalysis);
        this.retryAnalysisBtn.removeEventListener('click', this.retryAnalysis);
    }
}

// Initialize camera manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cameraManager = new CameraManager();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 46, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        color: #fff;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.error {
        border-left: 4px solid #ff4444;
    }
    
    .notification.success {
        border-left: 4px solid #00ff88;
    }
    
    .notification.info {
        border-left: 4px solid #00d4ff;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification.error .notification-content i {
        color: #ff4444;
    }
    
    .notification.success .notification-content i {
        color: #00ff88;
    }
    
    .notification.info .notification-content i {
        color: #00d4ff;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
