const User = require(`../Models/user`);

module.exports.registerForm = async (req, res) => {
  if (req.isAuthenticated()) {
    req.flash(`success`, `You Are Already Logged In!`);
    return res.redirect(`/campgrounds`);
  }
  res.render(`Users/register`);
};

module.exports.register = async (req, res) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      req.flash("error", "All fields are required!");
      return res.redirect("/register");
    }

    if (password.length < 8) {
      req.flash("error", "Password Must Be At Least 8 Characters!");
      return res.redirect("/register");
    } else if (password.length >= 24) {
      req.flash(`error`, `Password Must Be Less Than 24 Characters!`);
      return res.redirect(`/register`);
    }

    if (password !== confirmPassword) {
      req.flash(`error`, `Passwords Must Match!`);
      return res.redirect(`/register`);
    }

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, function (err) {
      if (err) {
        req.flash(`error`, err.message);
        return res.redirect(`/register`);
      }
      req.flash(`success`, `Welcome To Yelpcamp!`);
      res.redirect(`/campgrounds`);
    });
  } catch (e) {
    req.flash(`error`, e.message);
    res.redirect(`/register`);
  }
};

module.exports.loginForm = async (req, res) => {
  const foundUser = await User.exists({});
  if (!foundUser) {
    req.flash(`error`, `You Must First Register!`);
    res.redirect(`/register`);
  } else {
    res.render(`Users/login`);
  }
};

module.exports.login = (req, res) => {
  req.flash(`success`, `Welcome Back!`);
  const redirectUrl = res.locals.returnTo || `/campgrounds`;
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash(`error`, `You Must Be Logged In Before You Can Log Out!`);
    return res.redirect(`/login`);
  }
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash(`success`, `Successfully Logged Out!`);
    res.redirect(`/campgrounds`);
  });
};
