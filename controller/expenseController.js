const express = require('express');
const authenticateToken = require('./authMiddleware');
const expenseService = require('../service/expenseService');

const router = express.Router();

// Todas as rotas de despesas exigem autenticação
router.use(authenticateToken);


router.post('/', async (req, res) => {
  const { description, value, date } = req.body;
  try {
    const result = await expenseService.addExpense(req.user.username, { description, value, date });
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const expenses = await expenseService.getExpenses(req.user.username);
    res.json(expenses);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const expense = await expenseService.editExpense(req.user.username, id, req.body);
    res.json(expense);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await expenseService.deleteExpense(req.user.username, id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
