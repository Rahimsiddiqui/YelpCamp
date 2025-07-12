const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../Utils/catchAsync`);
const reviews = require(`../Controllers/reviews`);

const {
  isLoggedIn,
  isAuthorOfReview,
  validateReview,
} = require(`../middleware`);

router.post(
  `/:id/reviews`,
  isLoggedIn,
  validateReview,
  catchAsync(reviews.makeReview)
);

router.delete(
  `/:id/reviews/:reviewId`,
  isLoggedIn,
  isAuthorOfReview,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
