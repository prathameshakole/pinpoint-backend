import * as dao from "./dao.js";
export default function PostRoutes(app) {
    const createPost = async (req, res) => {
        const post = await dao.createPost(req.body);
        res.json(post);
    };
    const deletePost = async (req, res) => {
        const status = await dao.deletePost(req.params.postId);
        res.json(status);

    };
    const findAllPosts = async (req, res) => {
        const posts = await dao.findAllPosts();
        res.json(posts);
    };
    const findPostById = async (req, res) => {
        const post = await dao.findPostById(req.params.postId);
        res.json(post);
    };
    const updatePost = async (req, res) => {
        const { postId } = req.params;
        const status = await dao.updatePost(postId, req.body);
        currentPost = await dao.findPostById(postId);
        res.json(status);
    };
    app.post("/api/posts", createPost);
    app.get("/api/posts", findAllPosts);
    app.get("/api/posts/:postId", findPostById);
    app.put("/api/posts/:postId", updatePost);
    app.delete("/api/posts/:postId", deletePost);
}
