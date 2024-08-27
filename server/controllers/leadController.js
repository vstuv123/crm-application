import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import Lead from "../models/leadModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import cron from "node-cron";
import mongoose from "mongoose";
import LeadFeatures from "../utils/leadFeatures.js";

export const createLead = catchAsyncErrors(async (req, res, next) => {
  let { name, contact, source, assignedTo, status } = req.body;
  if (!assignedTo) {
    assignedTo = req.user.id;
  }
  if (!status) {
    status = "Pending"
  }
  if (assignedTo && assignedTo !== "") {
    try {
      assignedTo = new mongoose.Types.ObjectId(assignedTo);
    } catch (error) {
      return next(new ErrorHandler("Invalid assignedTo ID format", 400));
    }
  }
  const lead = await Lead.create({
    name,
    contact,
    source,
    assignedTo,
    status,
  });

  const user = await User.findById(req.user.id);
  if (user.role === "Manager") {
    const SalesRep = await User.findById({ _id: assignedTo });
    if (SalesRep) {
      try {
        const message = `
              <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Assignment</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #333;
            font-size: 18px;
        }
        p, ul {
            margin: 0 0 10px 0;
        }
        .lead-details {
            margin: 20px 0;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
        }
        .lead-details li {
            margin-bottom: 5px;
        }
        .footer {
            font-size: 0.9em;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Lead Assigned</h1>
        <p>Dear ${SalesRep.name},</p>

        <p>A new lead has been assigned to you by ${user.name}.</p>

        <div class="lead-details">
            <ul>
                <li><strong>Lead Name:</strong> ${name}</li>
                <li><strong>Contact Information:</strong> ${contact}</li>
                <li><strong>Source:</strong> ${source}</li>
                <li><strong>Status:</strong> ${status}</li>
            </ul>
        </div>

        <p>Please take appropriate actions to follow up on this lead.</p>

        <p>Best regards,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>---</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
`;
        sendEmail({
          email: SalesRep.email,
          subject: "New Lead Assigned to you",
          message: message,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  } else {
    const manager = await User.findById({ _id: user.assignedTo });
    try {
      const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Review Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #333;
            font-size: 18px;
        }
        p, ul {
            margin: 0 0 10px 0;
        }
        .lead-details {
            margin: 20px 0;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
        }
        .lead-details li {
            margin-bottom: 5px;
        }
        .actions {
            margin: 20px 0;
        }
        .footer {
            font-size: 0.9em;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Lead Awaiting Review</h1>
        <p>Dear ${manager.name},</p>

        <p>A new lead has been created by ${user.name} and is awaiting your review. Below are the details of the lead:</p>

        <div class="lead-details">
            <ul>
                <li><strong>Lead Name:</strong> ${name}</li>
                <li><strong>Contact Information:</strong> ${contact}</li>
                <li><strong>Source:</strong> ${source}</li>
                <li><strong>Status:</strong> ${status}</li>
            </ul>
        </div>

        <p>Please review this lead and update its status accordingly:</p>

        <div class="actions">
            <ul>
                <li><strong>Approve:</strong> Change status to "New"</li>
                <li><strong>Reject:</strong> Change status to "Rejected"</li>
            </ul>
        </div>

        <p>If you approve this lead, the assigned sales representative will be notified. If you reject it, the sales representative will be informed as well.</p>

        <p>Thank you,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>---</p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
`;
      sendEmail({
        email: manager.name,
        subject: "New Lead Created By Sales Representative",
        message: message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  res.status(200).json({ success: true, message: "Lead created successfully" });
});

export const getAllNonArchivedLeadsSalesRep = catchAsyncErrors(
  async (req, res, next) => {
    const leadFeatures = new LeadFeatures(
      Lead.find({
        assignedTo: req.user.id,
        isArchived: false,
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res
      .status(200)
      .json({ success: true, nonArchivedLeads: leads });
  }
);

export const getAllArchivedLeadsSalesRep = catchAsyncErrors(
  async (req, res, next) => {
    const leadFeatures = new LeadFeatures(
      Lead.find({
        assignedTo: req.user.id,
        isArchived: true,
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res
      .status(200)
      .json({ success: true, archivedLeads: leads });
  }
);

export const getAllNonArchivedLeadsManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);

    const leadFeatures = new LeadFeatures(
      Lead.find({
        assignedTo: { $in: salesRepIds },
        isArchived: false,
        status: { $ne: "Pending" },
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res.status(200).json({ success: true, nonArchivedLeads: leads });
  }
);

export const getAllArchivedLeadsManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);
    const leadFeatures = new LeadFeatures(
      Lead.find({
        assignedTo: { $in: salesRepIds },
        isArchived: true,
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res
      .status(200)
      .json({ success: true, archivedLeads: leads });
  }
);

export const getAllNonArchivedLeadsAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const leadFeatures = new LeadFeatures(
      Lead.find({
        isArchived: false,
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res
      .status(200)
      .json({ success: true, nonArchivedLeads: leads });
  }
);

export const getAllPendingLeadsManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);
    const leadFeatures = new LeadFeatures(
      Lead.find({
        assignedTo: { $in: salesRepIds },
        isArchived: false,
        status: { $eq: "Pending" },
      }),
      req.query
    )
      .search()
      .filter()
      .source();
    const leads = await leadFeatures.query;
    res
      .status(200)
      .json({ success: true, pendingLeads: leads });
  }
);

export const updatePendingStatusManager = catchAsyncErrors(
  async (req, res, next) => {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ErrorHandler("Lead not found!", 400));
    }
    let updates = { status };

    if (status === "Rejected") {
      updates.isArchived = true;
      updates.archivedAt = new Date();
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    try {
      const user = await User.findById(updatedLead.assignedTo);
      const message = `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #333;
            font-size: 18px;
        }
        p, ul {
            margin: 0 0 10px 0;
        }
        .lead-details {
            margin: 20px 0;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
        }
        .footer {
            font-size: 0.9em;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Lead Status Update</h1>
        <p>Dear ${user.name},</p>

        <p>The status of the lead "<strong>${updatedLead.name}</strong>" has been 
            <strong>${updatedLead.status === "Rejected" ? "rejected" : "approved"}</strong> by the manager. Below are the details:
        </p>

        <div class="lead-details">
            <p><strong>Lead Name:</strong> ${updatedLead.name}</p>
            <p>
                ${updatedLead.status === "Rejected"
                    ? "The lead has been archived as it was rejected."
                    : "The lead's status has been updated to <strong>New</strong>. You can change it if you want by going to the Update Lead Page."
                }
            </p>
        </div>

        <p>Thank you,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html> `;
      sendEmail({
        email: user.email,
        subject: `Lead Status Update: ${updatedLead.name}`,
        message: message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    res
        .status(200)
        .json({ success: true, message: "Status updated successfully" });
  }
);

export const archiveLead = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHandler("Lead not found!", 404));
  }

  await Lead.findByIdAndUpdate(
    req.params.id,
    { isArchived: true, archivedAt: new Date() },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Lead Archived Successfully" });
});

export const unArchiveLead = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHandler("Lead not found!", 404));
  }

  await Lead.findByIdAndUpdate(
    req.params.id,
    { isArchived: false, archivedAt: null },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Lead Un-Archived Successfully" });
});


cron.schedule("0 0 * * *", async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    await Lead.deleteMany({
      isArchived: true,
      archivedAt: { $lt: thirtyDaysAgo },
    });
  } catch (error) {
    console.error("Error while deleting leads:", error.message);
  }
});

export const deleteLeadPermanently = catchAsyncErrors(
  async (req, res, next) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new ErrorHandler("Lead not found!", 404));
    }

    await Lead.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Lead deleted successfully" });
  }
);

export const getSingleLead = catchAsyncErrors(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHandler("Lead not found!", 404));
  }

  let saleRepData;

  const saleRep = await User.findById(lead.assignedTo);
  if (!saleRep) {
    saleRepData = null;
  }else {
    saleRepData = {
      _id: saleRep._id,
      salesRep: saleRep.name,
    }
  }

  res.status(200).json({ success: true, lead, saleRepData });
});

export const updateLeadByManager = async (req, res, next) => {
  const { name, contact, source, status, assignedTo } = req.body;
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHandler("Lead not found!", 404));
  }

  const nameNotChanged = lead.name === name;
  const contactNotChanged = lead.contact === contact;
  const sourceNotChanged = lead.source === source;
  const statusNotChanged = lead.status === status;
  const assignedToNotChanged =
    lead.assignedTo.toString() || "" === assignedTo.toString() || "";

  if (
    nameNotChanged &&
    contactNotChanged &&
    sourceNotChanged &&
    statusNotChanged &&
    assignedToNotChanged
  ) {
    return next(
      new ErrorHandler("Cannot update because nothing is changed", 400)
    );
  }

  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    { name, contact, source, status, assignedTo },
    { new: true }
  );

  if (
    lead.assignedTo.toString() ||
    "" !== updatedLead.assignedTo.toString() ||
    ""
  ) {
    try {
      const updatedUser = await User.findById(updatedLead.assignedTo);
      if (updatedUser) {
        const message = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Assigned</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #333;
            font-size: 18px;
        }
        p {
            margin: 0 0 10px 0;
        }
        .lead-details {
            margin: 20px 0;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
        }
        .footer {
            font-size: 0.9em;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Lead Assigned</h1>
        <p>Dear ${updatedUser.name},</p>

        <p>You have been assigned a new lead by the Manager. Below are the details of the lead:</p>

        <div class="lead-details">
            <p><strong>Lead Name:</strong> ${updatedLead.name}</p>
            <p><strong>Contact Information:</strong> ${updatedLead.contact}</p>
            <p><strong>Source:</strong> ${updatedLead.source}</p>
            <p><strong>Current Status:</strong> ${updatedLead.status}</p>
        </div>

        <p>As the new point of contact for this lead, please review the details and follow up accordingly. If you have any questions or need more information, please reach out to the Manager.</p>

        <p>Thank you,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>

        `;
        sendEmail({
          email: updatedUser.email,
          subject: "New Lead Assignment",
          message,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  try {
    const user = await User.findById(lead.assignedTo);
    const updatedUser = await User.findById(updatedLead.assignedTo);
    if (user) {
      const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Updated</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #333;
            font-size: 18px;
        }
        p {
            margin: 0 0 10px 0;
        }
        .lead-details {
            margin: 20px 0;
            padding: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
        }
        .note {
            margin: 20px 0;
            padding: 10px;
            background-color: #ffffe0;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .footer {
            font-size: 0.9em;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Lead Updated</h1>
        <p>Dear ${user.name},</p>

        <p>The lead "<strong>${lead.name}</strong>" has been updated by the Manager. Please find the details below:</p>

        <div class="lead-details">
            <p><strong>Lead Name:</strong> ${updatedLead.name}</p>
            <p><strong>Lead Status:</strong> ${updatedLead.status}</p>
            <p><strong>Lead Source:</strong> ${updatedLead.source}</p>
        </div>

        ${ (lead.assignedTo.toString() || "") !== (updatedLead.assignedTo.toString() || "") && updatedLead.assignedTo.toString() !== "" 
            ? `<div class="note">
                <p><strong>Note:</strong> Please note that this lead has been reassigned to ${updatedUser?.name}. You are no longer responsible for this lead.</p>
              </div>` 
            : "" }

        <p>If you have any questions or need further clarification, please reach out to the Manager.</p>

        <p>Thank you,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
    `;
      sendEmail({
        email: user.email,
        subject: "Lead Updated By Manager",
        message,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
  res.status(200).json({ success: true, message: "Lead updated successfully" });
};

export const updateLeadBySalesRep = async (req, res, next) => {
  const { name, contact, source, status } = req.body;
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return next(new ErrorHandler("Lead not found!", 404));
  }

  const nameNotChanged = lead.name === name;
  const contactNotChanged = lead.contact === contact;
  const sourceNotChanged = lead.source === source;
  const statusNotChanged = lead.status === status;

  if (
    nameNotChanged &&
    contactNotChanged &&
    sourceNotChanged &&
    statusNotChanged
  ) {
    return next(
      new ErrorHandler("Cannot update because nothing is changed", 400)
    );
  }


  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    { name, contact, source, status },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Lead has been updated successfully" });
};

export const getLeadsOfSingleSaleRep = catchAsyncErrors(async (req, res, next) => {
  const leads = await Lead.find({ assignedTo: req.body.id });
  if (!leads) {
    leads = [];
  }
  return res.status(200).json({ success: true, leads });
})
