const mongoose = require(`mongoose`);
const cities = require(`./cities`);
const { places, descriptors } = require(`./seedHelpers`);
const Campground = require(`../Models/campground`);

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log(`Connection Open... (Mongo)`);
  })
  .catch((e) => {
    console.log(`An Error Occurred: ${e}`);
  });

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 250; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: `68641455bd5166d097739f4b`,
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand].city}, ${cities[rand].state}`,
      geometry: {
        type: `Point`,
        coordinates: [cities[rand].longitude, cities[rand].latitude],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dz5gqnsdg/image/upload/v1751708924/Yelpcamp/cdfnjqmfgw7eisztudli.jpg",
          filename: "Yelpcamp/cdfnjqmfgw7eisztudli",
        },
        {
          url: "https://res.cloudinary.com/dz5gqnsdg/image/upload/v1751709100/Yelpcamp/sixlxn0yados80twzkrs.jpg",
          filename: "Yelpcamp/sixlxn0yados80twzkrs",
        },
      ],
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate assumenda optio iusto soluta nemo cumque minima. Ad asperiores modi itaque eaque quaerat laudantium? Sed possimus amet modi quibusdam atque ab.
Quia officiis ea deserunt magnam at eum cumque ex, ullam explicabo, ducimus dicta iste. Reiciendis, accusamus dicta ullam expedita unde illum cumque velit quia inventore ab quidem, vitae a commodi?`,
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  console.log(`Connection Successfully Closed... (Mongo)`);
  mongoose.connection.close();
});
