import * as dao from "./dao.js";
import * as userDao from "../Users/dao.js"
export default function PostRoutes(app) {
    const createPost = async (req, res) => {
        delete req.body.user;
        const post = await dao.createPost(req.body);
        res.json(post);
    };
    const deletePost = async (req, res) => {
        const status = await dao.deletePost(req.params.postId);
        res.json(status);

    };
    const findAllPosts = async (req, res) => {
        const page = req.query.page;
        const size = req.query.size;
        const posts = await dao.findAllPosts(page, size);
        const postsWithUsers = await Promise.all(
            posts.map(async (post) => {
                const postUser = await userDao.findUserById(post.userid);
                post["user"] = postUser;
                return post;
            })
        );
        res.json(postsWithUsers);
    };
    const findPostByUser = async (req, res) => {
        const posts = await dao.findPostByUser(req.params.userid);
        res.json(posts)
    }

    const findPostOfFollowing = async (req, res) => {
        const userid = req.params.userid;
        const { following } = await userDao.findUserById(userid);
        const posts = await dao.findPostOfFollowing(following);
        const postsWithUsers = await Promise.all(
            posts.map(async (post) => {
                const postUser = await userDao.findUserById(post.userid);
                post["user"] = postUser;
                return post;
            })
        );
        res.json(postsWithUsers)
    }
    const updatePost = async (req, res) => {
        const { postId } = req.params;
        const status = await dao.updatePost(postId, req.body);
        res.json(status);
    };
    const searchPosts = async (req, res) => {
        const { searchTerm } = req.params;
        const posts = await dao.searchPosts(searchTerm);
        res.status(200).send(posts);
    }
    const getPostById = async (req, res) => {
        const { postId } = req.params;
        const response = await dao.getPostById(postId);
        res.json(response)
    }

    app.get("/api/search/posts/:searchTerm", searchPosts);
    app.post("/api/posts", createPost);
    app.get("/api/posts/trending", findAllPosts);
    app.get("/api/posts/user/:userid", findPostByUser);
    app.get("/api/posts/following/:userid", findPostOfFollowing);
    app.get("/api/posts/:postId", getPostById);
    app.put("/api/posts/:postId", updatePost);
    app.delete("/api/posts/:postId", deletePost);
}
