const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const userRoutes = require('./controller/userController');
const expenseRoutes = require('./controller/expenseController');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);

module.exports = app;
