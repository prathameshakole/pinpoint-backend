import mongoose from "mongoose";
import schema from "../schemas/AdSchema.js";
const model = mongoose.model("AdModel", schema);
export default model;