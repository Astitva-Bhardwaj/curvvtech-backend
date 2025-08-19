const Device = require('../models/Device');
const mongoose = require('mongoose');

class DeviceService {
  async createDevice(deviceData, ownerId) {
    const device = new Device({
      ...deviceData,
      owner_id: ownerId
    });
    
    await device.save();
    return device;
  }

  async getDevicesByOwner(ownerId, filters = {}, pagination = {}) {
    const { type, status } = filters;
    const { page = 1, limit = 10 } = pagination;

    const filter = { owner_id: ownerId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const devices = await Device.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Device.countDocuments(filter);

    return {
      devices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  }

  async getDeviceById(deviceId, ownerId) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    const device = await Device.findOne({ _id: deviceId, owner_id: ownerId });
    if (!device) {
      throw new Error('Device not found');
    }

    return device;
  }

  async updateDevice(deviceId, ownerId, updates) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    const device = await Device.findOneAndUpdate(
      { _id: deviceId, owner_id: ownerId },
      updates,
      { new: true, runValidators: true }
    );

    if (!device) {
      throw new Error('Device not found');
    }

    return device;
  }

  async deleteDevice(deviceId, ownerId) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    const device = await Device.findOneAndDelete({
      _id: deviceId,
      owner_id: ownerId
    });

    if (!device) {
      throw new Error('Device not found');
    }

    return device;
  }

  async updateHeartbeat(deviceId, ownerId, status) {
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      throw new Error('Invalid device ID');
    }

    const device = await Device.findOneAndUpdate(
      { _id: deviceId, owner_id: ownerId },
      { 
        status,
        last_active_at: new Date()
      },
      { new: true }
    );

    if (!device) {
      throw new Error('Device not found');
    }

    return device;
  }

  async deactivateInactiveDevices() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const result = await Device.updateMany(
      {
        last_active_at: { $lt: twentyFourHoursAgo },
        status: { $ne: 'inactive' }
      },
      {
        status: 'inactive'
      }
    );

    return result;
  }
}

module.exports = new DeviceService();
