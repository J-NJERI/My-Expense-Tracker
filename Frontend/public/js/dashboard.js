document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});

async function fetchDashboardData() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/get-expenses');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const expenses = await response.json();

        if (expenses.length === 0) {
            console.warn('No expenses found');
            return;
        }

        updateTotalExpenses(expenses);
        generateCategoryChart(expenses);
        generateMonthlyChart(expenses);
        populateRecentTransactions(expenses);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

function updateTotalExpenses(expenses) {
    console.log('Expenses received:', expenses);

    const totalExpenses = expenses.reduce((total, expense) => {
        return total + parseFloat(expense.amount);
    }, 0);

    const totalExpenseElement = document.getElementById('totalExpenses');
    if (totalExpenseElement) {
        totalExpenseElement.textContent = `$${totalExpenses.toFixed(2)}`;
        console.log('Total expenses updated:', totalExpenses.toFixed(2));
    } else {
        console.error('Element with ID "total expenses" not found.');
    }
}

function generateCategoryChart(expenses) {
    const categories = {};
    
    expenses.forEach(expense => {
        const category = expense.category || 'Uncategorized';
        if (categories[category]) {
            categories[category] += parseFloat(expense.amount);
        } else {
            categories[category] = parseFloat(expense.amount);
        }
    });

    console.log('Categories:', categories);

    const categoryCtx = document.getElementById('expensesByCategory').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(categories),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': $' + context.raw.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function generateMonthlyChart(expenses) {
    const monthlyTotals = Array(12).fill(0);

    expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth();
        monthlyTotals[month] += parseFloat(expense.amount);
    });

    const monthlyCtx = document.getElementById('monthlyExpenses').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ],
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyTotals,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function populateRecentTransactions(expenses) {
    const recentTransactions = expenses.slice(0, 5); // Show recent 5 transactions
    const tableBody = document.getElementById('recentTransactions');
    
    if (tableBody) {
        tableBody.innerHTML = '';

        recentTransactions.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.id}</td>
                <td>$${parseFloat(expense.amount).toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error('Element with ID "recentTransactions" not found.');
    }
}
