import * as dao from "./dao.js";
import { generateToken, verifyToken, jwtDecode } from "../Jwt.js"

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

export default function UsersRoutes(app) {
  app.get("/api/users", verifyToken, async (req, res) => {
    const { role } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const user = await dao.findUserById(id);
      res.json(user);
    } catch (e) {
      res.status(400).send('invalid userid');
    }
  });

  app.post("/api/users", async (req, res) => {
    const user = req.body;
    if (!isValidEmail(user.email)) {
      res.status(400).send('invalid email');
      return
    }
    if (user.password.length < 8) {
      res.status(400).send('password not valid');
      return
    }
    const existingUser = await dao.findUserByUsername(user.username);
    if (existingUser) {
      res.status(400).send("Username already exists");
      return;
    }
    try {
      const newUser = await dao.createUser(user);
      res.json(newUser);
    } catch (e) {
      res.status(400).send('invalid data');
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    await dao.updateUser(id, user);
    res.status(200).send("success");
  });

  app.delete("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    const status = await dao.deleteUser(id);
    res.send(status);
  });

  app.post("/api/users/register", async (req, res) => {
    const user = req.body;
    if (!isValidEmail(user.email)) {
      res.status(400).send('invalid email');
      return
    }
    if (user.password.length < 8) {
      res.status(400).send('password not valid');
      return
    }
    if (user.username.length < 4) {
      res.status(400).send('username too short');
      return
    }
    const existingUser = await dao.findUserByUsername(user.username);
    if (existingUser) {
      res.status(400).send("Username already exists");
      return;
    }
    try {
      const newUser = await dao.createUser(user);
      const token = generateToken(newUser);
      res.json({ token });
    } catch (e) {
      res.status(400).send('invalid data');
    }
  });

  app.post("/api/users/profile", verifyToken, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwtDecode(token)
    const user = await dao.findUserByUsername(decoded.username)
    if (user == null) {
      res.sendStatus(401);
    } else {
      res.send(user)
    }
  });

  app.post("/api/users/signin", async (req, res) => {
    const credentials = req.body;
    const existingUser = await dao.findUserByCredentials(
      credentials.username,
      credentials.password
    );
    if (existingUser) {
      const token = generateToken(existingUser);
      res.json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });

  app.post("/api/users/follow/:followerId/:followingId/:follow", async (req, res) => {
    const { followerId, followingId, follow } = req.params;
    var follower = await dao.findUserById(followerId);
    var following = await dao.findUserById(followingId);
    if (follow == 'true') {
      follower.following = [...follower.following, followingId];
    } else {
      follower.following = follower.following.filter((userid) => userid != followingId)
    }
    await dao.updateUser(followerId, follower);
    var following = await dao.findUserById(followingId);
    if (follow == 'true') {
      following.follower = [...following.follower, followerId];
    } else {
      following.follower = following.follower.filter((userid) => userid != followerId)
    }
    await dao.updateUser(followingId, following);
    res.status(200).send('success');
  });

  app.post("/api/users/fromList", async (req, res) => {
    const userids = req.body;
    const users = await dao.findUsers(userids);
    res.status(200).send(users);
  });

  app.get("/api/search/users/:searchTerm", async (req, res) => {
    const { searchTerm } = req.params;
    const users = await dao.searchUsers(searchTerm);
    res.status(200).send(users);
  });

  app.get("/api/users/suggested", verifyToken, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwtDecode(token);
    const currentUserId = decoded.userId;
    const suggestedUsers = await dao.findSuggestedUsers(currentUserId);
    res.send(suggestedUsers);
  });
}

