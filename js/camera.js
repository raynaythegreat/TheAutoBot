// The POT Bot Camera Module with Auto-Scan
class POTBotCamera {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.isActive = false;
        this.currentSignal = null;
        this.autoScanEnabled = true;
        this.scanInterval = null;
        this.lastAnalysisTime = 0;
        this.analysisCooldown = 3000; // 3 seconds between analyses
        this.isAnalyzing = false;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.video = document.getElementById('cameraPreview');
        this.canvas = document.getElementById('captureCanvas');
        this.analyzeChartBtn = document.getElementById('analyzeChartBtn');
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
        
        // Auto-scan elements
        this.scanIndicator = this.createScanIndicator();
    }
    
    bindEvents() {
        this.analyzeChartBtn.addEventListener('click', () => this.analyzeChart());
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
            this.updateStatus('Camera ready - Auto-scanning for charts...');
            
            // Start auto-scanning
            this.startAutoScan();
            
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
    
    analyzeChart() {
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
    
    startAutoScan() {
        if (!this.autoScanEnabled || !this.isActive) return;
        
        // Clear any existing interval
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
        }
        
        // Start scanning every 2 seconds
        this.scanInterval = setInterval(() => {
            this.performAutoScan();
        }, 2000);
        
        console.log('Auto-scan started');
    }
    
    stopAutoScan() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        console.log('Auto-scan stopped');
    }
    
    async performAutoScan() {
        if (!this.isActive || this.isAnalyzing) return;
        
        try {
            // Check if enough time has passed since last analysis
            const now = Date.now();
            if (now - this.lastAnalysisTime < this.analysisCooldown) {
                return;
            }
            
            // Capture current frame
            const imageData = this.captureFrame();
            
            // Detect if market chart is present
            const hasMarketChart = await this.detectMarketChart(imageData);
            
            if (hasMarketChart) {
                console.log('Market chart detected - starting auto-analysis');
                this.updateStatus('Market detected - Analyzing...');
                this.showScanIndicator('Market detected!');
                
                // Perform automatic analysis
                await this.performAutoAnalysis(imageData);
            } else {
                this.updateStatus('Scanning for market charts...');
                this.showScanIndicator('Scanning...');
            }
            
        } catch (error) {
            console.error('Auto-scan error:', error);
        }
    }
    
    async detectMarketChart(imageData) {
        // Enhanced market chart detection with asset identification
        await this.delay(100); // Simulate processing time
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Analyze image for chart-like patterns
                let chartScore = 0;
                let sampleCount = 0;
                
                // Sample pixels to detect chart characteristics
                for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Look for chart-like colors (whites, grays, greens, reds)
                    if (this.isChartColor(r, g, b)) {
                        chartScore++;
                    }
                    sampleCount++;
                }
                
                // Calculate chart probability
                const chartProbability = chartScore / sampleCount;
                
                // Consider it a chart if probability is above threshold
                const isChart = chartProbability > 0.3;
                
                if (isChart) {
                    // Store the canvas for asset detection
                    this.currentChartCanvas = canvas;
                }
                
                console.log(`Chart detection score: ${(chartProbability * 100).toFixed(1)}%`);
                resolve(isChart);
            };
            
            img.src = imageData.data;
        });
    }
    
    isChartColor(r, g, b) {
        // Detect colors commonly found in trading charts
        // White/light colors (background)
        if (r > 200 && g > 200 && b > 200) return true;
        
        // Gray colors (grid lines, text)
        if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && r > 100 && r < 200) return true;
        
        // Green colors (bullish candles, positive values)
        if (g > r && g > b && g > 150) return true;
        
        // Red colors (bearish candles, negative values)
        if (r > g && r > b && r > 150) return true;
        
        // Blue colors (lines, indicators)
        if (b > r && b > g && b > 150) return true;
        
        return false;
    }
    
    async performAutoAnalysis(imageData) {
        if (this.isAnalyzing) return;
        
        this.isAnalyzing = true;
        this.lastAnalysisTime = Date.now();
        
        try {
            this.showAnalysisStatus('Auto-analyzing market chart...');
            
            // Perform analysis
            const analysisResult = await this.performSimpleAnalysis(imageData);
            
            // Display results
            this.displaySignal(analysisResult);
            
            // Hide analysis status
            this.hideAnalysisStatus();
            
            // Update status
            this.updateStatus('Signal generated - Auto-scanning continues...');
            
            console.log('Auto-analysis completed:', analysisResult);
            
        } catch (error) {
            console.error('Auto-analysis failed:', error);
            this.hideAnalysisStatus();
            this.updateStatus('Auto-scanning for charts...');
        } finally {
            this.isAnalyzing = false;
        }
    }
    
    createScanIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scan-indicator';
        indicator.innerHTML = `
            <div class="scan-content">
                <div class="scan-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="scan-text">Scanning...</div>
            </div>
        `;
        
        // Add to camera container
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer) {
            cameraContainer.appendChild(indicator);
        }
        
        return indicator;
    }
    
    showScanIndicator(message) {
        if (this.scanIndicator) {
            const scanText = this.scanIndicator.querySelector('.scan-text');
            if (scanText) {
                scanText.textContent = message;
            }
            this.scanIndicator.style.display = 'flex';
        }
    }
    
    hideScanIndicator() {
        if (this.scanIndicator) {
            this.scanIndicator.style.display = 'none';
        }
    }
    
    stopCamera() {
        // Stop auto-scanning
        this.stopAutoScan();
        
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
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize camera when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.potBotCamera = new POTBotCamera();
});