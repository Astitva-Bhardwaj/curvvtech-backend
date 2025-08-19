const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const createRateLimiter = (windowMs = config.rateLimitWindowMs, max = config.rateLimitMaxRequests) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = {
  generalLimiter: createRateLimiter(),
  authLimiter: createRateLimiter(15 * 60 * 1000, 5), // 5 attempts per 15 minutes for auth
};
