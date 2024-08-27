import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        minlength: [10, "Phone number should be of at-least 10 digits"],
        maxlength: [12, "Phone number should not exceed 12 digits"]
    },
    company: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["Pending", "Active", "InActive", "Rejected"],
        default: "Pending"
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    archivedAt: {
        type: Date,
        default: null,
    },
    salesCycleLength: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;