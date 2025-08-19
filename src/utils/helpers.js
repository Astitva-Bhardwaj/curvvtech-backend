const crypto = require('crypto');

class Helpers {
  // Generate random string
  static generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Format date to ISO string
  static formatDate(date) {
    return new Date(date).toISOString();
  }

  // Validate ObjectId
  static isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  // Sanitize user input
  static sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.trim().replace(/[<>]/g, '');
    }
    return input;
  }

  // Calculate time range
  static getTimeRange(range) {
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
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    return { startTime, endTime: now };
  }

  // Response formatter
  static formatResponse(success, data = null, message = '', errors = null) {
    const response = { success };
    
    if (message) response.message = message;
    if (data) response.data = data;
    if (errors) response.errors = errors;
    
    return response;
  }

  // Pagination helper
  static getPaginationData(page, limit, total) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    return {
      page: currentPage,
      limit: itemsPerPage,
      total,
      totalPages,
      skip,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }
}

module.exports = Helpers;
