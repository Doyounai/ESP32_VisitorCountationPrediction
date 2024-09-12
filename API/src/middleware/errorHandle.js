const ErrorHandle = (err, req, res, next) => {
  res.status(err.statusCode).send(err.msg);
};

module.exports = { ErrorHandle };
