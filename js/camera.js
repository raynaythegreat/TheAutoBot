// PocketOption Camera Module
class PocketOptionCamera {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.isActive = false;
        this.captureCount = 0;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('captureCanvas');
        this.startBtn = document.getElementById('startCameraBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.stopBtn = document.getElementById('stopCameraBtn');
        this.analysisResults = document.getElementById('analysisResults');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.captureAndAnalyze());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        
        // Handle visibility change to pause/resume camera
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isActive) {
                this.pauseCamera();
            } else if (!document.hidden && this.isActive) {
                this.resumeCamera();
            }
        });
    }
    
    async startCamera() {
        try {
            console.log('Starting PocketOption camera...');
            
            // Request camera permissions
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment' // Use back camera if available
                },
                audio: false
            });
            
            // Set video source
            this.video.srcObject = this.stream;
            this.video.play();
            
            // Update UI
            this.isActive = true;
            this.updateButtonStates();
            
            // Hide analysis results
            this.analysisResults.style.display = 'none';
            
            console.log('PocketOption camera started successfully');
            
        } catch (error) {
            console.error('Failed to start camera:', error);
            this.showError('Camera access denied. Please allow camera permissions and try again.');
        }
    }
    
    async captureAndAnalyze() {
        if (!this.isActive || !this.video.videoWidth) {
            this.showError('Camera not ready. Please start camera first.');
            return;
        }
        
        try {
            console.log('Capturing chart for PocketOption analysis...');
            this.captureCount++;
            
            // Show loading overlay
            this.showLoading('Analyzing chart with PocketOption AI...');
            
            // Capture frame
            const imageData = this.captureFrame();
            
            // Perform AI analysis
            const analysisResult = await window.pocketOptionAI.analyzeChart(imageData);
            
            // Display results
            this.displayAnalysisResults(analysisResult);
            
            // Hide loading
            this.hideLoading();
            
            console.log('PocketOption analysis completed:', analysisResult);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.hideLoading();
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
            timestamp: new Date(),
            captureId: this.captureCount
        };
    }
    
    displayAnalysisResults(analysis) {
        // Update analysis display
        document.getElementById('detectedAsset').textContent = analysis.asset;
        document.getElementById('trendDirection').textContent = analysis.finalSignal.action;
        document.getElementById('hhllPattern').textContent = analysis.strategies.hhll.pattern;
        document.getElementById('supportResistance').textContent = analysis.strategies.supportResistance.pattern;
        document.getElementById('wyckoffPhase').textContent = analysis.strategies.wyckoff.phase;
        document.getElementById('movingAverages').textContent = analysis.strategies.movingAverages.pattern;
        document.getElementById('confidenceLevel').textContent = `${analysis.confidence}%`;
        document.getElementById('recommendedAction').textContent = analysis.finalSignal.action;
        
        // Show analysis results
        this.analysisResults.style.display = 'block';
        
        // Update signal count
        const signalCount = document.getElementById('signalCount');
        signalCount.textContent = window.pocketOptionAI.getAnalysisHistory().length;
        
        // Update accuracy rate
        const stats = window.pocketOptionAI.getPerformanceStats();
        document.getElementById('accuracyRate').textContent = `${stats.accuracy.toFixed(1)}%`;
        
        // Show signal modal
        this.showSignalModal(analysis);
        
        // Add to signals list
        this.addToSignalsList(analysis);
    }
    
    showSignalModal(analysis) {
        const modal = document.getElementById('signalModal');
        const signalDetails = document.getElementById('signalDetails');
        
        // Create signal details HTML
        signalDetails.innerHTML = `
            <div class="signal-summary">
                <div class="signal-asset">${analysis.asset}</div>
                <div class="signal-action">
                    <span class="action-badge ${analysis.finalSignal.action.toLowerCase()}">${analysis.finalSignal.action}</span>
                    <span class="confidence-score">${analysis.confidence}% Confidence</span>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${analysis.confidence}%"></div>
                </div>
            </div>
            
            <div class="signal-details-grid">
                <div class="detail-item">
                    <span class="label">Timeframe:</span>
                    <span class="value">${analysis.timeframe}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Expiration:</span>
                    <span class="value">${analysis.expiration}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Risk Level:</span>
                    <span class="value">${analysis.riskLevel}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Expected Return:</span>
                    <span class="value">${Math.floor(analysis.finalSignal.expectedReturn * 100)}%</span>
                </div>
                <div class="detail-item">
                    <span class="label">Entry Point:</span>
                    <span class="value">${analysis.finalSignal.entryPoint.description}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Entry Reasoning:</span>
                    <span class="value">${analysis.finalSignal.entryPoint.reasoning}</span>
                </div>
            </div>
            
            <div class="strategy-breakdown">
                <h4>Strategy Analysis:</h4>
                <div class="strategy-list">
                    <div class="strategy-item">
                        <span class="strategy-name">HH/LL:</span>
                        <span class="strategy-result">${analysis.strategies.hhll.pattern} (${Math.floor(analysis.strategies.hhll.confidence * 100)}%)</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-name">Trendline:</span>
                        <span class="strategy-result">${analysis.strategies.trendline.pattern} (${Math.floor(analysis.strategies.trendline.confidence * 100)}%)</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-name">S/R:</span>
                        <span class="strategy-result">${analysis.strategies.supportResistance.pattern} (${Math.floor(analysis.strategies.supportResistance.confidence * 100)}%)</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-name">Wyckoff:</span>
                        <span class="strategy-result">${analysis.strategies.wyckoff.phase} (${Math.floor(analysis.strategies.wyckoff.confidence * 100)}%)</span>
                    </div>
                    <div class="strategy-item">
                        <span class="strategy-name">MA:</span>
                        <span class="strategy-result">${analysis.strategies.movingAverages.pattern} (${Math.floor(analysis.strategies.movingAverages.confidence * 100)}%)</span>
                    </div>
                </div>
            </div>
            
            <div class="signal-reasoning">
                <h4>AI Reasoning:</h4>
                <p>${analysis.finalSignal.reasoning}</p>
            </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        
        // Bind modal events
        this.bindModalEvents(analysis);
    }
    
    bindModalEvents(analysis) {
        const modal = document.getElementById('signalModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const copyBtn = document.getElementById('copySignalBtn');
        const executeBtn = document.getElementById('executeTradeBtn');
        
        // Close modal
        closeBtn.onclick = () => modal.classList.remove('active');
        
        // Copy signal
        copyBtn.onclick = () => {
            const signalText = `PocketOption Signal: ${analysis.asset} ${analysis.finalSignal.action} - ${analysis.confidence}% confidence - ${analysis.timeframe} timeframe`;
            navigator.clipboard.writeText(signalText).then(() => {
                this.showNotification('Signal copied to clipboard!');
            });
        };
        
        // Execute trade
        executeBtn.onclick = () => {
            this.executeTrade(analysis);
        };
        
        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };
    }
    
    executeTrade(analysis) {
        // Open PocketOption with pre-filled parameters
        const pocketOptionUrl = `https://pocketoption.com/en/trade?asset=${encodeURIComponent(analysis.asset)}&timeframe=${analysis.timeframe}&expiration=${analysis.expiration}&action=${analysis.finalSignal.action.toLowerCase()}`;
        
        // Open in new tab
        window.open(pocketOptionUrl, '_blank');
        
        // Close modal
        document.getElementById('signalModal').classList.remove('active');
        
        // Show notification
        this.showNotification('Opening PocketOption with signal parameters...');
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
                <div class="signal-time">${new Date().toLocaleTimeString()}</div>
            </div>
            <div class="signal-action">
                <span class="action-badge ${analysis.finalSignal.action.toLowerCase()}">${analysis.finalSignal.action}</span>
                <span class="confidence-score">${analysis.confidence}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${analysis.confidence}%"></div>
            </div>
            <div class="signal-details">
                <div class="detail-row">
                    <span>Timeframe: ${analysis.timeframe}</span>
                    <span>Expiration: ${analysis.expiration}</span>
                </div>
                <div class="detail-row">
                    <span>Risk: ${analysis.riskLevel}</span>
                    <span>Return: ${Math.floor(analysis.finalSignal.expectedReturn * 100)}%</span>
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
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.isActive = false;
        this.updateButtonStates();
        
        console.log('PocketOption camera stopped');
    }
    
    pauseCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.enabled = false);
        }
    }
    
    resumeCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.enabled = true);
        }
    }
    
    updateButtonStates() {
        this.startBtn.disabled = this.isActive;
        this.captureBtn.disabled = !this.isActive;
        this.stopBtn.disabled = !this.isActive;
    }
    
    showLoading(text) {
        this.loadingText.textContent = text;
        this.loadingOverlay.classList.add('active');
    }
    
    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }
    
    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    showNotification(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
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
}

// Initialize camera when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pocketOptionCamera = new PocketOptionCamera();
});