const errorConstants = require('http2').constants;

const handlerErrors = (err, req, res, next) => {
  const { statusCode = errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = handlerErrors;
