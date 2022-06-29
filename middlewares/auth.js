const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(authorization, 'some-secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
