const User = require("../models/user.model");
const { hashedPassword } = require("../utils/password.bcrypt");

const registerUserService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).active().lean();
  if (user) {
    const err = new Error("User Already Exists");
    err.statusCode = 400;
    throw err;
  }
  const hashPassword = await hashedPassword(password);

  const newUser = await User.create({
    ...data,
    password: hashPassword,
  });

  return newUser;
};

module.exports = { registerUserService };
