import { Task } from "../models/task-model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      const error = new Error("Task title is required");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.userId, // From auth middleware
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const getTasks = async (req, res) => {
    try {
        const userId = req.user.userId || req.user._id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        let query = {};
        
        if (req.user.role !== "admin") {
            query = { user: userId };
        }

        if (req.query.status) {
            query.status = req.query.status;
        }
        
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        const tasks = await Task.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
            role: req.user.role
        });
        
    } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
        });
    }
};

export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID format. Must be a 24-character hex string"
            });
        }

        const task = await Task.findById(id).populate("user", "name email");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const currentUserId = req.user?._id?.toString() || req.userId?.toString();
        
        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found in request"
            });
        }

        if (req.user.role !== "admin") {
            const taskOwnerId = task.user._id.toString();
            
            if (taskOwnerId !== currentUserId) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to view this task"
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: task
        });
        
    } catch (error) {
        console.error("Error fetching task:", error.message);
        
        // ✅ FIX 4: Handle CastError (invalid ID format)
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID format"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Failed to fetch task",
        });
    }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.role !== "admin" && task.user.toString() !== req.user.userId) {
      const error = new Error("Not authorized to update this task");
      error.statusCode = 403;
      throw error;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const {id} = req.params
    const task = await Task.findById({_id: id});

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.role !== "admin" && task.user.toString() !== req.user.userId) {
      const error = new Error("Not authorized to delete this task");
      error.statusCode = 403;
      throw error;
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


