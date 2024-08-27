import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    minlength: [10, "Phone number should contain at-least 10 digits"],
    maxlength: [12, "Phone number should contain at-least 12 digits"],
    unique: true,
  },
  source: {
    type: String,
    required: true,
    enum: [
      "Website Form",
      "Referral",
      "Social Media",
      "Email Campaign",
      "Trade Show",
      "Cold Call",
      "Others",
    ],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "New", "In Progress", "Converted", "Lost", "Rejected"],
    default: "Pending",
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;