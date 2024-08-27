import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import Customer from "../models/customerModel.js";
import User from "../models/userModel.js";
import cron from "node-cron";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import CustomerFeatures from "../utils/customerFeatures.js";
import mongoose from "mongoose";
import Lead from "../models/leadModel.js";

export const createCustomer = catchAsyncErrors(async (req, res, next) => {
  let { name, contact, company, address, industry, notes, assignedTo, status } =
    req.body;
  if (!assignedTo) {
    assignedTo = req.user.id;
  }
  if (!status) {
    status = "Pending"
  }
  const lead = await Lead.findOne({ contact: contact });
  if (!lead) {
    return next(new ErrorHandler("Lead not Found with this contact", 404));
  }

  const customer = await Customer.create({
    name,
    contact,
    company,
    address,
    industry,
    notes,
    assignedTo,
    status,
  });

  const salesCycleLength = Math.floor(
    (customer.createdAt - lead.createdAt) / (1000 * 60 * 60 * 24)
  );
  await Customer.findByIdAndUpdate(customer._id, { salesCycleLength }, { new: true });

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
    <title>New Customer Assignment</title>
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
        .details {
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
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Customer Assignment</h1>
        <p>Dear ${SalesRep.name},</p>

        <p>A new customer has been assigned to you by Manager ${user.name}.</p>

        <p>Below are the details of the customer:</p>
        <div class="details">
            <p><span class="highlight">Customer Name:</span> ${name}</p>
            <p><span class="highlight">Contact Information:</span> ${contact}</p>
            <p><span class="highlight">Company:</span> ${company}</p>
            <p><span class="highlight">Address:</span> ${address}</p>
            <p><span class="highlight">Industry:</span> ${industry}</p>
            <p><span class="highlight">Notes:</span> ${notes}</p>
        </div>

        <p>Please take appropriate actions to follow up on this customer.</p>

        <p>Best regards,</p>
        <p>CRM Application</p>

        <div class="footer">
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
    <title>Customer Review Needed</title>
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
        .details {
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
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Customer Review Required</h1>
        <p>Dear ${manager.name},</p>

        <p>A new customer has been created by ${user.name} and is awaiting your review. Below are the details of the customer:</p>

        <div class="details">
            <p><span class="highlight">Customer Name:</span> ${name}</p>
            <p><span class="highlight">Contact Information:</span> ${contact}</p>
            <p><span class="highlight">Company:</span> ${company}</p>
            <p><span class="highlight">Address:</span> ${address}</p>
            <p><span class="highlight">Industry:</span> ${industry}</p>
            <p><span class="highlight">Notes:</span> ${notes}</p>
        </div>

        <p>Please review this customer and update its status accordingly:</p>
        <ul>
            <li><strong>Approve:</strong> Change status to "Active"</li>
            <li><strong>Reject:</strong> Change status to "Rejected"</li>
        </ul>

        <p>If you approve this customer, the assigned sales representative will be notified. If you reject it, the sales representative will be informed as well.</p>

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
        email: manager.name,
        subject: "New Customer Created By Sales Representative",
        message: message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
  res
    .status(200)
    .json({ success: true, message: "Customer created successfully" });
});

export const getAllNonArchivedCustomersSalesRep = catchAsyncErrors(
  async (req, res, next) => {
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        assignedTo: req.user.id,
        isArchived: false,
      }),
      req.query
    ).search().filter().company().industry();
    ;

    const customers = await customerFeatures.query;
    res
      .status(200)
      .json({
        success: true,
        nonArchivedCustomers: customers,
      });
  }
);

export const getAllNonArchivedCustomersAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        isArchived: false,
      }),
      req.query
    ).search().filter().company().industry();

    const customers = await customerFeatures.query;
    res
      .status(200)
      .json({
        success: true,
        nonArchivedCustomers: customers,
      });
  }
);

export const getAllArchivedCustomersAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        isArchived: true,
      }),
      req.query
    ).search().filter().company().industry();

    const customers = await customerFeatures.query;
    res
      .status(200)
      .json({
        success: true,
        archivedCustomers: customers,
      });
  }
);

