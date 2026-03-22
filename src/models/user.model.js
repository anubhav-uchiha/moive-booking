const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true, minlength: 2 },
    last_name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 8,
    },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1, is_deleted: 1 }, { unique: true });

userSchema.query.active = function () {
  return this.where({ is_deleted: false, is_active: true });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
