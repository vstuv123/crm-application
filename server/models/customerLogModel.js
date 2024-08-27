import mongoose, { mongo } from "mongoose";

const customerLogSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    interactionType: {
        type: String,
        enum: ["Meeting", "Email", "Call"],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},
{
    timestamps: true,
});

const Interaction = mongoose.model("CustomersLog", customerLogSchema);
export default Interaction;