const AnalyticsService = require('../services/analyticsService');

exports.createLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { event, value } = req.body;

    const log = await AnalyticsService.createDeviceLog(id, req.user._id, { event, value });

    res.status(201).json({
      success: true,
      log: {
        id: log._id,
        event: log.event,
        value: log.value,
        timestamp: log.timestamp
      }
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
      message: 'Error creating log entry'
    });
  }
};

exports.getDeviceLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const logs = await AnalyticsService.getDeviceLogs(id, req.user._id, limit);

    res.json({
      success: true,
      logs: logs.map(log => ({
        id: log._id,
        event: log.event,
        value: log.value,
        timestamp: log.timestamp
      }))
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
      message: 'Error fetching device logs'
    });
  }
};

exports.getDeviceUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const { range } = req.query;

    const usage = await AnalyticsService.getDeviceUsage(id, req.user._id, range);

    res.json({
      success: true,
      device_id: usage.device_id,
      [`total_units_${usage.period}`]: usage.total_units
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
      message: 'Error fetching device usage'
    });
  }
};
