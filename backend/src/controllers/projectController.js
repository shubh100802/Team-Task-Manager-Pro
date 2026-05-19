import { sendResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeProjectMember,
  updateProject,
} from "../services/projectService.js";

export const createProjectController = asyncHandler(async (req, res) => {
  const project = await createProject(req.validated.body, req.user.id);
  return sendResponse(res, {
    statusCode: 201,
    message: "Project created successfully",
    data: project,
  });
});

export const getProjectsController = asyncHandler(async (req, res) => {
  const projects = await getProjects(req.user.id);
  return sendResponse(res, {
    message: "Projects fetched successfully",
    data: projects,
  });
});

export const getProjectController = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id, req.user.id);
  return sendResponse(res, {
    message: "Project fetched successfully",
    data: project,
  });
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const project = await updateProject(req.params.id, req.validated.body, req.user.id);
  return sendResponse(res, {
    message: "Project updated successfully",
    data: project,
  });
});

export const deleteProjectController = asyncHandler(async (req, res) => {
  const project = await deleteProject(req.params.id, req.user.id);
  return sendResponse(res, {
    message: "Project deleted successfully",
    data: project,
  });
});

export const addProjectMemberController = asyncHandler(async (req, res) => {
  const membership = await addProjectMember(req.params.id, req.validated.body, req.user.id);
  return sendResponse(res, {
    statusCode: 201,
    message: "Member added successfully",
    data: membership,
  });
});

export const removeProjectMemberController = asyncHandler(async (req, res) => {
  const membership = await removeProjectMember(req.params.id, req.params.userId, req.user.id);
  return sendResponse(res, {
    message: "Member removed successfully",
    data: membership,
  });
});
