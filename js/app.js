// Main App Controller
class PocketOptionApp {
    constructor() {
        this.currentTab = 'signals';
        this.isInitialized = false;
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.initializeTabs();
        this.loadSettings();
        this.setupNotifications();
        this.isInitialized = true;
        
        console.log('PocketOption AI Signals App initialized');
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Modal controls
        const modal = document.getElementById('signalModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const copyBtn = document.getElementById('copySignalBtn');
        const openPocketOptionBtn = document.getElementById('openPocketOptionBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCurrentSignal());
        }
        
        if (openPocketOptionBtn) {
            openPocketOptionBtn.addEventListener('click', () => this.openPocketOption());
        }
        
        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
        
        // Settings event listeners
        this.setupSettingsListeners();
    }
    
    setupSettingsListeners() {
        // Auto-generate signals
        const autoGenerate = document.getElementById('autoGenerateSignals');
        if (autoGenerate) {
            autoGenerate.addEventListener('change', (e) => {
                this.saveSetting('autoGenerateSignals', e.target.checked);
            });
        }
        
        // High confidence only
        const highConfidenceOnly = document.getElementById('highConfidenceOnly');
        if (highConfidenceOnly) {
            highConfidenceOnly.addEventListener('change', (e) => {
                this.saveSetting('highConfidenceOnly', e.target.checked);
                this.applyFilters();
            });
        }
        
        // Sound notifications
        const soundNotifications = document.getElementById('soundNotifications');
        if (soundNotifications) {
            soundNotifications.addEventListener('change', (e) => {
                this.saveSetting('soundNotifications', e.target.checked);
            });
        }
        
        // Risk management
        const maxRiskPerTrade = document.getElementById('maxRiskPerTrade');
        if (maxRiskPerTrade) {
            maxRiskPerTrade.addEventListener('input', (e) => {
                const value = e.target.value;
                document.getElementById('riskValue').textContent = `${value}%`;
                this.saveSetting('maxRiskPerTrade', parseInt(value));
            });
        }
        
        const dailyLossLimit = document.getElementById('dailyLossLimit');
        if (dailyLossLimit) {
            dailyLossLimit.addEventListener('change', (e) => {
                this.saveSetting('dailyLossLimit', parseInt(e.target.value));
            });
        }
        
        // Camera settings
        const cameraQuality = document.getElementById('cameraQuality');
        if (cameraQuality) {
            cameraQuality.addEventListener('change', (e) => {
                this.saveSetting('cameraQuality', e.target.value);
            });
        }
        
        const autoCapture = document.getElementById('autoCapture');
        if (autoCapture) {
            autoCapture.addEventListener('change', (e) => {
                this.saveSetting('autoCapture', e.target.checked);
            });
        }
    }
    
    initializeTabs() {
        // Show initial tab
        this.switchTab('signals');
    }
    
    switchTab(tabName) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        this.currentTab = tabName;
        
        // Tab-specific initialization
        this.initializeTabContent(tabName);
    }
    
    initializeTabContent(tabName) {
        switch (tabName) {
            case 'signals':
                this.initializeSignalsTab();
                break;
            case 'camera':
                this.initializeCameraTab();
                break;
            case 'portfolio':
                this.initializePortfolioTab();
                break;
            case 'settings':
                this.initializeSettingsTab();
                break;
        }
    }
    
    initializeSignalsTab() {
        // Refresh signals if needed
        if (window.signalsManager) {
            window.signalsManager.renderSignals();
        }
    }
    
    initializeCameraTab() {
        // Initialize camera if not already done
        if (window.cameraManager && !window.cameraManager.isInitialized) {
            // Camera will be initialized when user clicks start
        }
    }
    
    initializePortfolioTab() {
        this.loadPortfolioData();
    }
    
    initializeSettingsTab() {
        this.loadSettings();
    }
    
    loadPortfolioData() {
        // Load portfolio data from localStorage or API
        const portfolioData = this.getPortfolioData();
        
        // Update portfolio stats
        document.getElementById('totalPnL').textContent = `$${portfolioData.totalPnL.toFixed(2)}`;
        document.getElementById('winRate').textContent = `${portfolioData.winRate.toFixed(1)}%`;
        document.getElementById('totalTrades').textContent = portfolioData.totalTrades;
        
        // Load recent trades
        this.loadRecentTrades(portfolioData.recentTrades);
    }
    
    getPortfolioData() {
        // Mock portfolio data - in real app, this would come from API
        return {
            totalPnL: 1247.50,
            winRate: 73.2,
            totalTrades: 156,
            recentTrades: [
                { asset: 'EUR/USD', action: 'CALL', result: 'win', amount: 85.00, time: '2m ago' },
                { asset: 'GBP/USD', action: 'PUT', result: 'loss', amount: -50.00, time: '5m ago' },
                { asset: 'USD/JPY', action: 'CALL', result: 'win', amount: 75.00, time: '8m ago' },
                { asset: 'AUD/USD', action: 'PUT', result: 'win', amount: 90.00, time: '12m ago' },
                { asset: 'EUR/GBP', action: 'CALL', result: 'loss', amount: -45.00, time: '15m ago' }
            ]
        };
    }
    
