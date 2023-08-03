const errorConstants = require('http2').constants;
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(errorConstants.HTTP_STATUS_NOT_FOUND).json({
    message: 'Страница не найдена',
  });
});

module.exports = router;
