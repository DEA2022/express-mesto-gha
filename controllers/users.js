const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный id' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении информации о пользователе' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        res.status(400).send({ message: 'Передан некорректный url' });
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    }));
};
