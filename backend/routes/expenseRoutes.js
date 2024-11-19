const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { addExpense, getExpenses, deleteExpense, updateExpense } = require('../controllers/expenseController');

router.post('/add', authenticate, addExpense);
router.get('/', authenticate, getExpenses);
router.delete('/:id', authenticate, deleteExpense);
router.put('/:id', authenticate, updateExpense);

module.exports = router;
