const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/* eslint-disable no-unused-vars */
const User = require('../models/user');
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require('../utils/errors');
const NotFoundError = require('../utils/handleErrors/not-found-err');
const BadRequestError = require('../utils/handleErrors/bad-request-err');
const AuthorizationError = require('../utils/handleErrors/authorization-err');
const DublicationError = require('../utils/handleErrors/dublication-err');


module.exports.getUsers = (_req, res, next) => {
  User.find({})
  .then(user => res.status(OK_STATUS_CODE).send({ data: user }))
  .catch(err => next(err))
}

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id)
  .then(user => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK_STATUS_CODE).send({ data: user });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
    }
    next(err);
  });
}

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
  .then(user => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK_STATUS_CODE).send({ data: user });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
    }
    next(err);
  });
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10).then(hash => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  }))
  .then(user => res.status(CREATED_STATUS_CODE).send({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email
  }))
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    if (err.code === 11000) {
      return next(new DublicationError('Пользователь с такой почтой уже зарегистрирован'));
    }
    next(err);
  });
}

module.exports.editProfileUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {new: true, runValidators: true})
  .then(user => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK_STATUS_CODE).send({ data: user });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при редактировании пользователя'));
    }
    next(err);
  });
}
module.exports.editProfileUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {new: true, runValidators: true})
  .then(user => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK_STATUS_CODE).send({ data: user });
  })
  // eslint-disable-next-line consistent-return
  .catch(err => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при редактировании аватара'));
    }
    next(err);
  });
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не указан логин или пароль');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      return res.status(OK_STATUS_CODE).send({ token });
    })
    .catch((err) =>
       next(new AuthorizationError('Неправильные почта или пароль'))
    );
};