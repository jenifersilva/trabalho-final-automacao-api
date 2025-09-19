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

  // Validar campos permitidos
  const allowedFields = ["description", "value", "date"];
  const updates = {};

  for (const field of allowedFields) {
    if (field in data) {
      if (
        data[field] === null ||
        data[field] === undefined ||
        data[field] === ""
      ) {
        const err = new Error(`O campo ${field} não pode estar vazio`);
        err.status = 400;
        throw err;
      }
      updates[field] = data[field];
    }
  }

  // Validar se há algum campo para atualizar
  if (Object.keys(updates).length === 0) {
    const err = new Error("Nenhum campo válido para atualização");
    err.status = 400;
    throw err;
  }

  // Atualizar apenas os campos permitidos
  Object.assign(expense, updates);
  return expense;
}

function deleteExpense(username, id) {
  const index = expenses.findIndex(
    (e) => e.id === id && e.username === username
  );
  if (index === -1) {
    const err = new Error("Despesa não encontrada");
    err.status = 404;
    throw err;
  }

  const deletedExpense = expenses.splice(index, 1)[0];
  return { message: "Despesa excluída com sucesso", deletedExpense };
}

module.exports = { addExpense, getExpenses, editExpense, deleteExpense };
