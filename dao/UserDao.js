import mongoose from "mongoose";
import userModel from "../models/UserModel.js";

export const findAllUsers = () => userModel.find();

export const findUsersByRole = (role) => userModel.find({ role: role });

export const findUserById = (id) => userModel.findById(id);

export const findUserByEmail = (email) => userModel.findOne({ email });

export const findUserByUsername = (username) => userModel.findOne({ username });

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

export const findSuggestedUsers = async (currentUserId) => {
    const currentUser = await userModel.findById(currentUserId);
    const followingList = [...currentUser.following, currentUserId].map(e => new mongoose.Types.ObjectId(e));
    const query = [
        { $match: { _id: { $nin: followingList } } },
        { $sample: { size: 3 } }
    ];

    const suggestedUsers = await userModel.aggregate(query).catch(err => []);
    return suggestedUsers;
};


export const searchUsers = async (searchTerm) => {
    const query = {
        $or: [
            { username: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { firstName: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { lastName: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } }
        ]
    }
    return await userModel.find(query).limit(10)
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}

