const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const handlerErrors = require('./middlewares/handlerErrors');

const { PORT = 3000, MESTO_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MESTO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/', router);

app.use(errors());
app.use(handlerErrors);

app.listen(PORT);
