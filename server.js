const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const logger = require("morgan");
const path = require("path");
const connectDB = require("./config/database");

require("dotenv").config({ path: "./config/.env"});
require("./config/passport")(passport);

connectDB();

const homeRoutes = require("./routes/home");
const taskRoutes = require("./routes/tasks");

app.use(cors({ credentials: true, origin: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));

app.use(
  session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
          mongoUrl: process.env.DB_STRING
      })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeRoutes);
app.use("/tasks", taskRoutes);

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", function(_, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"), function(err) {
    res.status(500).send(err);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});
