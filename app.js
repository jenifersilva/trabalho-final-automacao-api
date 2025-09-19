const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const userRoutes = require('./controller/userController');
const expenseRoutes = require('./controller/expenseController');

const authenticateToken = require('./controller/authMiddleware');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(userRoutes);
app.use('/expenses', authenticateToken, expenseRoutes);

module.exports = app;
