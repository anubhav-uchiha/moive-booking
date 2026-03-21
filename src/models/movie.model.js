const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    movie_name: { type: String, required: true },
    movie_description: { type: String, required: true },
    movie_casts: { type: [String], required: true },
    trailer_url: { type: String, required: true },
    language: { type: [String], required: true },
    release_date: { type: String, required: true },
    movie_director: { type: String, required: true },
    release_status: {
      type: String,
      required: true,
      enum: ["REALSED", "ONLINE RELESED", "COMING SOON"],
    },
    movie_category: { type: [mongoose.Schema.Types.ObjectId], required: true },
    movie_certificate: { type: String, required: true, enum: ["PG-13", "18+"] },
    movie_runtime: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
