const express = require(`express`);
const mongoose = require(`mongoose`);
const path = require(`path`);

const flash = require(`connect-flash`);
const session = require(`express-session`);
const methodOverride = require(`method-override`);
const ejsMate = require(`ejs-mate`);
const helmet = require(`helmet`);

const ExpressError = require(`../Utils/ExpressError`);

const campgroundRouter = require(`../Routes/campground`);
const reviewRouter = require(`../Routes/reviews`);
const userRouter = require(`../Routes/user`);

const User = require(`../Models/user`);

const passport = require(`passport`);
const localStrategy = require(`passport-local`);
const ExpressMongoSanitize = require("express-mongo-sanitize");
const dbUrl = process.env.DB_URL;

const MongoDBStore = require(`connect-mongo`)(session);

const store = new MongoDBStore({
  url: "mongodb://127.0.0.1:27017/yelp-camp",
  secret: `thisisasecretofmuhammedrahimsiddiqui`,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  secret: `mysecret`,
  name: `Session`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com",
  "https://api.maptiler.com",
  "https://unpkg.com",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com",
  "https://api.maptiler.com",
  "https://unpkg.com",
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com",
  "https://cdn.maptiler.com",
  "https://unpkg.com",
];

const fontSrcUrls = ["https://cdn.jsdelivr.net", "https://fonts.gstatic.com"];

const app = express();

module.exports = {
  express,
  mongoose,
  path,
  flash,
  session,
  methodOverride,
  ejsMate,
  helmet,
  ExpressError,
  campgroundRouter,
  reviewRouter,
  userRouter,
  User,
  passport,
  localStrategy,
  ExpressMongoSanitize,
  app,
  sessionConfig,
  scriptSrcUrls,
  styleSrcUrls,
  connectSrcUrls,
  fontSrcUrls,
  dbUrl,
  MongoDBStore,
  store,
};
