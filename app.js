// ========== State Management ==========
let expenses = [];
let editingId = null;
let expenseChart = null;

// Category icons mapping
const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛍️',
    bills: '💡',
    entertainment: '🎬',
    health: '💊',
    education: '📚',
    other: '📌'
};

const categoryNames = {
    food: 'Food & Dining',
    transport: 'Transportation',
    shopping: 'Shopping',
    bills: 'Bills & Utilities',
    entertainment: 'Entertainment',
    health: 'Healthcare',
    education: 'Education',
    other: 'Other'
};

// ========== LocalStorage Functions ==========
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('expenses');
    if (stored) {
        expenses = JSON.parse(stored);
        renderExpenses();
        updateDashboard();
        updateChart();
    }
}

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', function() {
    // Load saved expenses
    loadFromLocalStorage();
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Event Listeners
    document.getElementById('expenseForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('filterCategory').addEventListener('change', renderExpenses);
    document.getElementById('sortBy').addEventListener('change', renderExpenses);
    document.getElementById('startDate').addEventListener('change', renderExpenses);
    document.getElementById('endDate').addEventListener('change', renderExpenses);
    document.getElementById('searchInput').addEventListener('input', renderExpenses);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    
    // Modal event listeners
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    
    // Close modal on outside click
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
});

// ========== Form Handling ==========
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    
    // Validation
    if (!title || !amount || !category || !date) {
        alert('Please fill in all fields');
        return;
    }
    
    if (amount <= 0) {
        alert('Amount must be a positive number');
        return;
    }
    
    if (editingId !== null) {
        // Update existing expense
        const index = expenses.findIndex(exp => exp.id === editingId);
        if (index !== -1) {
            expenses[index] = {
                ...expenses[index],
                title,
                amount,
                category,
                date
            };
        }
        editingId = null;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-check"></i> Add Expense';
    } else {
        // Add new expense
        const expense = {
            id: Date.now(),
            title,
            amount,
            category,
            date,
            createdAt: new Date().toISOString()
        };
        expenses.push(expense);
    }
    
    // Save and update UI
    saveToLocalStorage();
    renderExpenses();
    updateDashboard();
    updateChart();
    
    // Reset form
    document.getElementById('expenseForm').reset();
    document.getElementById('date').valueAsDate = new Date();
}

// ========== Expense Management ==========
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;
    
    // Populate form
    document.getElementById('title').value = expense.title;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    
    // Update button text
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Expense';
    editingId = id;
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

let expenseToDelete = null;

function deleteExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;
    
    expenseToDelete = id;
    
    // Show modal with expense info
    const modal = document.getElementById('deleteModal');
    const expenseInfo = document.getElementById('deleteExpenseInfo');
    expenseInfo.textContent = `${expense.title} - $${expense.amount.toFixed(2)}`;
    modal.classList.add('active');
}

function confirmDelete() {
    if (expenseToDelete !== null) {
        expenses = expenses.filter(exp => exp.id !== expenseToDelete);
        saveToLocalStorage();
        renderExpenses();
        updateDashboard();
        updateChart();
        expenseToDelete = null;
    }
    closeDeleteModal();
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    expenseToDelete = null;
}

