const mongoose = require(`mongoose`);
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
    minlength: [0, `Feedback Must Be Longer Than 0 Characters...`],
  },
  rating: {
    type: Number,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: `User`,
  },
});

module.exports = mongoose.model(`Review`, reviewSchema);
