const User = require('../models/user');
const { badRequest, notFound, internalServerError } = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return res
        .status(notFound)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(badRequest)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'При создании пользователя переданы некорректные данные',
        });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.editUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'При обновлении профиля переданны некорректные данные',
        });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'При обновлении аватара переданы некорректные данные',
        });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};
