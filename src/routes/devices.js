const express = require('express');
const {
  registerDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  deviceHeartbeat
} = require('../controllers/deviceController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// All device routes require authentication
router.use(auth);

router.post('/', validate(schemas.device), registerDevice);
router.get('/', getDevices);
router.patch('/:id', validate(schemas.deviceUpdate), updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/heartbeat', validate(schemas.heartbeat), deviceHeartbeat);

module.exports = router;
