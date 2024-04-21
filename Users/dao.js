import mongoose from "mongoose";
import userModel from "./model.js";

export const findAllUsers = () => userModel.find();

export const findUsersByRole = (role) => userModel.find({ role: role });

export const findUserById = (id) => userModel.findById(id);

export const findUserByEmail = (email) => userModel.findOne({ email });

export const findUserByUsername = (username) => userModel.findOne({ username });

export const findUserByCredentials = (username, password) =>
    userModel.findOne({ username, password });

export const createUser = (user) => {
    user._id = new mongoose.Types.ObjectId()
    return userModel.create(user)
};

export const updateUser = (id, user) =>
    userModel.updateOne({ _id: id }, { $set: user });

export const deleteUser = (id) => userModel.deleteOne({ _id: id });

export const findUsers = async (userids) => {
    const query = { _id: { $in: userids } };
    return await userModel.find(query)
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}