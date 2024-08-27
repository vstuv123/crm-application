import Opportunity from "../models/oppertunityModel.js";
import Lead from "../models/leadModel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cron from 'node-cron';
import OpportunityFeatures from "../utils/opportunityFeatures.js";

export const createOpportunity = catchAsyncErrors(async ( req, res, next) => {
    const { name, value, stage, closedDate, assignedTo } = req.body;
    const opportunity = await Opportunity.create({ name, value, stage, closedDate, assignedTo });
    res.status(200).json({ success: true, message: "Opportunity created successfully"});
})

export const getAllNonArchivedOpportunities = catchAsyncErrors(async (req, res, next) => {
    const leads = await Lead.find({ assignedTo: req.user.id });
    if (!leads || leads.length === 0) {
        return res.status(200).json({ success: true, nonArchivedOpportunities: [] });
    }
    const leadIds = leads.map(lead => lead._id);
    const opportunityFeatures = new OpportunityFeatures(
        Opportunity.find({
            assignedTo: { $in: leadIds },
            isArchived: false,
        }),
        req.query
      )
        .search()
        .filter()
        .stage()
        .closedDate();

    const opportunities = await opportunityFeatures.query;
    res.status(200).json({ success: true, nonArchivedOpportunities: opportunities });
})

export const getAllArchivedOpportunities = catchAsyncErrors(async (req, res, next) => {
    const leads = await Lead.find({ assignedTo: req.user.id });
    const leadIds = leads.map(lead => lead._id);
    const opportunityFeatures = new OpportunityFeatures(
        Opportunity.find({
            assignedTo: { $in: leadIds },
            isArchived: true,
        }),
        req.query
      )
        .search()
        .filter()
        .stage()
        .closedDate();

    const opportunities = await opportunityFeatures.query;
    return res.status(200).json({ success: true, archivedOpportunities: opportunities });
})

export const updateOpportunity = catchAsyncErrors(async (req, res, next) => {
    const { name, value, stage, closedDate, assignedTo } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(new ErrorHandler("Opportunity not found!", 404));
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        req.params.id,
        { name, value, stage, closedDate, assignedTo },
        { new: true }
    )
    res.status(200).json({ success: true, message: "Opportunity updated successfully" });
})

export const archiveOpportunity = catchAsyncErrors(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(new ErrorHandler("Opportunity not found!", 404));
    }

    await Opportunity.findByIdAndUpdate(
        req.params.id,
        { isArchived: true, archivedAt: new Date() },
        { new: true },
    )
    res.status(200).json({ success: true, message: "Opportunity Archived Successfully" });
})

export const unArchiveOpportunity = catchAsyncErrors(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(new ErrorHandler("Opportunity not found!", 404));
    }

    await Opportunity.findByIdAndUpdate(
        req.params.id,
        { isArchived: false, archivedAt: null },
        { new: true },
    )
    res.status(200).json({ success: true, message: "Opportunity UnArchived Successfully" });
})

export const deleteOpportunityPermanently = catchAsyncErrors(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(new ErrorHandler("Opportunity not found!", 404));
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Opportunity deleted successfully" });
})

cron.schedule("0 0 * * *", async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
      await Opportunity.deleteMany({
        isArchived: true,
        archivedAt: { $lt: thirtyDaysAgo },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllOpportunitiesOfSingleLead = catchAsyncErrors(async (req, res, next) => {
    const opportunities = await Opportunity.find({ assignedTo: req.body.id });
    if (!opportunities) {
        opportunities = [];
      }
    return res.status(200).json({ success: true, opportunities });
})

export const getSingleOpportunity = catchAsyncErrors(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
        return next(new ErrorHandler("Opportunity not found!", 404));
    }

    let leadData;

  const lead = await Lead.findById(opportunity.assignedTo);
  if (!lead) {
    leadData = null;
  }else {
    leadData = {
      _id: lead._id,
      name: lead.name,
    }
  }

    res.status(200).json({ success: true, opportunity, leadData });
})

