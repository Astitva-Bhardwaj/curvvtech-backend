const express = require('express');
const {
  createLog,
  getDeviceLogs,
  getDeviceUsage
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// All analytics routes require authentication
router.use(auth);

router.post('/:id/logs', validate(schemas.deviceLog), createLog);
router.get('/:id/logs', getDeviceLogs);
router.get('/:id/usage', getDeviceUsage);

module.exports = router;
