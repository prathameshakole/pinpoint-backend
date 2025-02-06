import * as dao from "../dao/UserDao.js"
import { generateToken, verifyToken, jwtDecode } from "../config/Jwt.js"
import bcrypt from 'bcrypt';

const saltRounds = 10;

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
      delete user.password;
      res.json(user);
    } catch (e) {
      res.status(400).send('invalid userid');
    }
  });

  app.post("/api/users", async (req, res) => {
    const user = req.body;
    if (!isValidEmail(user.email)) {
      res.status(400).send('invalid email');
      return;
    }
    if (user.password.length < 8) {
      res.status(400).send('password not valid');
      return;
    }
    const existingUser = await dao.findUserByUsername(user.username);
    if (existingUser) {
      res.status(400).send("Username already exists");
      return;
    }
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      const newUser = await dao.createUser({
        ...user,
        password: hashedPassword
      });
      res.json(newUser);
    } catch (e) {
      res.status(400).send('invalid data');
    }
  });

  app.put("/api/users/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    if (!isValidEmail(user.email)) {
      res.status(400).send('invalid email');
      return;
    }
    const existingUser = await dao.findUserById(id);
    if (existingUser && existingUser._id != id) {
      res.status(400).send("Username already taken");
      return;
    }
    try {
      await dao.updateUser(id, user);
      const updatedUser = await dao.findUserById(id);
      const token = generateToken(updatedUser);
      res.status(200).send({ token });
    } catch (e) {
      res.status(400).send("error in updating user, try again")
    }
  });

  app.put("/api/users/password/:id", verifyToken, async (req, res) => {
    const id = req.user.userId;
    const password = req.body.password;
    if (password.length < 8) {
      res.status(400).send('password not valid');
      return;
    }
    var existingUser = await dao.findUserById(id);
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      existingUser.password = hashedPassword;
      await dao.updateUser(id, existingUser);
      res.status(200).send('success');
    } catch (e) {
      res.status(400).send('invalid data');
    }
  });

  app.delete("/api/users/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const status = await dao.deleteUser(id);
    res.send(status);
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
    const existingUser = await dao.findUserByUsername(credentials.username);
    if (!existingUser) {
      res.status(401).send("Invalid credentials");
      return
    }
    const success = await bcrypt.compare(credentials.password, existingUser.password);
    if (!success) {
      res.status(401).send("Invalid credentials");
      return
    }
    const token = generateToken(existingUser);
    res.json({ token });
  });

  app.post("/api/users/follow/:followerId/:followingId/:follow", verifyToken, async (req, res) => {
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

  app.get("/api/users/suggested/:userid", verifyToken, async (req, res) => {
    const id = req.params.userid;
    const suggestedUsers = await dao.findSuggestedUsers(id);
    res.send(suggestedUsers);
  });
}

