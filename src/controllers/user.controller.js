const User = require("../models/user.model");

// 👤 GET PROFILE
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

// 👤 UPDATE PROFILE
const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { first_name, last_name },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 🔐 CHANGE PASSWORD
const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(old_password);

    if (!isMatch) {
      const err = new Error("Old password is incorrect");
      err.statusCode = 400;
      throw err;
    }

    user.password = new_password; // will auto-hash via pre-save
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ❌ SOFT DELETE ACCOUNT
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      is_deleted: true,
      is_active: false,
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// 🛡️ ADMIN: GET ALL USERS
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// 🛡️ ADMIN: GET SINGLE USER
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 🛡️ ADMIN: UPDATE USER STATUS
const updateUserStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active },
      { new: true },
    );

    res.json({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// 🛡️ ADMIN: DELETE USER
const deleteUserByAdmin = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
      is_active: false,
    });

    res.json({
      success: true,
      message: "User deleted by admin",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUserByAdmin,
};
