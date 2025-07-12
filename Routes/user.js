const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../Utils/catchAsync`);
const passport = require(`passport`);
const { storeReturnValue } = require(`../middleware`);
const users = require(`../Controllers/users`);
const passConfig = { failureFlash: true, failureRedirect: `/login` };

router
  .route(`/register`)
  .get(catchAsync(users.registerForm))
  .post(catchAsync(users.register));

router
  .route(`/login`)
  .get(catchAsync(users.loginForm))
  .post(
    storeReturnValue,
    passport.authenticate(`local`, passConfig),
    users.login
  );

router.get(`/logout`, users.logout);

module.exports = router;
