const User = require("../models/user");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) =>
      res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Некорректный id пользователя" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Введены некорректные данные" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Введены некорректные данные" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Пользователь не найден" });
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Введены некорректные данные" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};
