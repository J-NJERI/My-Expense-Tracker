document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('You must be logged in to manage your expenses.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('loginNav').style.display = 'none';
    document.getElementById('registerNav').style.display = 'none';
    document.getElementById('logoutNav').style.display = 'block';

    document.getElementById('addExpenseForm').addEventListener('submit', addExpense);
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
    fetchExpenses();
});

async function addExpense(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const token = localStorage.getItem('authToken');

    if(!token) {
        alert('You must be logged in to add expense.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/v1/add-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, category, description, date })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error adding expense:', error.message || 'Unknown error');
            alert(`Failed to add expense: ${error.message}`);
            return;
        }

        document.getElementById('addExpenseForm').reset();
        fetchExpenses();
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('An error occurred while adding the expense.');
    }
}

async function fetchExpenses() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('You must be logged in to view expenses.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/v1/get-expenses', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error fetching expenses:',error.message);
            alert(`Failed to fetch expenses: ${error.message}`);
            return;
        }

        const expenses = await response.json();
        displayExpenses(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        alert('An error occurred while fetching expenses.');
    }
}

function displayExpenses(expenses) {
    const tableBody = document.querySelector('#expenseList tbody');

    if (!tableBody) {
        console.error('Table body element not found.');
        return;
    }

    tableBody.innerHTML = '';

    console.log('Expenses:', expenses);

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.id}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td><button onclick="deleteExpense(${expense.id})" class="btn">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function deleteExpense(id) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`http://localhost:5000/api/v1/delete-expense/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error deleting expense:', error.message || 'Unknown error');
            alert(`Failed to delete expense: ${error.message}`);
            return;
        }

        fetchExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('An error occurred while deleting the expense.');
    }
}

