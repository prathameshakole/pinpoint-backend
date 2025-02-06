import mongoose from "mongoose";
import schema from "../schemas/PostSchema.js";
const model = mongoose.model("PostModel", schema);
export default model;