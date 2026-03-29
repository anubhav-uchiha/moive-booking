const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

// ✅ REGISTER
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    // Prevent role abuse
    const allowedRoles = ["user", "theater_owner"];

    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.is_deleted) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // auto hashed via pre-save
      role: allowedRoles.includes(role) ? role : "user",
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.is_deleted || !user.is_active) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      throw err;
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET PROFILE (AUTH BASED)
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ LOGOUT (CLIENT SIDE TOKEN REMOVE)
const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout successful (remove token on client)",
  });
};

// ✅ REFRESH TOKEN (BASIC VERSION)
const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  refreshToken,
};
