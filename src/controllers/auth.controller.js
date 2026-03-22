const { registerUserService } = require("../services/auth.service");

const registerUser = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
};
