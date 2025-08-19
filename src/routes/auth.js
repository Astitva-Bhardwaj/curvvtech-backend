const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, validate(schemas.signup), signup);
router.post('/login', authLimiter, validate(schemas.login), login);

module.exports = router;
