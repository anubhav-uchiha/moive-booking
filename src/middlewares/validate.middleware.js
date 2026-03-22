const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    err.details = error.details.map((e) => e.message);
    return next(err);
  }
  req.body = value;
  next();
};

module.exports = validate;
