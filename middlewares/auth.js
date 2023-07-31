const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/handleErrors/authorization-err');

// eslint-disable-next-line consistent-return
module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Неправильные почта или пароль');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Неправильные почта или пароль'));
  }
  req.user = payload;
  next();
};
