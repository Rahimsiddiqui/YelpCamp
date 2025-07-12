const Campground = require(`./Models/campground`);
const { campgroundSchema } = require(`./Views/campgrounds/schemas`);
const ExpressError = require(`./Utils/ExpressError`);
const Review = require("./Models/review");
const { reviewSchema } = require(`./Views/campgrounds/schemas`);

const isLoggedIn = (req, res, next) => {
  const trueORfalse = req.isAuthenticated();
  if (!trueORfalse) {
    req.session.returnTo = req.originalUrl;
    req.flash(`error`, `You Must Be Logged In!`);
    return res.redirect(`/login`);
  } else {
    next();
  }
};

const storeReturnValue = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  if (!foundCamp) {
    req.flash(`error`, `Camp Not Found`);
    return res.redirect(`/campgrounds`);
  }
  if (
    !foundCamp.author ||
    String(foundCamp.author._id) !== String(req.user._id)
  ) {
    req.flash(`error`, `You Do Not Have Permission!`);
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isAuthorOfReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundReview = await Review.findById(reviewId);
  if (!foundReview) {
    req.flash(`error`, `Review Not Found`);
    return res.redirect(`/campgrounds/${id}`);
  }
  if (
    !foundReview.author ||
    String(foundReview.author._id) !== String(req.user._id)
  ) {
    req.flash(`error`, `You Do Not Have Permission!`);
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(`, `);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(`, `);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  storeReturnValue,
  isAuthor,
  isAuthorOfReview,
  validateCampground,
  validateReview,
};
