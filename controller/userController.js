const express = require('express');
const jwt = require('jsonwebtoken');
const { registerUser, validateUser, findUserByUsername } = require('../service/userService');
const { secret, expiresIn } = require('../config/jwt');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha obrigatórios' });
  }
  // Validação explícita de usuário já existente
  if (findUserByUsername(username)) {
    return res.status(409).json({ message: 'Usuário já existe' });
  }
  try {
    await registerUser(username, password);
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha obrigatórios' });
  }
  const user = await validateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ username: user.username }, secret, { expiresIn });
  res.json({ token });
});

router.get('/', (req, res) => {
  // Lista todos os usuários (apenas para debug, não recomendado em produção)
  res.json({ users: require('../model/userModel').users.map(u => ({ username: u.username })) });
});

module.exports = router;
