import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"]
    },
    taskDetails: {
        type: String,
        required: true,
    },
    closedDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    emailSent: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.model("Task", taskSchema);
export default Task;