const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

const app = express();
app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });

async function startApollo() {
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
          try {
            const user = jwt.verify(token, secret);
            return { user };
          } catch (e) {
            // Token is invalid or expired.
            // It's good practice to not throw an error here, but return null.
            // The resolvers will handle the unauthenticated case.
          }
        }
        return { user: null };
      },
    }),
  );
}

startApollo();

module.exports = app;
