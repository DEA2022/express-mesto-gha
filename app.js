const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');
const handlerErrors = require('./middlewares/handlerErrors');

const { PORT = 3000, MESTO_DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MESTO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(helmet());
app.use(express.json());
app.use('/', router);

app.use(errors());
app.use(handlerErrors);

app.listen(PORT);
