const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    res.status(400).send({ message: 'Некорректный id' });

    return;
  }

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
        } else {
          res.status(404).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
      .then((user) => res.send(user))
      .catch(((error) => {
        if (error.name === 'ValidationError') {
          res.status(400).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
        } else {
          res.status(404).send({ message: `${Object.values(error.errors).map(() => error.message).join(', ')}` });
        }
      }));
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
