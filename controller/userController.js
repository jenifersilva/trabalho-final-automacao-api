const express = require('express');
const router = express.Router();
const userService = require('../service/userService');


router.post('/users/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await userService.registerUser(username, password);
    res.status(201).json({ message: result.message });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await userService.validateUser(username, password);
    res.json({ token: result.token });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.get('/users', (req, res) => {
  // Lista todos os usuários (apenas para debug, não recomendado em produção)
  res.json({ users: require('../model/userModel').users.map(u => ({ username: u.username })) });
});

module.exports = router;