export const getAllArchivedCustomersSalesRep = catchAsyncErrors(
  async (req, res, next) => {
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        assignedTo: req.user.id,
        isArchived: true,
      }),
      req.query
    ).search().filter().company().industry();
    ;

    const customers = await customerFeatures.query;
    res
      .status(200)
      .json({
        success: true,
        archivedCustomers: customers,
      });
  }
);

export const getAllNonArchivedCustomersManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        assignedTo: { $in: salesRepIds },
        isArchived: false,
        status: { $ne: "Pending" },
      }),
      req.query
    ).search().filter().company().industry();
    ;

    const customers = await customerFeatures.query;

    res.status(200).json({ success: true, nonArchivedCustomers: customers });
  }
);

export const getAllArchivedCustomersManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        assignedTo: { $in: salesRepIds },
        isArchived: true,
      }),
      req.query
    ).search().filter().company().industry();

    const customers = await customerFeatures.query;

    res.status(200).json({ success: true, archivedCustomers: customers });
  }
);

export const getAllPendingCustomersManager = catchAsyncErrors(
  async (req, res, next) => {
    const manager = await User.findById(req.user.id).populate("salesTeam");
    const salesRepIds = manager.salesTeam.map((rep) => rep._id);
    const customerFeatures = new CustomerFeatures(
      Customer.find({
        assignedTo: { $in: salesRepIds },
        isArchived: false,
        status: { $eq: "Pending" },
      }),
      req.query
    ).search().filter().company().industry();

    const customers = await customerFeatures.query;
    res
      .status(200)
      .json({
        success: true,
        pendingCustomers: customers,
      });
  }
);

export const updatePendingStatusManager = catchAsyncErrors(
  async (req, res, next) => {
    const { status } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return next(new ErrorHandler("Customer not found!", 400));
    }
    let updates = { status };

    if (status === "Rejected") {
      updates.isArchived = true;
      updates.archivedAt = new Date();
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    try {
      const user = await User.findById(updatedCustomer.assignedTo);
      const message = `
                  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Status Update</title>
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
        .status-update {
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
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Customer Status Update</h1>
        <p>Dear ${user.name},</p>

        <p>The status of the customer "<strong>${updatedCustomer.name}</strong>" has been ${
          updatedCustomer.status === "Rejected" ? "rejected" : "approved"
        } by the manager. Below are the details:</p>

        <div class="status-update">
            <p><span class="highlight">Customer Name:</span> ${updatedCustomer.name}</p>
            <p><span class="highlight">Status:</span> ${updatedCustomer.status}</p>
            ${ 
              updatedCustomer.status === "Rejected"
                ? "<p>The customer has been archived as it was rejected.</p>"
                : "<p>The customer's status has been updated.</p>"
            }
        </div>

        <p>Thank you,</p>
        <p>CRM Application</p>

        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>`;
      sendEmail({
        email: user.email,
        subject: `Customer Status Update: ${updatedCustomer.name}`,
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

export const archiveCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found!", 404));
  }

  await Customer.findByIdAndUpdate(
    req.params.id,
    { isArchived: true, archivedAt: new Date() },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Customer Archived Successfully" });
});

export const unArchiveCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found!", 404));
  }

  await Customer.findByIdAndUpdate(
    req.params.id,
    { isArchived: false, archivedAt: null },
    { new: true }
  );

  res.status(200).json({ success: true, message: "Customer Un-Archived Successfully" });
});

cron.schedule("0 0 * * *", async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    await Customer.deleteMany({
      isArchived: true,
      archivedAt: { $lt: thirtyDaysAgo },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const deleteCustomerPermanently = catchAsyncErrors(
  async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return next(new ErrorHandler("Customer not found!", 404));
    }

    await Customer.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  }
);

export const getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found!", 404));
  }

  let saleRepData;

  const saleRep = await User.findById(customer.assignedTo);
  if (!saleRep) {
    saleRepData = null;
  }else {
    saleRepData = {
      _id: saleRep._id,
      salesRep: saleRep.name,
    }
  }

  res.status(200).json({ success: true, customer, saleRepData });
});

export const updateCustomerBySalesRep = async (req, res, next) => {
  const { name, contact, company, address, industry, notes, status } = req.body;
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found!", 404));
  }

  await Customer.findByIdAndUpdate(
    req.params.id,
    { name, contact, company, address, industry, notes, status },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Customer has been updated successfully" });
};

