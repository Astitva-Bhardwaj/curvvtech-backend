const DeviceService = require('../services/deviceService');

exports.registerDevice = async (req, res) => {
  try {
    const device = await DeviceService.createDevice(req.body, req.user._id);

    res.status(201).json({
      success: true,
      device: {
        id: device._id,
        name: device.name,
        type: device.type,
        status: device.status,
        last_active_at: device.last_active_at,
        owner_id: device.owner_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering device'
    });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const { type, status, page, limit } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;

    const pagination = { page, limit };

    const result = await DeviceService.getDevicesByOwner(req.user._id, filters, pagination);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching devices'
    });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await DeviceService.updateDevice(id, req.user._id, req.body);

    res.json({
      success: true,
      device
    });
  } catch (error) {
    if (error.message === 'Invalid device ID' || error.message === 'Device not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating device'
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    await DeviceService.deleteDevice(id, req.user._id);

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Invalid device ID' || error.message === 'Device not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting device'
    });
  }
};

exports.deviceHeartbeat = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const device = await DeviceService.updateHeartbeat(id, req.user._id, status);

    res.json({
      success: true,
      message: 'Device heartbeat recorded',
      last_active_at: device.last_active_at
    });
  } catch (error) {
    if (error.message === 'Invalid device ID' || error.message === 'Device not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error recording heartbeat'
    });
  }
};
