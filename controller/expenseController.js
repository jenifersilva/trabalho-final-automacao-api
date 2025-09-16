const express = require('express');
const authenticateToken = require('./authMiddleware');
const { addExpense, getExpenses, editExpense } = require('../service/expenseService');

const router = express.Router();

// Todas as rotas de despesas exigem autenticação
router.use(authenticateToken);

router.post('/', (req, res) => {
  const { description, value, date } = req.body;
  if (!description || !value || !date) {
    return res.status(400).json({ message: 'Campos obrigatórios: description, value, date' });
  }
  const expense = addExpense(req.user.username, { description, value, date });
  res.status(201).json(expense);
});

router.get('/', (req, res) => {
  const expenses = getExpenses(req.user.username);
  res.json(expenses);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const expense = editExpense(req.user.username, id, req.body);
    res.json(expense);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
