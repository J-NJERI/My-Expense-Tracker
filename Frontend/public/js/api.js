const API_BASE_URL = "http://localhost:5000/api/v1";

async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error resgistering user:', error);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content- Type': 'application/json'
            },
            body:JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

async function addExpense(amount, category, description, date) {
    try {
        const response = await fetch(`${API_BASE_URL}/add-expense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({ amount, category, description, date })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding expense:', error);
        throw error;
    }
}

async function getExpenses() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-expenses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    }
}

async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/delete-expense/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
}

export {
    registerUser,
    loginUser,
    addExpense,
    getExpenses,
    deleteExpense
}