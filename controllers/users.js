const errorConstants = require('http2').constants;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(errorConstants.HTTP_STATUS_CREATED).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении информации о пользователе' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch(((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(errorConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан некорректный url' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(errorConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    }));
};
