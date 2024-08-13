const router = require('express').Router();
const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addUser, loginUser } = require('../controllers/users');

router.post('/register', addUser)
    .post('/login',loginUser)
    
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
module.exports = router;