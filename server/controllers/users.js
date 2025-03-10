require("express-async-errors");
const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('entries', {author: 1, description: 1, audio: 1});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const allUsers = await User.find({});
  const usernames = allUsers.map((user) => user.username);

  if (!username || username.length < 3 || usernames.includes(username)) {
    response.status(400).json({
      error:
        "Invalid user details: Username must be unique and at least 3 characters",
    });
    return;
  }
  if (!password || password.length < 3) {
    response.status(400).json({
      error: "Invalid user details: Password must be at least 3 characters",
    });
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    admin: false,
    entries: []
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.post("/:username/makeadmin", async (request, response) => {
  const { username } = request.params;
  const user = request.user; //The executing user is verified to be a real user in middleware. For fake users is set to null

  if (!(user && user.admin)) {
    console.log("Wrong user credentials on admin promotion");
    return response.status(401).json({ error: "invalid username or password" });
  }

  const updatedUser = await User.findOneAndUpdate(
    { username },
    { admin: true },
    { new: true }
  );

  console.log(`Returning ${JSON.stringify(updatedUser)}`);

  response.json(updatedUser);
});

usersRouter.delete("/:username", async (request, response) => {
  const { username } = request.params;
  const user = request.user;

  if (!(user && user.admin)) {
    return response.status(401).json({ error: "Unauthorized to delete user" });
  }
  if (user?.username === username) {
    return response
      .status(401)
      .json({ error: "Can't delete the executing user" });
  }

  const userToDelete = await User.find({ username });
  if (!userToDelete) {
    console.log("User not found");
    response.status(400).json({ error: "User not found" });
  } else {
    await User.findOneAndDelete({ username });
    response.status(204).end();
  }
});

module.exports = usersRouter;
