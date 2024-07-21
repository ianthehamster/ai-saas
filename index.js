const express = require('express');
require('dotenv').config();
const cors = require('cors');
require('dotenv').config();

const UsersRouter = require('./routers/usersRouter');
const UsersController = require('./controllers/usersController');

const APIsRouter = require('./routers/apisRouter');
const APIsController = require('./controllers/apisController');

const db = require('./db/models/index');
const ChatsController = require('./controllers/chatsController');
const ChatsRouter = require('./routers/chatsRouter');

const { user, chat, apilimit } = db;

const usersController = new UsersController(user);
const chatsController = new ChatsController(chat);
const apisController = new APIsController(apilimit);

const usersRouter = new UsersRouter(usersController).routes();
const chatsRouter = new ChatsRouter(chatsController).routes();
const apisRouter = new APIsRouter(apisController).routes();

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
app.use('/chats', chatsRouter);
app.use('/api', apisRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
