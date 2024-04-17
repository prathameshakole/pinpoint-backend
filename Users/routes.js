import * as dao from "./dao.js";
import { generateToken, verifyToken, jwtDecode } from "../Jwt.js"

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
    const user = await dao.findUserById(id);
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    const user = req.body;
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
}