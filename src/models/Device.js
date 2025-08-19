const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['light', 'fan', 'thermostat', 'camera', 'smart_meter', 'other']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  last_active_at: {
    type: Date,
    default: null
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
deviceSchema.index({ owner_id: 1, type: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ last_active_at: 1 });

module.exports = mongoose.model('Device', deviceSchema);
