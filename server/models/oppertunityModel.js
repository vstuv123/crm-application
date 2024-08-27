import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    stage: {
        type: String,
        enum: ["Qualification", "Proposal", "Negotiation", "Closed"],
        required: true,
    },
    closedDate: {
        type: Date,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
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
    }
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);
export default Opportunity;