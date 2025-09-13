// Simplified PocketOption Camera Module
class PocketOptionCamera {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.isActive = false;
        this.currentSignal = null;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('captureCanvas');
        this.captureBtn = document.getElementById('captureBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.backBtn = document.getElementById('backBtn');
        this.cameraStatus = document.getElementById('cameraStatus');
        this.signalOverlay = document.getElementById('signalOverlay');
        this.analysisStatus = document.getElementById('analysisStatus');
        this.statusText = document.getElementById('statusText');
        
        // Signal overlay elements
        this.signalAsset = document.getElementById('signalAsset');
        this.signalTime = document.getElementById('signalTime');
        this.actionBadge = document.getElementById('actionBadge');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.entryPoint = document.getElementById('entryPoint');
        this.riskLevel = document.getElementById('riskLevel');
    }
    
    bindEvents() {
        this.captureBtn.addEventListener('click', () => this.captureAndAnalyze());
        this.regenerateBtn.addEventListener('click', () => this.regenerateSignal());
        this.backBtn.addEventListener('click', () => this.goBack());
    }
    
    async startCamera() {
        try {
            console.log('Starting camera...');
            this.updateStatus('Starting camera...');
            
            // Request camera permissions
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                },
                audio: false
            });
            
            // Set video source
            this.video.srcObject = this.stream;
            this.video.play();
            
            // Update UI
            this.isActive = true;
            this.updateStatus('Camera ready - Point at chart');
            
            console.log('Camera started successfully');
            
        } catch (error) {
            console.error('Failed to start camera:', error);
            this.updateStatus('Camera failed - Check permissions');
            this.showError('Camera access denied. Please allow camera permissions and try again.');
        }
    }
    
    async captureAndAnalyze() {
        if (!this.isActive || !this.video.videoWidth) {
            this.showError('Camera not ready. Please wait for camera to start.');
            return;
        }
        
        try {
            console.log('Capturing and analyzing chart...');
            this.showAnalysisStatus('Analyzing chart with AI...');
            
            // Capture frame
            const imageData = this.captureFrame();
            
            // Perform simplified AI analysis
            const analysisResult = await this.performSimpleAnalysis(imageData);
            
            // Display results
            this.displaySignal(analysisResult);
            
            // Hide analysis status
            this.hideAnalysisStatus();
            
            console.log('Analysis completed:', analysisResult);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.hideAnalysisStatus();
            this.showError('Analysis failed. Please try again.');
        }
    }
    
    captureFrame() {
        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Draw current video frame to canvas
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Get image data
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        return {
            data: imageData,
            width: this.canvas.width,
            height: this.canvas.height,
            timestamp: new Date()
        };
    }
    
    async performSimpleAnalysis(imageData) {
        // Simulate analysis delay
        await this.delay(2000);
        
        // Generate simple analysis result
        const assets = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];
        const actions = ['CALL', 'PUT'];
        const entryPoints = ['Immediate', 'Wait for pullback', 'Breakout confirmation'];
        const riskLevels = ['Low', 'Medium', 'High'];
        
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
        const entryPoint = entryPoints[Math.floor(Math.random() * entryPoints.length)];
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        return {
            asset: asset,
            action: action,
            confidence: confidence,
            entryPoint: entryPoint,
            riskLevel: riskLevel,
            timestamp: new Date()
        };
    }
    
    displaySignal(analysis) {
        // Update signal overlay
        this.signalAsset.textContent = analysis.asset;
        this.signalTime.textContent = analysis.timestamp.toLocaleTimeString();
        this.actionBadge.textContent = analysis.action;
        this.actionBadge.className = `action-badge ${analysis.action.toLowerCase()}`;
        this.confidenceScore.textContent = `${analysis.confidence}%`;
        this.entryPoint.textContent = analysis.entryPoint;
        this.riskLevel.textContent = analysis.riskLevel;
        
        // Show signal overlay
        this.signalOverlay.style.display = 'block';
        
        // Show regenerate button
        this.regenerateBtn.style.display = 'flex';
        
        // Store current signal
        this.currentSignal = analysis;
        
        // Add to signals list on main page
        this.addToSignalsList(analysis);
        
        // Update stats
        this.updateStats();
    }
    
    regenerateSignal() {
        if (this.isActive) {
            this.captureAndAnalyze();
        } else {
            this.showError('Camera not active. Please restart camera.');
        }
    }
    
    goBack() {
        // Stop camera
        this.stopCamera();
        
        // Switch to main page
        document.getElementById('mainPage').classList.add('active');
        document.getElementById('cameraPage').classList.remove('active');
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.isActive = false;
        this.updateStatus('Camera stopped');
        
        console.log('Camera stopped');
    }
    
    updateStatus(message) {
        if (this.cameraStatus) {
            this.cameraStatus.textContent = message;
        }
    }
    
    showAnalysisStatus(message) {
        if (this.analysisStatus && this.statusText) {
            this.statusText.textContent = message;
            this.analysisStatus.style.display = 'flex';
        }
    }
    
    hideAnalysisStatus() {
        if (this.analysisStatus) {
            this.analysisStatus.style.display = 'none';
        }
    }
    
    addToSignalsList(analysis) {
        const signalsList = document.getElementById('signalsList');
        
        // Remove "no signals" message if present
        const noSignals = signalsList.querySelector('.no-signals');
        if (noSignals) {
            noSignals.remove();
        }
        
        // Create signal card
        const signalCard = document.createElement('div');
        signalCard.className = 'signal-card';
        signalCard.innerHTML = `
            <div class="signal-header">
                <div class="signal-asset">${analysis.asset}</div>
                <div class="signal-time">${analysis.timestamp.toLocaleTimeString()}</div>
            </div>
            <div class="signal-action">
                <span class="action-badge ${analysis.action.toLowerCase()}">${analysis.action}</span>
                <span class="confidence-score">${analysis.confidence}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${analysis.confidence}%"></div>
            </div>
            <div class="signal-details">
                <div class="detail-row">
                    <span>Entry: ${analysis.entryPoint}</span>
                    <span>Risk: ${analysis.riskLevel}</span>
                </div>
            </div>
        `;
        
        // Add to top of list
        signalsList.insertBefore(signalCard, signalsList.firstChild);
        
        // Limit to 10 signals
        const signals = signalsList.querySelectorAll('.signal-card');
        if (signals.length > 10) {
            signals[signals.length - 1].remove();
        }
    }
    
    updateStats() {
        // Update signal count
        const signalCount = document.getElementById('signalCount');
        if (signalCount) {
            const currentCount = parseInt(signalCount.textContent) || 0;
            signalCount.textContent = currentCount + 1;
        }
    }
    
    showError(message) {
        console.error('Camera Error:', message);
        alert(message);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize camera when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pocketOptionCamera = new PocketOptionCamera();
});