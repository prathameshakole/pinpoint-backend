import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  _id : {type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  image: Image,
  location : {
    longitude: Number,
    latitude: Number,
  },
  date: Date,
  reactions : {
    username: { type: String, required: true, unique: true },
    reaction: String
  }
},
  { collection: "users" });
export default userSchema;