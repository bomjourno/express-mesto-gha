require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'some-secret-key' } = process.env;
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt || req.headers.authorization.replace('Bearer ', '');

  if (!authorization) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(authorization, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
