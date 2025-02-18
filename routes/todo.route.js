const express = require("express");

const todoRouter = express.Router();

const TodoModel = require("../models/todo.model");

todoRouter.post("/add", async (req, res) => {
  const { title, description, status, priority, dueDate, isDeleted } = req.body;
  const userId = req.user._id;
  try {
    if (!title || !description || !priority || !dueDate) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const addTodo = TodoModel({
      title,
      description,
      status,
      priority,
      dueDate,
      userId,
      isDeleted,
    });

    await addTodo.save();
    res.status(201).send({ message: "new todo has been created", addTodo });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

todoRouter.get("/", async (req, res) => {
  const { _id } = req.user;
  const { priority, status } = req.query;
  try {
    const query = {};
    if (priority) query.priority = priority;
    if (status) query.status = status;
    const todos = await TodoModel.find({
      userId: _id,
      ...query,
      isDeleted: false,
    });
    if (todos <= 0) {
      return res.status(404).send({ message: "todo not found" });
    }

    res.status(200).send({ data: todos });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

todoRouter.put("/update/:id", async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const todo = await TodoModel.findOne({ _id: id, userId });
    if (!todo) {
      return res.status(404).send({ message: "todo not found" });
    }

    const update = await TodoModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!update) {
      return res.status(404).send({ message: "todo not found" });
    }
    res.status(200).send({ message: "todo has been updated", update });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = todoRouter;
