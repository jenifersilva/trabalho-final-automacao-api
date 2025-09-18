const { users } = require('../model/userModel');
const bcrypt = require('bcryptjs');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

async function registerUser(username, password) {
  if (!username || !password) {
    const err = new Error('Usuário e senha obrigatórios');
    err.status = 400;
    throw err;
  }
  if (findUserByUsername(username)) {
    const err = new Error('Usuário já existe');
    err.status = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return { message: 'Usuário registrado com sucesso', user };
}

const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

async function validateUser(username, password) {
  if (!username || !password) {
    const err = new Error('Usuário e senha obrigatórios');
    err.status = 400;
    throw err;
  }
  const user = findUserByUsername(username);
  if (!user) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ username: user.username }, secret, { expiresIn });
  return { token };
}

module.exports = { registerUser, validateUser, findUserByUsername };
