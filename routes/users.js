const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getCurrentUser, editProfileUserInfo, editProfileUserAvatar,
} = require('../controllers/users');
const { URL_REGEXP } = require('../utils/regexp');

usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/me', getCurrentUser);
usersRoutes.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editProfileUserInfo);
usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL_REGEXP),
  }),
}), editProfileUserAvatar);

module.exports = {
  usersRoutes,
};
