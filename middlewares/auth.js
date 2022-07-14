require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'dev-secret' } = process.env;
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt || req.headers.authorization;

  if (!authorization) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    const authToken = authorization.replace('Bearer ', '');
    payload = jwt.verify(authToken, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
