const express = require('express');
const mongoose = require('mongoose');

const { usersRoutes } = require('./routes/users');
const { cardsRoutes } = require('./routes/cards');
const { NOT_FOUND_STATUS_CODE } = require('./utils/errors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

app.use((req, _res, next) => {
  req.user = {
    _id: '64ae8753decdce5f8a234e7a'
  };

  next();
});

app.use(express.json());
app.use(usersRoutes);
app.use(cardsRoutes);
app.use('*', (_req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт ${PORT}`);
});