// ========== Rendering ==========
function renderExpenses() {
    const expensesList = document.getElementById('expensesList');
    const emptyState = document.getElementById('emptyState');
    
    // Get filtered and sorted expenses
    let filtered = getFilteredExpenses();
    
    // Update count
    const count = filtered.length;
    document.getElementById('expenseCount').textContent = `${count} expense${count !== 1 ? 's' : ''}`;
    
    if (filtered.length === 0) {
        expensesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    expensesList.innerHTML = filtered.map(expense => `
        <div class="expense-item" data-category="${expense.category}">
            <div class="expense-icon">
                ${categoryIcons[expense.category]}
            </div>
            <div class="expense-details">
                <div class="expense-title">${expense.title}</div>
                <div class="expense-meta">
                    <span>${categoryNames[expense.category]}</span>
                    <span>${formatDate(expense.date)}</span>
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <div class="expense-actions">
                <button class="btn-edit" onclick="editExpense(${expense.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ========== Filtering & Sorting ==========
function getFilteredExpenses() {
    let filtered = [...expenses];
    
    // Filter by category
    const categoryFilter = document.getElementById('filterCategory').value;
    if (categoryFilter) {
        filtered = filtered.filter(exp => exp.category === categoryFilter);
    }
    
    // Filter by search
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(exp => 
            exp.title.toLowerCase().includes(searchTerm) ||
            categoryNames[exp.category].toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by date range
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate) {
        filtered = filtered.filter(exp => exp.date >= startDate);
    }
    
    if (endDate) {
        filtered = filtered.filter(exp => exp.date <= endDate);
    }
    
    // Sort
    const sortBy = document.getElementById('sortBy').value;
    
    switch(sortBy) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            filtered.sort((a, b) => b.amount - a.amount);
            break;
        case 'lowest':
            filtered.sort((a, b) => a.amount - b.amount);
            break;
        case 'name':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    return filtered;
}

function clearFilters() {
    document.getElementById('filterCategory').value = '';
    document.getElementById('sortBy').value = 'newest';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('searchInput').value = '';
    renderExpenses();
}

// ========== Dashboard Statistics ==========
function updateDashboard() {
    // Get current month's expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    // Total expenses
    const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalExpenses').textContent = `$${total.toFixed(2)}`;
    
    // Category breakdown
    const categoryTotals = {};
    monthlyExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    // Top category
    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategoryEntry) {
        document.getElementById('topCategory').textContent = categoryNames[topCategoryEntry[0]];
        document.getElementById('topCategoryAmount').textContent = `$${topCategoryEntry[1].toFixed(2)}`;
    } else {
        document.getElementById('topCategory').textContent = '—';
        document.getElementById('topCategoryAmount').textContent = '$0.00';
    }
    
    // Largest expense
    const largest = monthlyExpenses.reduce((max, exp) => 
        exp.amount > (max?.amount || 0) ? exp : max, null
    );
    
    if (largest) {
        document.getElementById('largestExpense').textContent = `$${largest.amount.toFixed(2)}`;
        document.getElementById('largestExpenseTitle').textContent = largest.title;
    } else {
        document.getElementById('largestExpense').textContent = '$0.00';
        document.getElementById('largestExpenseTitle').textContent = '—';
    }
}

// ========== Chart Visualization ==========
function updateChart() {
    const canvas = document.getElementById('expenseChart');
    const chartContainer = document.querySelector('.chart-container');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (expenses.length === 0) {
        chartContainer.classList.remove('active');
        noDataMessage.style.display = 'block';
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }
        return;
    }
    
    noDataMessage.style.display = 'none';
    chartContainer.classList.add('active');
    
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    const labels = Object.keys(categoryTotals).map(cat => categoryNames[cat]);
    const data = Object.values(categoryTotals);
    
    const colors = {
        food: '#ef4444',
        transport: '#3b82f6',
        shopping: '#ec4899',
        bills: '#f59e0b',
        entertainment: '#8b5cf6',
        health: '#10b981',
        education: '#06b6d4',
        other: '#6b7280'
    };
    
    const backgroundColors = Object.keys(categoryTotals).map(cat => colors[cat]);
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#cbd5e1' : '#475569';
    
    expenseChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        color: textColor,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ========== Dark Mode ==========
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('darkModeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'true');
    } else {
        icon.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update chart colors
    if (expenseChart) {
        updateChart();
    }
}

// ========== CSV Export ==========
function exportToCSV() {
    if (expenses.length === 0) {
        alert('No expenses to export');
        return;
    }
    
    // Sort by date (newest first)
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create CSV content
    const headers = ['Date', 'Title', 'Category', 'Amount'];
    const rows = sorted.map(exp => [
        exp.date,
        `"${exp.title}"`,
        categoryNames[exp.category],
        exp.amount.toFixed(2)
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// ========== Utility Functions ==========
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}
