const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { regexUrl } = require('../constants/regexUrl');

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(regexUrl),
    }),
  }),
  createCard,
);

cardRouter.get('/', getCards);

cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  deleteCard,
);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  likeCard,
);

cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  dislikeCard,
);
module.exports = cardRouter;
