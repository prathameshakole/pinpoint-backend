import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("AdModel", schema);
export default model;