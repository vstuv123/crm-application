import express from 'express';
import { isAuthenticatedUser } from './../middleware/auth.js';
import { createTask, deleteTask, getAllTasks, getTaskDetails, updateTask } from '../controllers/taskController.js';

const router = express.Router();

router.route("/create-task").post(isAuthenticatedUser, createTask);

router.route("/get-all-tasks").get(isAuthenticatedUser, getAllTasks);

router.route("/get-single-task/:id").get(isAuthenticatedUser, getTaskDetails);

router.route("/update-task/:id").put(isAuthenticatedUser, updateTask);

router.route("/delete-task/:id").delete(isAuthenticatedUser, deleteTask);

export default router;