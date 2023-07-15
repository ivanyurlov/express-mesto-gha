const cardsRoutes = require('express').Router();
const { getCards, createCard, deleteCard, addLike, removeLike } = require('../controllers/cards');


cardsRoutes.get('/cards', getCards);
cardsRoutes.post('/cards', createCard);
cardsRoutes.delete('/cards/:_id', deleteCard);
cardsRoutes.put('/cards/:_id/likes', addLike);
cardsRoutes.delete('/cards/:_id/likes', removeLike);

module.exports = {
  cardsRoutes
};