const router = require('express').Router();
const {
  getUsers, getUserById, addUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
