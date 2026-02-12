import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task-controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const taskRouter = express.Router();

// Task CRUD routes
taskRouter.post("/", isAuthenticated, createTask);
taskRouter.get("/", isAuthenticated, getTasks);


taskRouter.get("/:id", isAuthenticated, getTask);
taskRouter.put("/:id", isAuthenticated, updateTask);
taskRouter.delete("/:id", isAuthenticated, deleteTask);

export default taskRouter;