    loadRecentTrades(trades) {
        const tradesList = document.getElementById('tradesList');
        if (!tradesList) return;
        
        tradesList.innerHTML = '';
        
        trades.forEach(trade => {
            const tradeElement = document.createElement('div');
            tradeElement.className = 'trade-item';
            
            const resultClass = trade.result === 'win' ? 'win' : 'loss';
            const resultIcon = trade.result === 'win' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            tradeElement.innerHTML = `
                <div class="trade-info">
                    <div class="trade-asset">${trade.asset} ${trade.action}</div>
                    <div class="trade-time">${trade.time}</div>
                </div>
                <div class="trade-result ${resultClass}">
                    <i class="fas ${resultIcon}"></i>
                    $${Math.abs(trade.amount).toFixed(2)}
                </div>
            `;
            
            tradesList.appendChild(tradeElement);
        });
    }
    
    loadSettings() {
        const settings = this.getSettings();
        
        // Apply settings to UI
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else if (element.type === 'range') {
                    element.value = settings[key];
                    // Update display value for range inputs
                    const displayElement = document.getElementById(key.replace('PerTrade', 'Value'));
                    if (displayElement) {
                        displayElement.textContent = `${settings[key]}%`;
                    }
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
    
    getSettings() {
        const defaultSettings = {
            autoGenerateSignals: true,
            highConfidenceOnly: false,
            soundNotifications: true,
            maxRiskPerTrade: 2,
            dailyLossLimit: 100,
            cameraQuality: 'medium',
            autoCapture: true
        };
        
        const savedSettings = localStorage.getItem('pocketOptionSettings');
        if (savedSettings) {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
        
        return defaultSettings;
    }
    
    saveSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        localStorage.setItem('pocketOptionSettings', JSON.stringify(settings));
    }
    
    applyFilters() {
        // Apply high confidence filter if enabled
        const highConfidenceOnly = this.getSettings().highConfidenceOnly;
        if (highConfidenceOnly && window.signalsManager) {
            // Filter signals to show only high confidence ones
            window.signalsManager.filterSignals();
        }
    }
    
    setupNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    showNotification(title, body, icon = null) {
        const settings = this.getSettings();
        
        // Browser notification
        if (settings.soundNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: icon || '/assets/icons/icon-192x192.png',
                badge: '/assets/icons/icon-72x72.png'
            });
        }
        
        // In-app notification
        this.showInAppNotification(body, 'info');
    }
    
    showInAppNotification(message, type = 'info') {
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
    
    showModal(signal) {
        const modal = document.getElementById('signalModal');
        const signalDetails = document.getElementById('signalDetails');
        
        if (!modal || !signalDetails) return;
        
        // Populate signal details
        signalDetails.innerHTML = `
            <div class="signal-detail-item">
                <strong>Asset:</strong> ${signal.asset}
            </div>
            <div class="signal-detail-item">
                <strong>Action:</strong> <span class="action-${signal.action.toLowerCase()}">${signal.action}</span>
            </div>
            <div class="signal-detail-item">
                <strong>Timeframe:</strong> ${signal.timeframe}
            </div>
            <div class="signal-detail-item">
                <strong>Confidence:</strong> ${signal.confidence}%
            </div>
            <div class="signal-detail-item">
                <strong>Pattern:</strong> ${signal.pattern}
            </div>
            <div class="signal-detail-item">
                <strong>Trend:</strong> ${signal.trend}
            </div>
            <div class="signal-detail-item">
                <strong>Risk Level:</strong> ${signal.riskLevel}
            </div>
        `;
        
        // Store current signal for modal actions
        this.currentModalSignal = signal;
        
        // Show modal
        modal.classList.add('active');
    }
    
    closeModal() {
        const modal = document.getElementById('signalModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentModalSignal = null;
    }
    
    copyCurrentSignal() {
        if (!this.currentModalSignal) return;
        
        const signal = this.currentModalSignal;
        const signalText = `${signal.asset} ${signal.action} ${signal.timeframe} - Confidence: ${signal.confidence}%`;
        
        navigator.clipboard.writeText(signalText).then(() => {
            this.showInAppNotification('Signal copied to clipboard!', 'success');
        }).catch(() => {
            this.showInAppNotification('Failed to copy signal', 'error');
        });
    }
    
    openPocketOption() {
        const pocketOptionUrl = 'https://pocketoption.com';
        window.open(pocketOptionUrl, '_blank');
        this.showInAppNotification('Opening PocketOption...', 'info');
    }
    
    // Utility methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    formatPercentage(value) {
        return `${value.toFixed(1)}%`;
    }
    
    formatTime(timestamp) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(timestamp);
    }
    
    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.showInAppNotification(`Error: ${error.message}`, 'error');
    }
    
    // Cleanup
    destroy() {
        // Clean up event listeners and resources
        if (window.cameraManager) {
            window.cameraManager.destroy();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PocketOptionApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any active processes
        console.log('App paused');
    } else {
        // Page is visible - resume processes
        console.log('App resumed');
        if (window.app) {
            window.app.initializeTabContent(window.app.currentTab);
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('App is online');
    if (window.app) {
        window.app.showInAppNotification('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    console.log('App is offline');
    if (window.app) {
        window.app.showInAppNotification('Connection lost - working offline', 'error');
    }
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
