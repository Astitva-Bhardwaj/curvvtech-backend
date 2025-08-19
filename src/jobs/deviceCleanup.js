const cron = require('node-cron');
const DeviceService = require('../services/deviceService');

const deactivateInactiveDevices = async () => {
  try {
    console.log('Running device cleanup job...');
    
    const result = await DeviceService.deactivateInactiveDevices();
    
    console.log(`Device cleanup completed. Deactivated ${result.modifiedCount} inactive devices`);
  } catch (error) {
    console.error('Error in device cleanup job:', error);
  }
};

// Run every hour
const startDeviceCleanupJob = () => {
  console.log('Scheduling device cleanup job to run every hour...');
  
  cron.schedule('0 * * * *', deactivateInactiveDevices);
  
  // Run once on startup
  deactivateInactiveDevices();
};

module.exports = startDeviceCleanupJob;
