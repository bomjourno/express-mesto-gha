const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isURL = require("validator/lib/isURL");
const isEmail = require("validator/lib/isEmail");
const Unauthorized = require("../errors/Unauthorized");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator: (u) => isURL(u),
      message: "Некорректные данные для avatar",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (e) => isEmail(e),
      message: "Некорректные данные для email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }, { runValidators: true })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized("Неправильные почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Unauthorized("Неправильные почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
