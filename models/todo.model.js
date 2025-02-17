const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: [
      "urgent_important",
      "important_not_urgent",
      "urgent_not_important",
      "neither",
    ],
    default: "urgent_important",
  },
  dueDate: {
    type: Date,
    required: false,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});


const TodoModel = mongoose.model("todo", todoSchema);
module.exports = TodoModel;
