const express = require("express");
const server = express();
server.use(express.json());
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5500;

const connection = require("./config/db");

const userRouter = require("./routes/user.route");
server.use("/api/user", userRouter);

const auth = require("./middleware/auth.middleware");
const todoRouter = require("./routes/todo.route");
server.use("/api/todo", auth, todoRouter);

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running on PORT: ${PORT} and db has been connected`);
  } catch (error) {
    console.log(`something went wrong ${error.message}`);
  }
});
