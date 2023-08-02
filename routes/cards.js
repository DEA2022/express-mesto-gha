const cardsRouter = require('express').Router();
const {
  getCards, deleteCard, createCard, addLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
