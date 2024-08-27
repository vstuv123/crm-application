import { catchAsyncErrors } from "./../middleware/catchAsyncErrors.js";
import ErrorHandler from "./../utils/ErrorHandler.js";
import Task from "../models/taskModel.js";
import TaskFeatures from "../utils/taskFeatures.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import cron from "node-cron";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createTask = catchAsyncErrors(async (req, res, next) => {
  let { name, status, taskDetails, closedDate, createdBy } = req.body;

  if (!createdBy) {
    createdBy = req.user.id;
  }

  const task = await Task.create({
    name,
    status,
    taskDetails,
    closedDate,
    createdBy,
  });
  res.status(200).json({ success: true, message: "Task created successfully" });
});

export const getAllTasks = catchAsyncErrors(async (req, res, next) => {
  const taskFeatures = new TaskFeatures(
    Task.find({ createdBy: req.user.id }),
    req.query
  )
    .search()
    .filter()
    .closedDate();

  const tasks = await taskFeatures.query;
  res.status(200).json({ success: true, tasks });
});

export const getTaskDetails = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  res.status(200).json({ success: true, task });
});

export const updateTask = catchAsyncErrors(async (req, res, next) => {
  const { name, status, taskDetails, closedDate } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  if (task.closedDate !== closedDate) {
    await Task.findByIdAndUpdate(
        req.params.id,
        { name, status, taskDetails, closedDate, emailSent: false },
        { new: true }
    );
  }else {
    await Task.findByIdAndUpdate(
        req.params.id,
        { name, status, taskDetails, closedDate },
        { new: true }
      );
  }
  res.status(200).json({ success: true, message: "Task updated successfully" });
});

export const deleteTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Task deleted successfully" });
});

const checkTasksAndSendEmails = async () => {
  const now = dayjs().utc();
  const oneDayFromNow = now.add(1, "day");

  try {
    const tasks = await Task.find({
      status: "Pending",
      closedDate: {
        $gte: now.toISOString(),
        $lt: oneDayFromNow.toISOString(),
      },
      emailSent: false,
    });

    if (tasks.length > 0) {
      tasks.forEach(async (task) => {
        try {
          const user = await User.findById(task.createdBy);
          const userTimeZone = 'PST';
          
          const localTime = dayjs(task.closedDate).tz(userTimeZone, true).format('YYYY-MM-DD h:mm A');

          const message = `
            <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
            <p>Hello ${user.name},</p>
            <p>This is a friendly reminder that your task titled "<strong>${
                task.name
            }</strong>" is still pending and is due for completion soon.</p>
            <p><strong>Task Details:</strong></p>
            <ul style="list-style: none; padding: 0;">
            <li><strong>Task Name:</strong> ${task.name}</li>
            <li><strong>Due Date:</strong> ${localTime} ${userTimeZone}</li>
            <li><strong>Status:</strong> Pending</li>
            </ul>
            <p>Please ensure that you complete this task before the due date to avoid any delays.</p>
            <p>Thank you for your attention to this matter.</p>
            <p>Best regards,<br>CRM Application</p>
            </div>
            </body>
            </html>`;
          sendEmail({
            email: user.email,
            subject: `Reminder: Your Task ${task.name} is Due Soon`,
            message,
          });
          await Task.findByIdAndUpdate(task._id, { emailSent: true });
        } catch (error) {
          return console.error(error.message);
        }
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Schedule the function to run every hour
cron.schedule("0 * * * *", () => {
  checkTasksAndSendEmails();
});
