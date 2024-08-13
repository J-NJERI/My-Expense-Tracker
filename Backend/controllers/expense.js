const { createTable, getAllExpenses, insertExpense, deleteExpense } = require("../models/expensemodel");

exports.addExpense = async (req, res) => {
    const { amount, category, description, date } = req.body;

    try {
        //validations
        if(!category || !description  || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        // if(amount<= 0 || typeof amount !== 'number'){
        //     return res.status(400).json({message: 'Amount must be a positive number'})
        // }
        insertExpense(amount, date, category, description);

        res.status(200).json({message: 'Expense Added'});
    } catch (error) {
        res.status(500).json({message: 'Server error!'});
    }
};

exports.getExpense = (req, res) => {
    getAllExpenses((incomes) => {
        res.status(200).json(incomes);
    });
};

exports.deleteExpense = (req,res) => {
    const {id} = req.params;
    deleteExpense(id);
    res.status(200).json({ message: 'Expense Deleted'})
}