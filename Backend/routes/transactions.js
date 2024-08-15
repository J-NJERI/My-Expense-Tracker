const router = require('express').Router();
const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addUser, loginUser } = require('../controllers/users');
const authenticateToken = require('../middleware/auth');

router.post('/register', addUser)
router.post('/login',loginUser)
    
router.use(authenticateToken)
router.post('/add-expense', addExpense)
router.get('/get-expenses', getExpense)
router.delete('/delete-expense/:id', deleteExpense);

module.exports = router;