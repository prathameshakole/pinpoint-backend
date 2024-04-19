import mongoose from "mongoose";
const adSchema = new mongoose.Schema({
  userid: String, image: String,
  title: String,
  description: String,
  image: String,
  totalImpressions: Number,
  date: Date,
  approved: Boolean
},
  { collection: "ads" });
export default adSchema;