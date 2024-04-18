import model from "./model.js";
export const createPost = (post) => {
    delete post._id
    return model.create(post);
}
export const findAllPosts = () => model.find();
export const findPostByUser = (userid) => model.find({userid: userid});
export const updatePost = (postId, post) => model.updateOne({ _id: postId }, { $set: post });
export const deletePost = (postId) => model.deleteOne({ _id: postId });