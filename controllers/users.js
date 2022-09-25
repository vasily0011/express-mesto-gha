const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Запрашиваемый пользователь не найден" });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "При создании пользователя переданы некорректные данные",
        });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.editUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "При обновлении профиля переданны некорректные данные",
        });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "При обновлении аватара переданы некорректные данные",
        });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};