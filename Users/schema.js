import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: String,
    image: String,
    bio: String,
    dob: Date,
    role: {
      type: String,
      default: "STUDENT",
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
    },
    following: [],
    follower: []
  },
  {
    collection: "users",
  }
);

export default userSchema;