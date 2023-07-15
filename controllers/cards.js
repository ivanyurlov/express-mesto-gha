/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require('../utils/errors');

module.exports.getCards = (_req, res) => {
  Card.find({})
  .then(card => res.status(OK_STATUS_CODE).send({ data: card }))
  .catch(_err => res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' }))
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
  .then(card => res.status(CREATED_STATUS_CODE).send({ data: card }))
  .catch(err => {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
  .then(card => {
    if (!card) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(OK_STATUS_CODE).send({ data: card })
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при удалении карточки' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },)
  .then(card => {
    if (!card) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(CREATED_STATUS_CODE).send({ data: card });
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при постановке лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },)
  .then(card => {
    if (!card) {
      return res.status(NOT_FOUND_STATUS_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(OK_STATUS_CODE).send({ data: card });
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_STATUS_CODE).send({ message: 'Переданы некорректные данные при удалении лайка' });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: 'Произошла ошибка на сервере' });
  });
}