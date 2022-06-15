const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Введены некорректные данные" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: "Такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: "Невозможно поставить лайк - такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Введены некорректные данные" });
      }
      return res.status(500).send({ message: err.message });
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
        return res.status(404).send({
          message: "Невозможно убрать лайк - такой карточки не существует",
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Введены некорректные данные" });
      }
      return res.status(500).send({ message: err.message });
    });
};
