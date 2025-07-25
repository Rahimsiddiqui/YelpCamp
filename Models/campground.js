const mongoose = require(`mongoose`);
const Review = require(`./review`);
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: [`Point`],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: `User`,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: `Review`,
    },
  ],
});

campgroundSchema.post(`findOneAndDelete`, async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model(`Campground`, campgroundSchema);
