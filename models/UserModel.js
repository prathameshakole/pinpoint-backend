import mongoose from "mongoose";
import schema from "../schemas/UserSchema.js";
const model = mongoose.model("UserModel", schema);
export default model;