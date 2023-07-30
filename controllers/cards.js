const Card = require('../models/card');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require('../utils/errors');
const NotFoundError = require('../utils/handleErrors/not-found-err');
const BadRequestError = require('../utils/handleErrors/bad-request-err');
const ForbiddenError = require('../utils/handleErrors/forbidden-err');


module.exports.getCards = (_req, res, next) => {
  Card.find({})
  .then(card => res.status(OK_STATUS_CODE).send({ data: card }))
  .catch(err => next(err))
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
  .then(card => res.status(CREATED_STATUS_CODE).send({ data: card }))
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    next(err);
  });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
  // eslint-disable-next-line consistent-return
  .then((card) => {
     if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
     }
      if (String(card.owner) === String(req.user._id)) {
        Card.deleteOne(card)
        .then((cardDelete) => res.status(OK_STATUS_CODE).send(cardDelete));
      } else {
        return next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      }
    })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
    }
    next(err);
  });
}

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },)
  .then(card => {
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(CREATED_STATUS_CODE).send({ data: card });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
    }
    next(err);
  });
}

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },)
  .then(card => {
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(OK_STATUS_CODE).send({ data: card });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении лайка'));
    }
    next(err);
  });
}