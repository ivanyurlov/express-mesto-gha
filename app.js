const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { INTERNAL_SERVER_ERROR_STATUS_CODE, NOT_FOUND_STATUS_CODE } = require('./utils/errors');
// const { NotFoundError } = require('./utils/handleErrors/not-found-err');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { URL_REGEXP } = require('./utils/regexp');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), createUser);
app.use(auth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use('*', (_req, res) => {
   res.status(NOT_FOUND_STATUS_CODE).json({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, _req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE
      ? 'На сервере произошла ошибка'
      : message
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
