const userService = require('../service/userService');
const expenseService = require('../service/expenseService');
const { GraphQLError } = require('graphql');

module.exports = {
  Query: {
    login: async (_, { username, password }) => {
      const { token } = await userService.validateUser(username, password);
      return { token };
    },
    expenses: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const { user } = context;
      return expenseService.getExpenses(user.username);
    },
    users: async () => {
      return require('../model/userModel').users.map(u => ({ username: u.username }));
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const result = await userService.registerUser(username, password);
      return { message: result.message };
    },
    addExpense: async (_, { description, value, date }, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const { user } = context;
      return await expenseService.addExpense(user.username, { description, value, date });
    },
    editExpense: async (_, { id, description, value, date }, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const { user } = context;
      return await expenseService.editExpense(user.username, id, { description, value, date });
    },
    deleteExpense: async (_, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const { user } = context;
      const result = await expenseService.deleteExpense(user.username, id);
      return { message: result.message };
    },
  },
};
