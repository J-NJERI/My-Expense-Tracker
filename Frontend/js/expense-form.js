// js/expense-form.js

document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses();
    document.getElementById('addExpenseForm').addEventListener('submit', addExpense);
});

async function addExpense(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    try {
        const response = await fetch('http://localhost:5000/api/v1/add-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, category, description, date })
        });

        if (!response.ok) {
            throw new Error('Failed to add expense');
        }

        document.getElementById('addExpenseForm').reset();
        fetchExpenses();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

async function fetchExpenses() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/get-expenses');
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const expenses = await response.json();
        displayExpenses(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

function displayExpenses(expenses) {
    const tableBody = document.querySelector('#expenseList tbody');
    tableBody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td><button onclick="deleteExpense(${expense.id})" class="btn">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function deleteExpense(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/delete-expense/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete expense');
        }

        fetchExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