export const updateCustomerByManager = async (req, res, next) => {
  const {
    name,
    contact,
    company,
    address,
    industry,
    notes,
    status,
    assignedTo,
  } = req.body;
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ErrorHandler("Customer not found!", 404));
  }

  const nameNotChanged = customer.name === name;
  const contactNotChanged = customer.contact === contact;
  const companyNotChanged = customer.company === company;
  const addressNotChanged = customer.address === address;
  const industryNotChanged = customer.industry === industry;
  const notesNotChanged = customer.notes === notes;
  const statusNotChanged = customer.status === status;
  const assignedToNotChanged =
    customer.assignedTo.toString() || "" === assignedTo.toString() || "";

  if (
    !nameNotChanged &&
    !contactNotChanged &&
    !companyNotChanged &&
    !addressNotChanged &&
    !industryNotChanged &&
    !notesNotChanged &&
    !statusNotChanged &&
    !assignedToNotChanged
  ) {
    return next(
      new ErrorHandler("Cannot update because nothing is changed", 400)
    );
  }


  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, contact, company, address, industry, notes, status, assignedTo },
    { new: true }
  );
  if (
    customer.assignedTo.toString() ||
    "" !== updatedCustomer.assignedTo.toString() ||
    ""
  ) {
    try {
      const updatedUser = await User.findById(updatedCustomer.assignedTo);
      if (updatedUser) {
        const message = `
           <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Customer Assigned</title>
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
        .customer-details {
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
        <h1>New Customer Assigned</h1>
        <p>Dear ${updatedUser.name},</p>

        <p>You have been assigned a new customer by the Manager. Below are the details of the customer:</p>

        <div class="customer-details">
            <p><strong>Customer Name:</strong> ${updatedCustomer.name}</p>
            <p><strong>Contact Information:</strong> ${updatedCustomer.contact}</p>
            <p><strong>Company:</strong> ${updatedCustomer.company}</p>
            <p><strong>Address:</strong> ${updatedCustomer.address}</p>
            <p><strong>Industry:</strong> ${updatedCustomer.industry}</p>
            <p><strong>Notes:</strong> ${updatedCustomer.notes}</p>
            <p><strong>Current Status:</strong> ${updatedCustomer.status}</p>
        </div>

        <p>As the new point of contact for this customer, please review the details and follow up accordingly. If you have any questions or need more information, please reach out to the Manager.</p>

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
    const user = await User.findById(customer.assignedTo);
    const updatedUser = await User.findById(updatedCustomer.assignedTo);
    if (user) {
      const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Update Notification</title>
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
        .customer-details {
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
        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Customer Update Notification</h1>
        <p>Dear ${user.name},</p>

        <p>The customer "<strong>${customer.name}</strong>" has been updated by the Manager. Please find the details below:</p>

        <div class="customer-details">
            <p><span class="highlight">Customer Name:</span> ${updatedCustomer.name}</p>
            <p><span class="highlight">Contact Information:</span> ${updatedCustomer.contact}</p>
            <p><span class="highlight">Company:</span> ${updatedCustomer.company}</p>
            <p><span class="highlight">Address:</span> ${updatedCustomer.address}</p>
            <p><span class="highlight">Industry:</span> ${updatedCustomer.industry}</p>
            <p><span class="highlight">Notes:</span> ${updatedCustomer.notes}</p>
            <p><span class="highlight">Current Status:</span> ${updatedCustomer.status}</p>
        </div>

        ${ 
          (customer.assignedTo.toString() || "") !==
          (updatedCustomer.assignedTo.toString() || "") &&
          updatedCustomer.assignedTo.toString() !== ""
            ? `<p><strong>Please note that this customer has been reassigned to ${updatedUser?.name}. You are no longer responsible for this customer.</strong></p>`
            : ""
        }

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
  res.status(200).json({ success: true, message: "Customer updated successfully" });
};

export const getCustomersOfSingleSaleRep = catchAsyncErrors(async (req, res, next) => {
  const customers = await Customer.find({ assignedTo: req.body.id });
  if (!customers) {
    customers = [];
  }
  return res.status(200).json({ success: true, customers });
})

