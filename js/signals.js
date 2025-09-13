// Signals Generator and Management System
class SignalsManager {
    constructor() {
        this.signals = [];
        this.activeSignals = [];
        this.signalHistory = [];
        this.isGenerating = false;
        
        this.signalsList = document.getElementById('signalsList');
        this.generateBtn = document.getElementById('generateSignalBtn');
        this.generationStatus = document.getElementById('generationStatus');
        
        this.assetFilter = document.getElementById('assetFilter');
        this.timeframeFilter = document.getElementById('timeframeFilter');
        this.confidenceFilter = document.getElementById('confidenceFilter');
        
        this.initializeEventListeners();
        this.loadInitialSignals();
        this.startAutoGeneration();
    }
    
    initializeEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateNewSignal());
        
        // Filter event listeners
        this.assetFilter.addEventListener('change', () => this.filterSignals());
        this.timeframeFilter.addEventListener('change', () => this.filterSignals());
        this.confidenceFilter.addEventListener('change', () => this.filterSignals());
    }
    
    loadInitialSignals() {
        // Load some initial signals for demonstration
        const initialSignals = [
            {
                id: 1,
                asset: 'EUR/USD',
                action: 'CALL',
                confidence: 87,
                timeframe: '5m',
                pattern: 'Ascending Triangle',
                trend: 'Bullish',
                timestamp: new Date(Date.now() - 300000), // 5 minutes ago
                source: 'AI Analysis',
                status: 'active'
            },
            {
                id: 2,
                asset: 'GBP/USD',
                action: 'PUT',
                confidence: 92,
                timeframe: '15m',
                pattern: 'Head and Shoulders',
                trend: 'Bearish',
                timestamp: new Date(Date.now() - 600000), // 10 minutes ago
                source: 'AI Analysis',
                status: 'active'
            },
            {
                id: 3,
                asset: 'USD/JPY',
                action: 'CALL',
                confidence: 78,
                timeframe: '1m',
                pattern: 'Flag Pattern',
                trend: 'Bullish',
                timestamp: new Date(Date.now() - 900000), // 15 minutes ago
                source: 'AI Analysis',
                status: 'active'
            }
        ];
        
        initialSignals.forEach(signal => this.addSignal(signal));
    }
    
    async generateNewSignal() {
        if (this.isGenerating) return;
        
        try {
            this.isGenerating = true;
            this.generateBtn.disabled = true;
            this.generationStatus.textContent = 'Analyzing market conditions...';
            
            // Simulate AI analysis process
            await this.delay(1000);
            this.generationStatus.textContent = 'Processing technical indicators...';
            
            await this.delay(1000);
            this.generationStatus.textContent = 'Generating signal...';
            
            await this.delay(1000);
            
            // Generate new signal
            const signal = this.createSignal();
            this.addSignal(signal);
            
            // Show success message
            this.generationStatus.textContent = 'Signal generated successfully!';
            this.showNotification('New signal generated!', 'success');
            
            // Reset status after delay
            setTimeout(() => {
                this.generationStatus.textContent = '';
            }, 3000);
            
        } catch (error) {
            console.error('Error generating signal:', error);
            this.generationStatus.textContent = 'Error generating signal. Please try again.';
            this.showNotification('Failed to generate signal', 'error');
        } finally {
            this.isGenerating = false;
            this.generateBtn.disabled = false;
        }
    }
    
    createSignal() {
        const assets = [
            'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD',
            'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CAD/JPY', 'NZD/JPY',
            'EUR/AUD', 'GBP/AUD', 'EUR/CAD', 'GBP/CAD', 'AUD/CAD', 'NZD/CAD'
        ];
        
        const timeframes = ['1m', '5m', '15m', '30m', '1h'];
        const patterns = [
            'Ascending Triangle', 'Descending Triangle', 'Head and Shoulders',
            'Double Top', 'Double Bottom', 'Flag Pattern', 'Pennant',
            'Wedge Formation', 'Channel Breakout', 'Support/Resistance'
        ];
        const trends = ['Bullish', 'Bearish', 'Sideways'];
        const actions = ['CALL', 'PUT'];
        
        // Generate signal with weighted probabilities
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const confidence = this.generateConfidence();
        const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const trend = trends[Math.floor(Math.random() * trends.length)];
        
        return {
            id: Date.now(),
            asset: asset,
            action: action,
            confidence: confidence,
            timeframe: timeframe,
            pattern: pattern,
            trend: trend,
            timestamp: new Date(),
            source: 'AI Generator',
            status: 'active',
            technicalIndicators: this.generateTechnicalIndicators(),
            marketConditions: this.generateMarketConditions(),
            riskLevel: this.calculateRiskLevel(confidence),
            expectedReturn: this.calculateExpectedReturn(confidence)
        };
    }
    
    generateConfidence() {
        // Generate confidence with weighted distribution (higher confidence more likely)
        const weights = [0.1, 0.2, 0.3, 0.25, 0.15]; // 60-70, 70-80, 80-85, 85-90, 90-95
        const ranges = [
            { min: 60, max: 70 },
            { min: 70, max: 80 },
            { min: 80, max: 85 },
            { min: 85, max: 90 },
            { min: 90, max: 95 }
        ];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (random <= cumulativeWeight) {
                const range = ranges[i];
                return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }
        
        return 85; // Fallback
    }
    
    generateTechnicalIndicators() {
        return {
            rsi: Math.floor(Math.random() * 40) + 30, // 30-70
            macd: (Math.random() - 0.5) * 0.02, // -0.01 to 0.01
            bollinger: Math.random() > 0.5 ? 'Upper Band' : 'Lower Band',
            movingAverage: Math.random() > 0.5 ? 'Above' : 'Below',
            stochastic: Math.floor(Math.random() * 100),
            williamsR: Math.floor(Math.random() * 100) - 100 // -100 to 0
        };
    }
    
    generateMarketConditions() {
        return {
            volatility: Math.floor(Math.random() * 3) + 1, // 1-3 (Low, Medium, High)
            volume: Math.floor(Math.random() * 3) + 1, // 1-3
            momentum: Math.floor(Math.random() * 3) + 1, // 1-3
            trend: Math.random() > 0.5 ? 'Strong' : 'Weak'
        };
    }
    
    calculateRiskLevel(confidence) {
        if (confidence >= 90) return 'Low';
        if (confidence >= 80) return 'Medium';
        if (confidence >= 70) return 'High';
        return 'Very High';
    }
    
    calculateExpectedReturn(confidence) {
        // Higher confidence = higher expected return
        const baseReturn = 0.7; // 70% base return for binary options
        const confidenceBonus = (confidence - 70) * 0.01; // 1% bonus per confidence point above 70
        return Math.min(baseReturn + confidenceBonus, 0.95); // Cap at 95%
    }
    
    addSignal(signal) {
        this.signals.unshift(signal); // Add to beginning
        this.activeSignals.push(signal);
        
        // Limit to 50 signals
        if (this.signals.length > 50) {
            this.signals = this.signals.slice(0, 50);
        }
        
        this.renderSignals();
        this.updateStats();
    }
    
    renderSignals() {
        const filteredSignals = this.getFilteredSignals();
        
        this.signalsList.innerHTML = '';
        
        if (filteredSignals.length === 0) {
            this.signalsList.innerHTML = `
                <div class="no-signals">
                    <i class="fas fa-chart-line"></i>
                    <h3>No signals found</h3>
                    <p>Try adjusting your filters or generate a new signal</p>
                </div>
            `;
            return;
        }
        
        filteredSignals.forEach(signal => {
            const signalElement = this.createSignalElement(signal);
            this.signalsList.appendChild(signalElement);
        });
    }
    
    createSignalElement(signal) {
        const signalDiv = document.createElement('div');
        signalDiv.className = 'signal-card';
        signalDiv.dataset.signalId = signal.id;
        
        const timeAgo = this.getTimeAgo(signal.timestamp);
        const confidenceColor = this.getConfidenceColor(signal.confidence);
        
        signalDiv.innerHTML = `
            <div class="signal-header">
                <div class="signal-asset">${signal.asset}</div>
                <div class="signal-timeframe">${signal.timeframe}</div>
            </div>
            
            <div class="signal-action">
                <div class="action-badge ${signal.action.toLowerCase()}">${signal.action}</div>
                <div class="signal-time">${timeAgo}</div>
            </div>
            
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${signal.confidence}%; background: ${confidenceColor}"></div>
            </div>
            
            <div class="signal-details">
                <div class="detail-item">
                    <span class="detail-label">Confidence:</span>
                    <span class="detail-value" style="color: ${confidenceColor}">${signal.confidence}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pattern:</span>
                    <span class="detail-value">${signal.pattern}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Trend:</span>
                    <span class="detail-value">${signal.trend}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Risk:</span>
                    <span class="detail-value">${signal.riskLevel}</span>
                </div>
            </div>
            
            <div class="signal-actions">
                <button class="action-btn primary" onclick="signalsManager.copySignal(${signal.id})">
                    <i class="fas fa-copy"></i>
                    Copy
                </button>
                <button class="action-btn secondary" onclick="signalsManager.openPocketOption(${signal.id})">
                    <i class="fas fa-external-link-alt"></i>
                    Trade
                </button>
            </div>
        `;
        
        return signalDiv;
    }
    
    getFilteredSignals() {
        let filtered = [...this.signals];
        
        // Filter by asset type
        const assetFilter = this.assetFilter.value;
        if (assetFilter !== 'all') {
            filtered = filtered.filter(signal => {
                const asset = signal.asset;
                switch (assetFilter) {
                    case 'forex':
                        return asset.includes('/');
                    case 'crypto':
                        return asset.includes('BTC') || asset.includes('ETH') || asset.includes('LTC');
                    case 'stocks':
                        return !asset.includes('/') && !asset.includes('BTC') && !asset.includes('ETH');
                    case 'commodities':
                        return asset.includes('GOLD') || asset.includes('OIL') || asset.includes('SILVER');
                    default:
                        return true;
                }
            });
        }
        
        // Filter by timeframe
        const timeframeFilter = this.timeframeFilter.value;
        if (timeframeFilter !== 'all') {
            filtered = filtered.filter(signal => signal.timeframe === timeframeFilter);
        }
        
        // Filter by confidence
        const confidenceFilter = this.confidenceFilter.value;
        if (confidenceFilter !== 'all') {
            filtered = filtered.filter(signal => {
                switch (confidenceFilter) {
                    case 'high':
                        return signal.confidence >= 80;
                    case 'medium':
                        return signal.confidence >= 60 && signal.confidence < 80;
                    case 'low':
                        return signal.confidence < 60;
                    default:
                        return true;
                }
            });
        }
        
        return filtered;
    }
    
    filterSignals() {
        this.renderSignals();
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    getConfidenceColor(confidence) {
        if (confidence >= 90) return '#00ff88';
        if (confidence >= 80) return '#00d4ff';
        if (confidence >= 70) return '#ffaa00';
        return '#ff4444';
    }
    
    copySignal(signalId) {
        const signal = this.signals.find(s => s.id === signalId);
        if (!signal) return;
        
        const signalText = `${signal.asset} ${signal.action} ${signal.timeframe} - Confidence: ${signal.confidence}%`;
        
        navigator.clipboard.writeText(signalText).then(() => {
            this.showNotification('Signal copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy signal', 'error');
        });
    }
    
    openPocketOption(signalId) {
        const signal = this.signals.find(s => s.id === signalId);
        if (!signal) return;
        
        // Open PocketOption in new tab
        const pocketOptionUrl = 'https://pocketoption.com';
        window.open(pocketOptionUrl, '_blank');
        
        this.showNotification('Opening PocketOption...', 'info');
    }
    
    updateStats() {
        const activeCount = this.activeSignals.length;
        const avgConfidence = this.calculateAverageConfidence();
        
        document.getElementById('activeSignals').textContent = activeCount;
        document.getElementById('accuracyRate').textContent = `${avgConfidence.toFixed(1)}%`;
    }
    
    calculateAverageConfidence() {
        if (this.activeSignals.length === 0) return 0;
        const total = this.activeSignals.reduce((sum, signal) => sum + signal.confidence, 0);
        return total / this.activeSignals.length;
    }
    
    startAutoGeneration() {
        // Auto-generate signals every 5 minutes if enabled
        setInterval(() => {
            const autoGenerate = document.getElementById('autoGenerateSignals');
            if (autoGenerate && autoGenerate.checked) {
                this.generateNewSignal();
            }
        }, 300000); // 5 minutes
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
}

// Initialize signals manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.signalsManager = new SignalsManager();
});
