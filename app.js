require(`dotenv`).config();

const {
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
} = require(`./Views/dependices`);

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp" /* {tls: true} */)
  .then(() => {
    console.log(`Connection Open... (Mongo)`);
  })
  .catch((e) => {
    console.log(`An Error Occurred: ${e}`);
  });

app.set(`views`, path.join(__dirname, `Views`));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(`_method`));
app.engine(`ejs`, ejsMate);
app.set(`view engine`, `ejs`);
app.use(express.static(path.join(__dirname, `Public`)));

app.use(ExpressMongoSanitize());

store.on(`error`, (e) => {
  console.log(`An Error Occurred: ${e}`);
});

app.use(session(sessionConfig));
app.use(flash());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      fontSrc: ["'self'", ...fontSrcUrls],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com",
        "https://images.unsplash.com",
        "https://cdn.maptiler.com",
        "https://api.maptiler.com",
      ],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash(`success`);
  res.locals.error = req.flash(`error`);
  next();
});

app.use(`/campgrounds`, campgroundRouter);
app.use(`/campgrounds`, reviewRouter);
app.use(`/`, userRouter);

app.get(`/`, (req, res) => {
  res.render(`home`);
});

app.all(/^.*$/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render(`./Errors/error`, { err });
});

app.listen(3000, () => {
  console.log(`Server Started... (Express)`);
});
