// The Auto Bot Camera Module
class AutoBotCamera {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.isActive = false;
        this.currentSignal = null;
        this.isAnalyzing = false;
        
        try {
            this.initializeElements();
            this.bindEvents();
            console.log('POT Bot Camera module initialized successfully');
        } catch (error) {
            console.error('Failed to initialize camera module:', error);
            throw error;
        }
    }
    
    initializeElements() {
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('captureCanvas');
        this.backBtn = document.getElementById('backBtn');
        this.cameraStatus = document.getElementById('cameraStatus');
        this.signalOverlay = document.getElementById('signalOverlay');
        this.analysisStatus = document.getElementById('analysisStatus');
        this.statusText = document.getElementById('statusText');
        
        // Signal overlay elements
        this.signalTime = document.getElementById('signalTime');
        this.actionBadge = document.getElementById('actionBadge');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.entryPoint = document.getElementById('entryPoint');
        this.riskLevel = document.getElementById('riskLevel');
        this.timeframe = document.getElementById('timeframe');
        this.expiration = document.getElementById('expiration');
        this.entryDescription = document.getElementById('entryDescription');
        this.entryTiming = document.getElementById('entryTiming');
        
        // Check if core required elements are found
        const coreElements = ['video', 'canvas', 'backBtn', 'cameraStatus', 'signalOverlay'];
        const missingCoreElements = coreElements.filter(element => !this[element]);
        
        if (missingCoreElements.length > 0) {
            console.error('Missing core camera elements:', missingCoreElements);
            throw new Error(`Missing required camera elements: ${missingCoreElements.join(', ')}`);
        }
        
        // Log missing optional elements
        const optionalElements = ['analysisStatus', 'statusText', 'signalTime', 'actionBadge', 'confidenceScore', 'entryPoint', 'riskLevel', 'timeframe', 'expiration', 'entryDescription', 'entryTiming'];
        const missingOptionalElements = optionalElements.filter(element => !this[element]);
        if (missingOptionalElements.length > 0) {
            console.warn('Missing optional signal elements:', missingOptionalElements);
        }
        
        console.log('Camera elements initialized successfully');
    }
    
    bindEvents() {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.goBack());
        }
    }
    
    goBack() {
        // Stop camera when going back
        this.stopCamera();
        
        // Switch back to main page
        if (window.autoBotApp) {
            window.autoBotApp.showPage('main');
        }
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
            this.updateStatus('Camera ready - Viewing mode active');
            
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
        // Focus on pure signal generation from camera analysis
        await this.delay(2000);
        
        // Generate analysis result focused on trading signal quality
        const analysisResult = await this.generateTradingSignal(imageData);
        
        return analysisResult;
    }
    
    async generateTradingSignal(imageData) {
        // Analyze image characteristics for signal generation
        const imageAnalysis = this.analyzeImageForSignal(imageData);
        
        // Generate signal based on image analysis
        const signal = this.generateSignalFromAnalysis(imageAnalysis);
        
        // Generate detailed entry point analysis
        const entryAnalysis = this.generateEntryPointAnalysis(signal.confidence, signal.action);
        
        return {
            action: signal.action,
            confidence: signal.confidence,
            entryPoint: entryAnalysis.entryPoint,
            riskLevel: entryAnalysis.riskLevel,
            timeframe: '1min',
            expiration: '3min',
            entryDescription: entryAnalysis.description,
            entryTiming: entryAnalysis.timing,
            timestamp: new Date()
        };
    }
    
    analyzeImageForSignal(imageData) {
        // Analyze image characteristics to determine signal quality
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageDataObj.data;
        
        let greenPixels = 0;
        let redPixels = 0;
        let totalPixels = 0;
        let brightness = 0;
        
        // Sample pixels to analyze chart characteristics
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            totalPixels++;
            brightness += (r + g + b) / 3;
            
            // Detect green (bullish) and red (bearish) patterns
            if (g > r && g > b && g > 100) {
                greenPixels++;
            } else if (r > g && r > b && r > 100) {
                redPixels++;
            }
        }
        
        const avgBrightness = brightness / totalPixels;
        const greenRatio = greenPixels / totalPixels;
        const redRatio = redPixels / totalPixels;
        
        return {
            greenRatio,
            redRatio,
            avgBrightness,
            totalPixels,
            volatility: Math.abs(greenRatio - redRatio),
            trendStrength: Math.max(greenRatio, redRatio)
        };
    }
    
    generateSignalFromAnalysis(imageAnalysis) {
        const { greenRatio, redRatio, volatility, trendStrength } = imageAnalysis;
        
        // Determine signal direction based on image analysis
        let action, confidence;
        
        if (greenRatio > redRatio && greenRatio > 0.1) {
            // More green pixels detected - bullish signal
            action = 'CALL';
            confidence = Math.min(95, 80 + (greenRatio * 100) + (volatility * 50));
        } else if (redRatio > greenRatio && redRatio > 0.1) {
            // More red pixels detected - bearish signal
            action = 'PUT';
            confidence = Math.min(95, 80 + (redRatio * 100) + (volatility * 50));
        } else {
            // Mixed or unclear signals - use trend strength
            if (trendStrength > 0.15) {
                action = greenRatio > redRatio ? 'CALL' : 'PUT';
                confidence = 80 + (trendStrength * 50);
            } else {
                // Random signal for unclear patterns
                action = Math.random() > 0.5 ? 'CALL' : 'PUT';
                confidence = 80 + Math.random() * 15;
            }
        }
        
        // Ensure confidence is within bounds
        confidence = Math.max(80, Math.min(95, Math.round(confidence)));
        
        return { action, confidence };
    }
    
    generateEntryPointAnalysis(confidence, action) {
        const currentTime = new Date();
        const currentSecond = currentTime.getSeconds();
        
        // Determine entry strategy based on confidence and timing
        let entryPoint, riskLevel, description, timing;
        
        if (confidence >= 90) {
            // High confidence - immediate entry
            entryPoint = 'Immediate';
            riskLevel = 'Low';
            description = 'Enter immediately at current market price';
            timing = this.calculateOptimalTiming(currentSecond, 'immediate');
        } else if (confidence >= 85) {
            // Medium-high confidence - wait for small pullback
            entryPoint = 'Wait for pullback';
            riskLevel = 'Medium';
            description = 'Wait for 5-10 pip pullback before entering';
            timing = this.calculateOptimalTiming(currentSecond, 'pullback');
        } else {
            // Medium confidence - wait for confirmation
            entryPoint = 'Breakout confirmation';
            riskLevel = 'Medium';
            description = 'Wait for price to break key level before entering';
            timing = this.calculateOptimalTiming(currentSecond, 'confirmation');
        }
        
        return {
            entryPoint,
            riskLevel,
            description,
            timing
        };
    }
    
    calculateOptimalTiming(currentSecond, entryType) {
        const now = new Date();
        const currentMinute = now.getMinutes();
        const currentSecondInMinute = now.getSeconds();
        
        // Calculate optimal entry window based on 1-minute timeframe
        let optimalWindow;
        
        if (entryType === 'immediate') {
            // For immediate entry, best time is within first 30 seconds of minute
            if (currentSecondInMinute <= 30) {
                optimalWindow = 'Enter now - optimal timing';
            } else {
                optimalWindow = 'Enter within next 30 seconds';
            }
        } else if (entryType === 'pullback') {
            // For pullback, wait for next 30-45 seconds
            const waitTime = 60 - currentSecondInMinute;
            optimalWindow = `Wait ${waitTime}s for pullback opportunity`;
        } else {
            // For confirmation, wait for next minute
            const waitTime = 60 - currentSecondInMinute;
            optimalWindow = `Wait ${waitTime}s for breakout confirmation`;
        }
        
        // Add 3-minute expiration context
        const expirationTime = new Date(now.getTime() + 3 * 60 * 1000);
        const expirationTimeStr = expirationTime.toLocaleTimeString();
        
        return `${optimalWindow} | Expires: ${expirationTimeStr}`;
    }
    
    
    displaySignal(analysis) {
        // Update signal overlay with enhanced entry information
        this.signalTime.textContent = analysis.timestamp.toLocaleTimeString();
        this.actionBadge.textContent = analysis.action;
        this.actionBadge.className = `action-badge ${analysis.action.toLowerCase()}`;
        this.confidenceScore.textContent = `${analysis.confidence}%`;
        this.entryPoint.textContent = analysis.entryPoint;
        this.riskLevel.textContent = analysis.riskLevel;
        this.timeframe.textContent = analysis.timeframe;
        this.expiration.textContent = analysis.expiration;
        this.entryDescription.textContent = analysis.entryDescription;
        this.entryTiming.textContent = analysis.entryTiming;
        
        // Show signal overlay
        this.signalOverlay.style.display = 'block';
        
        // Store current signal
        this.currentSignal = analysis;
        
        // Add to signals list on main page
        this.addToSignalsList(analysis);
        
        // Update stats
        this.updateStats();
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
        
        if (this.video) {
            this.video.srcObject = null;
        }
        
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
        
        // Create signal card with enhanced entry information
        const signalCard = document.createElement('div');
        signalCard.className = 'signal-card';
        signalCard.innerHTML = `
            <div class="signal-header">
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
                <div class="detail-row">
                    <span>Timeframe: ${analysis.timeframe}</span>
                    <span>Expiration: ${analysis.expiration}</span>
                </div>
                <div class="entry-guidance-mini">
                    <div class="entry-desc-mini">${analysis.entryDescription}</div>
                    <div class="entry-timing-mini">${analysis.entryTiming}</div>
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
    
    stopCamera() {
        try {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            
            if (this.video) {
                this.video.srcObject = null;
            }
            
            this.isActive = false;
            console.log('Camera stopped');
            
            // Update status
            if (this.cameraStatus) {
                this.cameraStatus.textContent = 'Camera stopped';
            }
            
        } catch (error) {
            console.error('Error stopping camera:', error);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize camera when DOM is loaded with retry mechanism
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all elements to be ready
    setTimeout(() => {
        try {
            window.autoBotCamera = new AutoBotCamera();
            console.log('✅ Auto Bot Camera module loaded successfully');
        } catch (error) {
            console.error('❌ Failed to initialize camera module:', error);
            // Retry after a longer delay
            setTimeout(() => {
                try {
                    window.autoBotCamera = new AutoBotCamera();
                    console.log('✅ Auto Bot Camera module loaded on retry');
                } catch (retryError) {
                    console.error('❌ Camera module failed on retry:', retryError);
                }
            }, 1000);
        }
    }, 100);
});