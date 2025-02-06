import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  userid: String, image: String,
  options: {
    1: String, 2: String, 3: String, 4: String, 5: String,
  },
  date: Date,
  reactions: [],
  votes: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  user: {}
},
  { collection: "posts" });
export default postSchema;