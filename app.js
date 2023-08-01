const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, MESTO_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MESTO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64c785bb34df83675fcb6e4d',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT);
