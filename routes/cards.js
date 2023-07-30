const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, addLike, removeLike } = require('../controllers/cards');
const { URL_REGEXP } = require('../utils/regexp');

cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEXP),
  }),
}), createCard);
cardsRoutes.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
cardsRoutes.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), addLike);
cardsRoutes.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), removeLike);

module.exports = {
  cardsRoutes
};