const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  password_repeat: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  photoUrl: {
    type: String,
    default: "https://i.ibb.co/MGMchh7/925px-Unknown-person.jpg",
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  method: {
    type: String,
    default: "google",
  },
  device: {
    type: String,
    default: "web",
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
