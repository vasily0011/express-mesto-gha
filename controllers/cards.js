const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).send({
          message: "При создании карточки переданы некорректные данные",
        });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.status(200).send({ message: "Карточка успешно удалена" });
      }
      return res.status(404).send({ message: "Такой карточки не существует" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Такой карточки не существует" });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      } else {
        return res
          .status(404)
          .send({ message: "Такой карточки не существует" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).send({ message: "Данные переданы некорректно" });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      } else {
        return res
          .status(404)
          .send({ message: "Такой карточки не существует" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Данные переданы некорректно" });
      } else {
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
};
