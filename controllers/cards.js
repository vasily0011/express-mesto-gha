const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('При создании карточки переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Отказано в доступе'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send(card);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректные данные запроса'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundError('Такой карточки не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Данные переданы некорректно'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundError('Такой карточки не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Данные переданы некорректно'));
      }
      return next(err);
    });
};
