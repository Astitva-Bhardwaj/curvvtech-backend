const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  event: {
    type: String,
    required: true,
    enum: ['units_consumed', 'status_change', 'temperature_reading', 'motion_detected', 'other']
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient log queries
deviceLogSchema.index({ device_id: 1, timestamp: -1 });
deviceLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('DeviceLog', deviceLogSchema);
