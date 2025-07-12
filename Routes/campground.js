const express = require(`express`);
const router = express.Router();

const catchAsync = require(`../Utils/catchAsync`);

const { isLoggedIn, isAuthor, validateCampground } = require(`../middleware`);
const campgrounds = require(`../Controllers/campgrounds`);

const multer = require(`multer`);
const { storage } = require(`../Cloudinary`);
const upload = multer({ storage });

router
  .route(`/`)
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array(`image`),
    validateCampground,
    catchAsync(campgrounds.makeCamp)
  );

router.get(`/new`, isLoggedIn, campgrounds.renderNewForm);

router
  .route(`/:id`)
  .get(catchAsync(campgrounds.showCamp))
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array(`image`),
    validateCampground,
    catchAsync(campgrounds.editCamp)
  )
  .delete(isLoggedIn, catchAsync(campgrounds.deleteCamp));

router.get(
  `/:id/edit`,
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampForm)
);

module.exports = router;
