const Campground = require(`../Models/campground`);
const Review = require(`../Models/review`);

module.exports.makeReview = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  if (!foundCamp) {
    req.flash(`error`, `Camp Not Found`);
    return res.redirect(`/campgrounds`);
  }

  const { body, rating } = req.body;

  if (rating === 0) {
    req.flash(`error`, `Rating Must Be Greater Than 0!`);
    return res.redirect(`/campgrounds/${foundCamp._id}`);
  }
  const newReview = new Review({
    body,
    rating,
    author: req.user._id,
  });
  await newReview.save();

  foundCamp.reviews.push(newReview);
  await foundCamp.save();

  req.flash(`success`, `Review Successfully Made`);
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId, id } = req.params;

  if (!id || !reviewId) {
    req.flash(`error`, `Review Couldn't Be Deleted`);
    return res.redirect(`/campgrounds`);
  }

  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash(`success`, `Review Successfully Deleted`);
  res.redirect(`/campgrounds/${id}`);
};
