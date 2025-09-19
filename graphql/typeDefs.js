const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    username: String!
    password: String
    token: String
  }

  type Expense {
    id: Int!
    description: String!
    value: Float!
    date: String!
    username: String!
  }

  type AuthPayload {
    token: String!
  }

  type Message {
    message: String!
  }

  type Query {
    login(username: String!, password: String!): AuthPayload!
    expenses: [Expense!]!
    users: [User!]!
  }

  type Mutation {
    register(username: String!, password: String!): Message!
    addExpense(description: String!, value: Float!, date: String!): Expense!
    editExpense(id: Int!, description: String, value: Float, date: String): Expense!
    deleteExpense(id: Int!): Message!
  }
`;
