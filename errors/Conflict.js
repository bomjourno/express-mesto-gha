class Conflict extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 409;
  }
}

module.exports = Conflict;
