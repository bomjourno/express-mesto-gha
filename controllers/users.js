const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) =>
      res.send({
        name,
        about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
        avatar,
        _id: user._id,
      })
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};
