const Card = require("../models/card");
const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const ValidationError = require("../errors/ValidationError");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Введены некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound("Такой карточки не существует");
      }
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden("Нет прав для удаления карточки");
      }
      return card
        .remove()
        .then(() => res.send({ message: "Карточка удалена" }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(
          new NotFound(
            "Невозможно поставить лайк - такой карточки не существует"
          )
        );
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(
          new NotFound("Невозможно убрать лайк - такой карточки не существует")
        );
      }
      return res.send(card);
    })
    .catch(next);
};
