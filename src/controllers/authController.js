const AuthService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const user = await AuthService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error.message === 'User already exists with this email') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await AuthService.authenticateUser(email, password);
    const token = AuthService.generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};
