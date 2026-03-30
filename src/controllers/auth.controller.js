const validator = require("validator");
const User = require("../models/user.model");
const {
  hashedPassword,
  comparedPassword,
} = require("../utils/password.bcrypt");
const generateToken = require("../utils/generate.token");
const generateRefreshToken = require("../utils/generate.refresh.token");
const hashToken = require("../utils/hask.token");

const registerUser = async (req, res, next) => {
  try {
    let { first_name, last_name, email, password } = req.body;

    first_name = first_name?.trim();
    last_name = last_name?.trim();
    email = email?.trim()?.toLowerCase();
    password = password?.trim();

    if (!first_name || !last_name || !email || !password) {
      const error = new Error("All field Required");
      error.statusCode = 400;
      return next(error);
    }

    if (!validator.isEmail(email)) {
      const error = new Error("invalid email");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.is_deleted) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    if (
      validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      const error = new Error(
        "password is not Strong: required atleaast 1 lowecase, 1 uppercase, 1 number, 1 symbol and minimum 8 character length",
      );
      error.statusCode = 400;
      return next(error);
    }

    const passwordHashed = await hashedPassword(password);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: passwordHashed,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: last_name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email?.trim()?.toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      const error = new Error("All field Required");
      error.statusCode = 400;
      return next(error);
    }

    if (!validator.isEmail(emailTrim)) {
      const error = new Error("Invalid email");
      error.status = 400;
      return next(error);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.is_deleted || !user.is_active) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      return next(error);
    }

    const isMatch = await comparedPassword(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      return next(error);
    }

    const token = generateToken({
      id: user._id,
      is_deleted: false,
      is_active: true,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      is_deleted: false,
      is_active: true,
    });

    const hashedToken = hashToken(refreshToken);

    user.refreshToken = hashedToken;
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await user.save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: token,
        refreshToken: refreshToken,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: last_name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error("Refresh token required");
      error.status = 401;
      return next(error);
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const hashedToken = hashToken(refreshToken);

    const user = await User.findOne({
      _id: decoded._id,
      refreshToken: hashedToken,
      refreshTokenExpiry: { $gt: new Date() },
      is_deleted: false,
    }).select("+refreshToken +refreshTokenExpiry");

    if (!user || user.refreshToken !== hashedToken) {
      const error = new Error("Invalid refresh token");
      error.status = 403;
      return next(error);
    }

    if (user.refreshTokenExpiry < Date.now()) {
      const error = new Error("Refresh token expired");
      error.status = 403;
      return next(error);
    }

    const newRefreshToken = generateRefreshToken({ _id: user._id });
    user.refreshToken = hashToken(newRefreshToken);
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await user.save();

    const newToken = generateToken({
      _id: user._id,
      isAdmin: user.isAdmin,
    });
    return res.status(200).json({
      success: true,
      accessToken: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
