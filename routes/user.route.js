const express = require("express");
const userRouter = express.Router();
const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ message: "All fields are required: name, email, password." });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    if (!hashedPassword) {
      res.status(500).send({ message: "server error while hashing password" });
    }

    const user = UserModel({ name, email, password: hashedPassword });
    await user.save();

    res
      .status(201)
      .send({ message: "you have been registered successfully", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required." });
    }

    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).send({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.secretKey);

    res
      .status(200)
      .send({ message: "you have logged In sucessfully", user, token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const queries = {};
    if (name) queries.name = name;
    if (email) queries.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 5);
      if (!hashedPassword) {
        return res.status(500).send({
          message:
            "server error while hashing password, Please try again letter",
        });
      }
      queries.password = hashedPassword;
    }
    const update = await UserModel.findByIdAndUpdate({ _id: id }, queries, {
      new: true,
    });
    if (!update) {
      return res.status(404).send({ message: "user not found" });
    }

    res.status(200).send({ message: "user has been updated", user: update });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await UserModel.findByIdAndDelete({ _id: id });
    if (!deleteUser) {
      res.status(404).send({ message: "user not found" });
    }

    res.status(200).send({ message: "user has been deleted", deleteUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = userRouter;
