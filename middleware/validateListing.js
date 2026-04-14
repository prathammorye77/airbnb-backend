const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};