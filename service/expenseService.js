const { expenses } = require('../model/expenseModel');

function addExpense(username, expense) {
  const { description, value, date } = expense;
  if (!description || !value || !date) {
    const err = new Error('Campos obrigatórios: description, value, date');
    err.status = 400;
    throw err;
  }
  const newExpense = { ...expense, id: expenses.length + 1, username };
  expenses.push(newExpense);
  return newExpense;
}

function getExpenses(username) {
  return expenses.filter(e => e.username === username);
}

function editExpense(username, id, data) {
  const expense = expenses.find(e => e.id === id && e.username === username);
  if (!expense) {
    const err = new Error('Despesa não encontrada');
    err.status = 404;
    throw err;
  }
  Object.assign(expense, data);
  return expense;
}

module.exports = { addExpense, getExpenses, editExpense };
