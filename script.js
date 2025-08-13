class ElectricityDashboard {
    constructor() {
        this.init();
        this.loadData();
        this.setupEventListeners();
    }

    init() {
        this.elements = {
            remainingBalance: document.getElementById('remainingBalance'),
            readingTime: document.getElementById('readingTime'),
            rechargeAmount: document.getElementById('rechargeAmount'),
            rechargeDate: document.getElementById('rechargeDate'),
            accountNumber: document.getElementById('accountNumber'),
            lastUpdated: document.getElementById('lastUpdated'),
            refreshBtn: document.getElementById('refreshBtn'),
            themeToggle: document.getElementById('themeToggle'),
            loadingOverlay: document.getElementById('loadingOverlay')
        };

        this.loadTheme();
    }

    setupEventListeners() {
        this.elements.refreshBtn.addEventListener('click', () => this.refreshData());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        setInterval(() => this.loadData(), 30000);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            
            const data = await response.json();
            this.updateUI(data);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load meter data');
        }
    }

    updateUI(data) {
        if (!data) {
            this.showError('No data available');
            return;
        }

        this.elements.remainingBalance.textContent = this.formatBalance(data.remaining_balance);
        this.elements.readingTime.textContent = this.formatTime(data.reading_time);
        this.elements.rechargeAmount.textContent = this.formatAmount(data.last_recharge_amount);
        this.elements.rechargeDate.textContent = this.formatDate(data.last_recharge_date);
        this.elements.accountNumber.textContent = data.account_number || 'N/A';
        this.elements.lastUpdated.textContent = this.formatTimestamp(data.timestamp);

        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('fade-in');
        });

        this.updateBalanceStatus(data.remaining_balance);
    }

    formatBalance(balance) {
        if (!balance || balance === 'Not found') {
            return 'N/A';
        }
        return balance;
    }

    formatTime(time) {
        if (!time || time === 'Not found') {
            return 'N/A';
        }
        return time;
    }

    formatAmount(amount) {
        if (!amount || amount === 'Not found') {
            return 'N/A';
        }
        return amount;
    }

    formatDate(date) {
        if (!date || date === 'Not found') {
            return 'N/A';
        }
        return date;
    }

    formatTimestamp(timestamp) {
        if (!timestamp) {
            return 'Never';
        }
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    }

    updateBalanceStatus(balance) {
        const balanceElement = this.elements.remainingBalance;
        const card = balanceElement.closest('.card');
        
        if (!balance || balance === 'Not found') {
            return;
        }

        const numericBalance = parseFloat(balance.replace(/[^\d.]/g, ''));
        
        card.classList.remove('low-balance', 'critical-balance');
        
        if (numericBalance < 100) {
            card.classList.add('critical-balance');
        } else if (numericBalance < 500) {
            card.classList.add('low-balance');
        }
    }

    async refreshData() {
        this.showLoading(true);
        this.elements.refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        this.elements.refreshBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.loadData();
            this.showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to refresh data', 'error');
        } finally {
            this.showLoading(false);
            this.elements.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            this.elements.refreshBtn.disabled = false;
        }
    }

    showLoading(show) {
        if (show) {
            this.elements.loadingOverlay.classList.add('show');
        } else {
            this.elements.loadingOverlay.classList.remove('show');
        }
    }

    showError(message) {
        this.elements.remainingBalance.textContent = 'Error';
        this.elements.readingTime.textContent = 'Error';
        this.elements.rechargeAmount.textContent = 'Error';
        this.elements.rechargeDate.textContent = 'Error';
        this.elements.accountNumber.textContent = 'Error';
        this.elements.lastUpdated.textContent = 'Error';
        
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ElectricityDashboard();
});

const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        transform: translateX(100%);
        transition: all 0.3s ease;
        min-width: 300px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);
    }

    .notification-success {
        border-left: 4px solid var(--success-color);
    }

    .notification-error {
        border-left: 4px solid var(--error-color);
    }

    .notification-info {
        border-left: 4px solid var(--primary-color);
    }

    .notification-success i {
        color: var(--success-color);
    }

    .notification-error i {
        color: var(--error-color);
    }

    .notification-info i {
        color: var(--primary-color);
    }

    .low-balance {
        border-left: 4px solid var(--warning-color) !important;
    }

    .critical-balance {
        border-left: 4px solid var(--error-color) !important;
        animation: pulse 2s infinite;
    }

    @media (max-width: 480px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
            transform: translateY(-100%);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);