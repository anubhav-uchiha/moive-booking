const Theater = require("../models/theater.model");

// ✅ CREATE THEATER
const createTheater = async (req, res, next) => {
  try {
    const { name, state, city, address } = req.body;

    const theater = await Theater.create({
      owner_id: req.user.id,
      name,
      state,
      city,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Theater created successfully",
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET MY THEATERS
const getMyTheaters = async (req, res, next) => {
  try {
    const theaters = await Theater.find({
      owner_id: req.user.id,
      is_deleted: false,
    });

    res.json({
      success: true,
      data: theaters,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE THEATER (OWNER ONLY)
const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findOneAndUpdate(
      {
        _id: req.params.id,
        owner_id: req.user.id,
        is_deleted: false,
      },
      req.body,
      { new: true, runValidators: true },
    );

    if (!theater) {
      const err = new Error("Theater not found or unauthorized");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      message: "Theater updated",
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE THEATER (SOFT DELETE)
const deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findOneAndUpdate(
      {
        _id: req.params.id,
        owner_id: req.user.id,
      },
      {
        is_deleted: true,
        is_active: false,
      },
      { new: true },
    );

    if (!theater) {
      const err = new Error("Theater not found or unauthorized");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      message: "Theater deleted",
    });
  } catch (error) {
    next(error);
  }
};

// 🌍 PUBLIC: GET THEATERS BY LOCATION
const getTheaters = async (req, res, next) => {
  try {
    const { state, city } = req.query;

    const filter = {
      is_deleted: false,
      is_active: true,
    };

    if (state) filter.state = state;
    if (city) filter.city = city;

    const theaters = await Theater.find(filter);

    res.json({
      success: true,
      data: theaters,
    });
  } catch (error) {
    next(error);
  }
};

// 🌍 PUBLIC: GET SINGLE THEATER
const getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findOne({
      _id: req.params.id,
      is_deleted: false,
    });

    if (!theater) {
      const err = new Error("Theater not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({
      success: true,
      data: theater,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTheater,
  getMyTheaters,
  updateTheater,
  deleteTheater,
  getTheaters,
  getTheaterById,
};
