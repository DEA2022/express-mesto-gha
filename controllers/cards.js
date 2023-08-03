const errorConstants = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(errorConstants.HTTP_STATUS_CREATED).send(data))
        .catch((error) => {
          if (error instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
          } else {
            res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
