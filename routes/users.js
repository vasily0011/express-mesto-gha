const userRouter = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  editUserProfile,
  editUserAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', editUserProfile);
userRouter.patch('/me/avatar', editUserAvatar);

module.exports = userRouter;
