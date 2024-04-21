import model from "./model.js";
export const createPost = (post) => {
    delete post._id
    return model.create(post);
}
export const findAllPosts = () => model.find().sort({date: -1});
export const findPostByUser = (userid) => model.find({ userid: userid }).sort({date: -1});
export const updatePost = (postId, post) => model.updateOne({ _id: postId }, { $set: post });
export const deletePost = (postId) => model.deleteOne({ _id: postId });
export const findPostOfFollowing = async (userids) => {
    const query = { userid: { $in: userids } };
    return await model.find(query).sort({date: -1})
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}
export const searchPosts = async (searchTerm) => {
    const query = {
        $or: [
            { 1: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 2: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 3: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 4: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } },
            { 5: { $regex: new RegExp(`.*${searchTerm}.*`, 'i') } }
        ]
    }
    return await model.find(query)
        .then(docs => {
            return docs
        })
        .catch(err => {
            return []
        });
}