import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userid: String, image: Buffer,
  options: {
    1: String, 2: String, 3: String, 4: String,
  },
  date: Date,
  reactions: [{
    userid: String, reaction: String
  }]
},
  { collection: "posts" });
export default userSchema;