const DeviceLog = require('../models/DeviceLog');
const DeviceService = require('./deviceService');
const mongoose = require('mongoose');

class AnalyticsService {
  async createDeviceLog(deviceId, ownerId, logData) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    // Verify device belongs to user
    await DeviceService.getDeviceById(deviceId, ownerId);

    const log = new DeviceLog({
      device_id: deviceId,
      ...logData
    });

    await log.save();
    return log;
  }

  async getDeviceLogs(deviceId, ownerId, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    // Verify device belongs to user
    await DeviceService.getDeviceById(deviceId, ownerId);

    const logs = await DeviceLog.find({ device_id: deviceId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    return logs;
  }

  async getDeviceUsage(deviceId, ownerId, range = '24h') {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    // Verify device belongs to user
    await DeviceService.getDeviceById(deviceId, ownerId);

    // Calculate time range
    const now = new Date();
    let startTime;
    
    switch (range) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Aggregate usage data
    const result = await DeviceLog.aggregate([
      {
        $match: {
          device_id: new mongoose.Types.ObjectId(deviceId),
          event: 'units_consumed',
          timestamp: { $gte: startTime }
        }
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$value' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUnits = result.length > 0 ? result[0].totalUnits : 0;

    return {
      device_id: deviceId,
      range,
      total_units: totalUnits,
      period: `last_${range}`
    };
  }
}

module.exports = new AnalyticsService();
