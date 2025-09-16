const { users } = require('../model/userModel');
const bcrypt = require('bcryptjs');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

async function registerUser(username, password) {
  if (findUserByUsername(username)) {
    throw new Error('Usuário já existe');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);
  return user;
}

async function validateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return false;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : false;
}

module.exports = { registerUser, validateUser, findUserByUsername };
