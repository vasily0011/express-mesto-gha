const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  getUsers,
  getUser,
  editUserProfile,
  editUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { regexUrl } = require('../constants/regexUrl');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  getUser,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  editUserProfile,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(regexUrl),
    }),
  }),
  editUserAvatar,
);

module.exports = userRouter;
