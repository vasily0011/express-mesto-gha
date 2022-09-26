const Card = require('../models/card');
const { badRequest, notFound, internalServerError } = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch(() => {
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({
          message: 'При создании карточки переданы некорректные данные',
        });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({ message: 'Карточка успешно удалена' });
      }
      return res.status(notFound).send({ message: 'Такой карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(badRequest)
          .send({ message: 'Такой карточки не существует' });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return res
        .status(notFound)
        .send({ message: 'Такой карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return res
        .status(notFound)
        .send({ message: 'Такой карточки не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Данные переданы некорректно' });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};
