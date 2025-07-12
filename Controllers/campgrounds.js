const Campground = require(`../Models/campground`);
const { cloudinary } = require(`../Cloudinary/index`);
const axios = require("axios");

const maptilerToken = process.env.MAPTILER_TOKEN;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render(`campgrounds/index`, { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render(`campgrounds/new`);
};

module.exports.showCamp = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!foundCamp) {
    req.flash(`error`, `Camp Not Found`);
    return res.redirect(`/campgrounds`);
  }
  res.render(`campgrounds/show`, { foundCamp });
};

module.exports.editCampForm = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id).lean();
  if (!foundCamp) {
    req.flash(`error`, `Camp Not Found`);
    return res.redirect(`/campgrounds`);
  }
  res.render(`campgrounds/edit`, { foundCamp });
};

module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  if (!foundCamp) {
    req.flash(`error`, `Camp Not Found`);
    return res.redirect(`/campgrounds`);
  }
  const { title, price, description, location } = req.body;
  const updatedCampground = await Campground.findByIdAndUpdate(
    id,
    {
      title,
      price,
      description,
      location,
    },
    { new: true }
  );

  if (req.files && req.files.length > 0) {
    updatedCampground.image.push(
      ...req.files.map((f) => ({ url: f.path, filename: f.filename }))
    );
  }

  await updatedCampground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCampground.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash(`success`, `Campground Successfully Edited!`);
  res.redirect(`/campgrounds/${id}`);
};

module.exports.makeCamp = async (req, res) => {
  let locationOfPlace = req.body.location.trim();
  locationOfPlace = locationOfPlace.toLowerCase();

  let geoData;
  try {
    const geoResponse = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(
        `${locationOfPlace}`
      )}.json?key=${maptilerToken}`
    );
    geoData = geoResponse.data;
  } catch (e) {
    console.error("MapTiler geocoding failed: ", e.message);
  }

  const geoDataOfCoordinates = geoData.features[0].geometry;

  const { title, price, description, location } = req.body;
  const newCampground = await Campground.create({
    title,
    price,
    description,
    location,
    image: req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    })),
    author: req.user._id,
    geometry: geoDataOfCoordinates,
  });
  req.flash(`success`, `Campground Successfully Made!`);
  return res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  if (!foundCamp) {
    req.flash(`error`, `Campground Could Not Be Deleted! (Id Was Invalid)`);
    return res.redirect(`/campgrounds`);
  }
  if (
    !foundCamp.author ||
    String(foundCamp.author._id) !== String(req.user._id)
  ) {
    req.flash(`error`, `You Do Not Have Permission To Delete This Campground!`);
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findOneAndDelete({ _id: id });
  req.flash(`success`, `Campground Successfully Deleted!`);
  res.redirect(`/campgrounds`);
};
