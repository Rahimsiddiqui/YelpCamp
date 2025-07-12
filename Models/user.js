const mongoose = require(`mongoose`);
const passportLocalMongoose = require(`passport-local-mongoose`);
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, `Email Must Not Be Blank...`],
    minlength: [1, `Email Must Contain 1 Or More Than 1 Characters...`],
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model(`User`, userSchema);
