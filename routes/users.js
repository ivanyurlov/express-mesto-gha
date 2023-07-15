const usersRoutes = require('express').Router();
const { getUsers, getUser, createUser, editProfileUserInfo, editProfileUserAvatar } = require('../controllers/users');


usersRoutes.get('/users', getUsers);
usersRoutes.get('/users/:_id', getUser);
usersRoutes.post('/users', createUser);
usersRoutes.patch('/users/me', editProfileUserInfo);
usersRoutes.patch('/users/me/avatar', editProfileUserAvatar);

module.exports = {
  usersRoutes
};