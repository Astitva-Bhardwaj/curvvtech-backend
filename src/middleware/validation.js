const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
      }),
    role: Joi.string().valid('user', 'admin').default('user')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  device: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('light', 'fan', 'thermostat', 'camera', 'smart_meter', 'other').required(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').default('active')
  }),

  deviceUpdate: Joi.object({
    name: Joi.string().min(2).max(100),
    type: Joi.string().valid('light', 'fan', 'thermostat', 'camera', 'smart_meter', 'other'),
    status: Joi.string().valid('active', 'inactive', 'maintenance')
  }).min(1),

  heartbeat: Joi.object({
    status: Joi.string().valid('active', 'inactive', 'maintenance').required()
  }),

  deviceLog: Joi.object({
    event: Joi.string().valid('units_consumed', 'status_change', 'temperature_reading', 'motion_detected', 'other').required(),
    value: Joi.number().required()
  })
};

module.exports = { validate, schemas };
