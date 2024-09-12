class ErrorRes extends Error {
  statusCode;

  constructor(msg, code) {
    super(msg);

    this.statusCode = code;
  }
}

module.exports = ErrorRes