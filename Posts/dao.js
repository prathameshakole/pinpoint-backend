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