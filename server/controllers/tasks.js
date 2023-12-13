const User = require("../models/User");
const Task = require("../models/Task");

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getTasks: async (req, res) => {
    try {
      // Retrieve access token from request headers or cookies.
      const token = req.headers.authorization || req.cookies.accessToken;
      if (!token) return res.sendStatus(401);
      console.log("Backend token: ", token);

      // Verify and decode access token.
      const decodedToken = jwt.verify(token.split(" ")[1], process.env.ACCESS_TOKEN_SECRET);
      const userEmail = decodedToken.email;
      console.log("Found email", userEmail);

      // Retrieve tasks created by the current user.
      const user = await User.findOne({ email: userEmail });
      const tasks = await Task.find({ user: user.userId });
      console.log("Returned tasks: ", tasks);

      // Returned tasks as JSON.
      res.json(tasks);
    } catch(err) {
      console.error(`Error getting tasks: `, err);
      res.sendStatus(401);
    }
  },
  createTask: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(`User ${userId} created a task.`);
      const { todo } = req.body;

      const task = new Task({
        todo: todo,
        completed: false,
        userId: userId
      });

      await task.save();
      res.status(201).json(task);
    } catch(err) {
      console.error(`Error creating task: `, err);
    }
  }, 
  markTask: async (req, res) => {
    try {
      const taskId = req.params.id;
      const { completed } = req.body;

      // Find task by ID and update `completed` property.
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { completed },
        { new: true }
      );

      console.log("Task updated.");
      res.json(updatedTask);
    } catch(err) {
      console.error("Error marking task: ", err);
    }
  },
  deleteTask: async (req, res) => {
    try {
      await Task.deleteOne({ _id: req.params.id });
      console.log("Task deleted.");
      res.status(200).json({ msg: "Task deleted." });
    } catch(err) {
      console.error(`Error deleting task: `, err);
    }
  }
}
