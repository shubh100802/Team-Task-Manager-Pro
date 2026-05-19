import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validators/taskValidators.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createTaskSchema), createTaskController);
router.get("/", getTasksController);
router.get("/:id", validate(taskIdSchema), getTaskController);
router.put("/:id", validate(updateTaskSchema), updateTaskController);
router.delete("/:id", validate(taskIdSchema), deleteTaskController);

export default router;
