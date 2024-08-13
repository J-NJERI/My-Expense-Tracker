// js/report.js

document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
});

async function fetchExpenses() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/get-expenses');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const expenses = await response.json();
        generateCharts(expenses);
        populateTable(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

function generateCharts(expenses) {
    // Prepare data for charts
    const categories = {};
    const monthlyTotals = Array(12).fill(0);

    expenses.forEach(expense => {
        // Categorize expenses
        if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
        } else {
            categories[expense.category] = expense.amount;
        }

        // Calculate monthly totals
        const month = new Date(expense.date).getMonth();
        monthlyTotals[month] += expense.amount;
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
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

    // Monthly Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
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

function populateTable(expenses) {
    const tableBody = document.getElementById('expensesTableBody');
    tableBody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

