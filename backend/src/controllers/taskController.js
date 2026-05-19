import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/taskService.js";

export const createTaskController = asyncHandler(async (req, res) => {
  const task = await createTask(req.validated.body, req.user.id);
  return sendResponse(res, {
    statusCode: 201,
    message: "Task created successfully",
    data: task,
  });
});

export const getTasksController = asyncHandler(async (req, res) => {
  const tasks = await getTasks(req.query, req.user);
  return sendResponse(res, {
    message: "Tasks fetched successfully",
    data: tasks,
  });
});

export const getTaskController = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id, req.user.id);
  return sendResponse(res, {
    message: "Task fetched successfully",
    data: task,
  });
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const task = await updateTask(req.params.id, req.validated.body, req.user.id);
  return sendResponse(res, {
    message: "Task updated successfully",
    data: task,
  });
});

export const deleteTaskController = asyncHandler(async (req, res) => {
  const task = await deleteTask(req.params.id, req.user.id);
  return sendResponse(res, {
    message: "Task deleted successfully",
    data: task,
  });
});
