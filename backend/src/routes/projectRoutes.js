import { Router } from "express";
import {
  addProjectMemberController,
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
  removeProjectMemberController,
  updateProjectController,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  addMemberSchema,
  createProjectSchema,
  projectIdSchema,
  removeMemberSchema,
  updateProjectSchema,
} from "../validators/projectValidators.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createProjectSchema), createProjectController);
router.get("/", getProjectsController);
router.get("/:id", validate(projectIdSchema), getProjectController);
router.put("/:id", validate(updateProjectSchema), roleMiddleware((req) => req.params.id), updateProjectController);
router.delete("/:id", validate(projectIdSchema), roleMiddleware((req) => req.params.id), deleteProjectController);
router.post("/:id/members", validate(addMemberSchema), roleMiddleware((req) => req.params.id), addProjectMemberController);
router.delete(
  "/:id/members/:userId",
  validate(removeMemberSchema),
  roleMiddleware((req) => req.params.id),
  removeProjectMemberController,
);

export default router;
