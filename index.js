const express = require('express');
require('dotenv').config();
const cors = require('cors');
require('dotenv').config();

const UsersRouter = require('./routers/usersRouter');
const UsersController = require('./controllers/usersController');

const db = require('./db/models/index');

const { user } = db;

const usersController = new UsersController(user);

const usersRouter = new UsersRouter(usersController).routes();

const PORT = 3001;
const app = express();

app.use(cors());

// Handle preflight OPTIONS requests
app.options(
  '*',
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(express.json());

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
