const express = require("express");
const router = express.Router();
const passport = require("passport");
const tasksController = require("../controllers/tasks");

// Tasks Routes
router.get("/", passport.authenticate("jwt", { session: false }), tasksController.getTasks);
router.post("/createTask", passport.authenticate("jwt", { session: false }), tasksController.createTask);
router.patch("/markTask/:id", passport.authenticate("jwt", { session: false }), tasksController.markTask);
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), tasksController.deleteTask);

module.exports = router;
