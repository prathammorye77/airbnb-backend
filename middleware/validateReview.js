const Joi = require("joi");

const reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
});

module.exports = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};