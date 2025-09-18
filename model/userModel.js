const bcrypt = require('bcryptjs');

const users = [
  {
    username: "tiago",
    password: bcrypt.hashSync('password', 8)
  },
  {
    username: "jenifer",
    password: bcrypt.hashSync('password', 8)
  },
];

module.exports = {
  users,
};
