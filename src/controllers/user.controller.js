const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invaid User");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ userId })
      .active()
      .select("-password")
      .lean();

    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      message: "User detail",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invaid User");
      error.statusCode = 400;
      return next(error);
    }

    const updateAllowed = ["first_name", "last_name", "email"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (updateAllowed.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invaid User");
      error.statusCode = 400;
      return next(error);
    }

    let { old_password, new_password, confirm_password } = req.body;

    old_password = old_password?.trim();
    new_password = new_password?.trim();
    confirm_password = confirm_password?.trim();

    if (!old_password || !new_password || !confirm_password) {
      const error = new Error("All Filed Required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ userId })
      .active()
      .select("+password")
      .lean();

    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      return next(error);
    }

    if (new_password !== confirm_password) {
      const error = new Error(
        "new password and confirm ppassword did not match",
      );
      error.statusCode = 400;
      return next(error);
    }

    if (
      !validator.isStrongPassword(new_password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
    ) {
      const error = new Error(
        "new password must be min 8 charater and have atleat 1 uppercase, 1 lowercase, 1 number, 1symbol ",
      );
      error.statusCode = 400;
      return next(error);
    }

    if (old_password === new_password) {
      const error = new Error("old password and new passwrod is same");
      error.statusCode = 400;
      return next(error);
    }

    const isMatch = await user.comparePassword(old_password);

    if (!isMatch) {
      const err = new Error("Old password is incorrect");
      err.statusCode = 400;
      throw err;
    }

    user.password = new_password;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invaid User");
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findByIdAndUpdate(userId, {
      is_deleted: true,
      is_active: false,
    });

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      message: "Account soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find().select("-password");

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userparamId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invaid User");
      error.statusCode = 400;
      return next(error);
    }

    const { is_active } = req.body;

    const user = await User.findByIdAndUpdate(
      userparamId,
      { is_active },
      { new: true },
    );

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.json({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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
  softDeleteAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUserByAdmin,
};
