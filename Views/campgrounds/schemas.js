const baseJoi = require(`joi`);
const sanitizeHtml = require(`sanitize-html`);

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "Input Fields Must Not Contain HTML or JS!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required().trim().escapeHTML(),
  price: Joi.number().required().min(1),
  description: Joi.string().required().trim().escapeHTML(),
  location: Joi.string().required().trim().escapeHTML(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required().min(1).escapeHTML(),
});
