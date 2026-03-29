const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔍 Fast search
theaterSchema.index({ state: 1, city: 1 });

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
