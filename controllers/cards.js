const Card = require("../models/card");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: "Такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Некорректный id карточки" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: "Невозможно поставить лайк - такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Некорректный id карточки" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({
          message: "Невозможно убрать лайк - такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Некорректный id карточки" });
      }
      return res
        .status(ERROR_CODE)
        .send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};
