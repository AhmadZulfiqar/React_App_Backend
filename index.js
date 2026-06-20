const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Todo = require('./models/schema');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing req.body

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Database connection error: ", err));

// Sample Test Route
app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is running successfully!');
});
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the Node.js hello Backend!" });
});

// Todo Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: "Error creating todo" });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: "Error updating todo" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;