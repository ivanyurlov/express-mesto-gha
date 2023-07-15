/* eslint-disable no-unused-vars */
const User = require('../models/user');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

module.exports.getUsers = (_req, res) => {
  User.find({})
  .then(user => res.status(OK_STATUS_CODE).send({ data: user }))
  .catch(_err => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' }))
}

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
  .then(user => {
    if (!user) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(OK_STATUS_CODE).send({ data: user });
  })
  .catch(_err => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' }))
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => res.status(CREATED_STATUS_CODE).send({ data: user }))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}

module.exports.editProfileUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {new: true, runValidators: true})
  .then(user => {
    if (!user) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(CREATED_STATUS_CODE).send({ data: user });
  })
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при редактировании пользователя' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}
module.exports.editProfileUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {new: true, runValidators: true})
  .then(user => {
    if (!user) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(CREATED_STATUS_CODE).send({ data: user });
  })
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при редактировании аватара' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}