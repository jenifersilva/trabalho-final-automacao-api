const { expenses } = require('../model/expenseModel');

function addExpense(username, expense) {
  const newExpense = { ...expense, id: expenses.length + 1, username };
  expenses.push(newExpense);
  return newExpense;
}

function getExpenses(username) {
  return expenses.filter(e => e.username === username);
}

function editExpense(username, id, data) {
  const expense = expenses.find(e => e.id === id && e.username === username);
  if (!expense) throw new Error('Despesa não encontrada');
  Object.assign(expense, data);
  return expense;
}

module.exports = { addExpense, getExpenses, editExpense };
