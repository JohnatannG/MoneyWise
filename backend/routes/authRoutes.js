const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { register, login, getUserData } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticate, getUserData);

module.exports = router;