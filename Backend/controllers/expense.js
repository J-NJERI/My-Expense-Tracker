const { getAllExpenses, insertExpense, deleteExpense } = require("../models/expensemodel");

exports.addExpense = async (req, res) => {
    const { amount, category, description, date } = req.body;
    const userId = req.user.id;
    try {
        // Convert amount to a number
        const numericAmount = parseFloat(amount);

        // Validations
        if (!category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        // Call to insertExpense function
        await insertExpense(userId, numericAmount, date, category, description);

        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error!' });
    }
};


exports.getExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await getAllExpenses(userId);
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server Error!' });
    }
};

exports.deleteExpense = async (req,res) => {
    const { id } = req.params;
    try {
        await deleteExpense(id);
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error! '});
    }
};