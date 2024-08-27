import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    closedDate: {
        type: Date,
        required: true,
    },
    productsSold: {
        type: Number,
        required: true,
    },
    paymentTerms: {
        type: String,
        required: true,
        enum: ["Net 15", "Net 30", "Net 60", "Due on Receipt", "Installments", "Prepaid", "COD(Cash On Delivery)"]
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;