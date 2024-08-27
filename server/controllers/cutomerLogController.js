
import Interaction from '../models/customerLogModel.js';
import LogFeatures from '../utils/logFeatures.js';
import { catchAsyncErrors } from './../middleware/catchAsyncErrors.js';
import ErrorHandler from './../utils/ErrorHandler.js';

export const createCustomerLog = catchAsyncErrors(async (req, res, next) => {
    let { customer, interactionType, date, time, description, createdBy } = req.body;
    if (!createdBy) {
        createdBy = req.user.id;
    }

    const log = await Interaction.create({ customer, interactionType, date, time, description, createdBy })
    res.status(200).json({ success: true, message: "Customer Log created successfully" });
})

export const getAllInteractions = catchAsyncErrors(async (req, res, next) => {
    const logFeatures = new LogFeatures(
        Interaction.find({ createdBy: req.user.id }).populate("customer", "name"),
        req.query
    )
    .filter()
    .date();

    const interactions = await logFeatures.query;
    const displayInteractions = interactions.map(interaction => ({
        _id: interaction._id,
        customer: interaction.customer.name,
        interactionType: interaction.interactionType,
        date: interaction.date,
        time: interaction.time,
        description: interaction.description,
    }))
    res.status(200).json({ success: true, interactions: displayInteractions });
})

export const getInteractionDetails = catchAsyncErrors(async (req, res, next) => {
    const interaction = await Interaction.findById(req.params.id).populate("customer", "name");
    if (!interaction) {
        return next(new ErrorHandler("Customer Log not found!", 404));
    }

    const displayInteraction = {
        _id: interaction._id,
        customer: interaction.customer,
        interactionType: interaction.interactionType,
        date: interaction.date,
        time: interaction.time,
        description: interaction.description,
        createdAt: interaction.createdAt,
    }

    res.status(200).json({ success: true, interaction: displayInteraction });
})

export const updateInteraction = catchAsyncErrors(async (req, res, next) => {
    const { customer, interactionType, date, time, description } = req.body;
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) {
        return next(new ErrorHandler("Customer Log not found!", 404));
    }
    await Interaction.findByIdAndUpdate(req.params.id, { customer, interactionType, date, time, description }, { new: true });
    res.status(200).json({ success: true, message: "Customer Log updated successfully" });
})

export const deleteInteraction = catchAsyncErrors(async (req, res, next) => {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) {
        return next(new ErrorHandler("Customer Log not found!", 404));
    }
    await Interaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Customer Log deleted successfully" });
})

export const interactionLogsOfCustomer = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const interactions = await Interaction.find({ customer: id }).populate("customer", "name");
    const displayInteractions = interactions.map(interaction => ({
        _id: interaction._id,
        customer: interaction.customer.name,
        interactionType: interaction.interactionType,
        date: interaction.date,
        time: interaction.time,
        description: interaction.description,
    }))
    res.status(200).json({ success: true, interactions: displayInteractions });
})
