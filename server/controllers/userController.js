import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncErrors } from "./../middleware/catchAsyncErrors.js";
import sendToken from "./../utils/sendToken.js";
import sendEmail from "./../utils/sendEmail.js";
import crypto from "crypto";
import { formattedDate, arraysAreDifferent } from "../utils/getDate.js";
import mongoose from "mongoose";
import ApiFeatures from "../utils/apiFeatures.js";

export const createNewUser = catchAsyncErrors(async (req, res, next) => {
  let { name, email, password, contact, role, salesTeam, assignedTo } =
    req.body;

  if (salesTeam && salesTeam.length === 0) {
    salesTeam = [];
  }

  if (salesTeam && salesTeam.length > 0) {
    salesTeam = salesTeam.map((id) => new mongoose.Types.ObjectId(id));
  }

  if (!assignedTo || assignedTo === "") {
    assignedTo = null;
  } else {
    assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }

  const user = await User.create({
    name,
    email,
    password,
    contact,
    role,
    salesTeam,
    assignedTo,
  });
  if (salesTeam && salesTeam.length > 0) {
    const salesReps = await User.find({ _id: { $in: salesTeam } });
    const saleRepsIds = salesReps.map((rep) => rep._id);

    for (const saleRep of salesReps) {
      if (saleRep.assignedTo !== null) {
        await User.updateOne(
          { _id: saleRep.assignedTo },
          { $pull: { salesTeam: saleRep._id } }
        );
      }
    }
    await User.updateMany(
      { _id: { $in: saleRepsIds } },
      { $set: { assignedTo: user._id } }
    );
  }
  if (assignedTo && assignedTo !== "") {
    await User.updateOne(
      { _id: assignedTo },
      { $push: { salesTeam: user._id } }
    );
  }
  return res
    .status(201)
    .json({ success: true, message: "User created successfully" });
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and Password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ success: true, message: "Logout successfully" });
});

export const updateUserProfileAdmin = catchAsyncErrors(
  async (req, res, next) => {
    let { role, salesTeam, assignedTo } = req.body;
    if (role === "Admin") {
      salesTeam = [];
      assignedTo = null;
    } else if (role === "Manager") {
      assignedTo = null;
    } else if (role === "Sales Representative") {
      salesTeam = [];
    }

    if (salesTeam && salesTeam.length > 0) {
      salesTeam = salesTeam.map((id) => new mongoose.Types.ObjectId(id));
    }

    if (!assignedTo || assignedTo === "") {
      assignedTo = null;
    } else {
      assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    const roleHasChanged = user.role !== role;
    const salesTeamHasChanged = arraysAreDifferent(user.salesTeam, salesTeam);
    const assignedToHasChanged =
      user.assignedTo && assignedTo
        ? !user.assignedTo.equals(assignedTo)
        : user.assignedTo !== assignedTo;

    if (!roleHasChanged && !salesTeamHasChanged && !assignedToHasChanged) {
      return next(
        new ErrorHandler("Cannot update because nothing is changed", 400)
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role, salesTeam, assignedTo },
      { new: true }
    );

    if (
      (user.role === "Manager" && updatedUser.role === "Admin") ||
      (user.role === "Manager" && updatedUser.role === "Sales Representative")
    ) {
      if (!user.salesTeam) {
        user.salesTeam = [];
      }
      const salesReps = await User.find({ _id: { $in: user.salesTeam } });
      if (salesReps && salesReps.length > 0) {
        await User.updateMany(
          { _id: { $in: user.salesTeam } },
          { $set: { assignedTo: null } }
        );
      }
    }

    if (user.role === updatedUser.role && assignedTo === null) {
      await User.updateOne(
        { _id: user.assignedTo },
        { $pull: { salesTeam: user._id } }
      );
    }

    if (user.role === updatedUser.role && salesTeam.length === 0) {
      const oldSaleReps = await User.find({ _id: { $in: user.salesTeam } });
      if (oldSaleReps) {
        await User.updateMany(
          { _id: { $in: user.salesTeam } },
          { $set: { assignedTo: null } }
        );
      }
    }

    if (
      (user.role === "Sales Representative" && updatedUser.role === "Admin") ||
      (user.role === "Sales Representative" && updatedUser.role === "Manager")
    ) {
      const manager = await User.findById(user.assignedTo);
      if (manager) {
        await User.updateOne(
          { _id: user.assignedTo },
          { $pull: { salesTeam: user._id } }
        );
      }
    }

    if (salesTeam && salesTeam.length > 0) {
      const salesReps = await User.find({
        _id: { $in: updatedUser.salesTeam },
      });
      await User.updateMany(
        { _id: { $in: updatedUser.salesTeam } },
        { $set: { assignedTo: updatedUser._id } }
      );
      const oldSalesReps = await User.find({ _id: { $in: user.salesTeam } });
      if (oldSalesReps && oldSalesReps.length > 0) {
        const salesRepsIds = new Set(
          salesReps.map((member) => (member._id ? member._id.toString() : null))
        );
        const oldSalesRepsIds = new Set(
          oldSalesReps.map((member) =>
            member._id ? member._id.toString() : null
          )
        );

        for (const oldId of oldSalesRepsIds) {
          if (!salesRepsIds.has(oldId)) {
            const oldSaleRepId = new mongoose.Types.ObjectId(oldId);
            const oldSaleRep = await User.findById(oldSaleRepId);
            if (oldSaleRep) {
              await User.updateOne(
                { _id: oldSaleRepId },
                { $set: { assignedTo: null } }
              );
            }
          }
        }
      }
    }

    if (assignedTo && assignedTo !== "") {
      const manager = await User.findById(updatedUser.assignedTo);
      await User.updateOne(
        { _id: updatedUser.assignedTo },
        { $push: { salesTeam: updatedUser._id } }
      );

      const oldManager = await User.findById(user.assignedTo);
      if (oldManager) {
        await User.updateOne(
          { _id: user.assignedTo },
          { $pull: { salesTeam: user._id } }
        );
      }
    }

    if (user.role !== updatedUser.role) {
      try {
        const admin = await User.findById(req.user.id);
        const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Role Update Notification</title>
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
        }
        .header {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            border-bottom: 2px solid #ddd;
        }
        .content {
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            border-top: 2px solid #ddd;
        }
        h1 {
            color: #333;
        }
        p {
            margin: 0 0 10px 0;
        }
        .details {
            margin: 20px 0;
        }
        .details dt {
            font-weight: bold;
        }
        .details dd {
            margin: 0 0 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Role Update Notification</h1>
        </div>
        <div class="content">
            <p>Dear ${user.name},</p>

            <p>We hope this message finds you well.</p>

            <p>We are writing to inform you that your role within the organization has been updated. Here are the details of the change:</p>

            <dl class="details">
                <dt>Previous Role:</dt>
                <dd>${user.role}</dd>
                <dt>New Role:</dt>
                <dd>${updatedUser.role}</dd>
                <dt>Details:</dt>
                <dd>Effective Date: ${formattedDate}</dd>
                <dd>Updated By: ${admin.name}</dd>
            </dl>

            <p>If you have any questions or need further clarification, please reach out to Admin's Contact Information.</p>
            <p>Email: ${admin.email}</p>
            <p>Contact: ${admin.contact}</p>

            <p>We appreciate your continued dedication and contribution to the team. Thank you for your attention to this update.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>CRM Application</p>
        </div>
    </div>
</body>
</html>
        `;
        sendEmail({
          email: user.email,
          subject: "User Role Updated",
          message,
        });
      } catch (error) {
        console.log(error.message)
      }
    }

    if (
      user.role === updatedUser.role &&
      arraysAreDifferent(user.salesTeam, updatedUser.salesTeam)
    ) {
      try {
        const admin = await User.findById(req.user.id);
        const manager = await user.populate("salesTeam");
        const updatedManager = await updatedUser.populate("salesTeam");
        const previousSalesTeamNames =
          manager.salesTeam.length > 0
            ? manager.salesTeam.map((rep) => rep.name).join(", ")
            : "None";
        const newSalesTeamNames =
          updatedManager.salesTeam.length > 0
            ? updatedManager.salesTeam.map((rep) => rep.name).join(", ")
            : "None";

        const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Team Update</title>
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
            background-color: #e0e0e0;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .contact-info {
            font-size: 0.9em;
            color: #555;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sales Team Update</h1>
        <p>Dear ${user.name},</p>
        
        <p>We hope you are doing well.</p>

        <p>We would like to inform you about an update regarding your sales team. Please review the details below:</p>

        <div class="details">
            <p><strong>Update Details:</strong></p>
            <p><strong>Update Type:</strong> Sales Team</p>
            <p><strong>Effective Date:</strong> ${formattedDate}</p>
            <p><strong>Updated By:</strong> ${admin.name}</p>
        </div>

        <div class="details">
            <p><strong>Changes:</strong></p>
            <p><strong>Previous Sales Team Members:</strong> ${previousSalesTeamNames}</p>
            <p><strong>New Sales Team Members:</strong> ${newSalesTeamNames}</p>
        </div>

        <p>Please ensure that you review these changes and adjust your plans accordingly. If you have any questions or need further clarification regarding this update, do not hesitate to reach out to Admin's Contact Information.</p>

        <div class="contact-info">
            <p><strong>Email:</strong> <a href="mailto:${admin.email}">${admin.email}</a></p>
            <p><strong>Contact:</strong> ${admin.contact}</p>
        </div>

        <p>Thank you for your attention to this matter and for your continued dedication to our team.</p>

        <p>Best regards,</p>
        <p>CRM Application</p>
    </div>
</body>
</html>
        `;
        sendEmail({
          email: user.email,
          subject: "User Sales Team Updated",
          message,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }

    if (
      (user.role === updatedUser.role && user?.assignedTo?.toString()) ||
      "" !== updatedUser?.assignedTo?.toString() ||
      ""
    ) {
      try {
        const admin = await User.findById(req.user.id);
        const previousManager = await User.findById(user.assignedTo);
        const preManagerName = previousManager ? previousManager.name : "None";
        const newManager = await User.findById(updatedUser.assignedTo);
        const newManagerName = newManager ? newManager.name : "None";
        const message = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Role Update Notification</title>
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
            background-color: #e0e0e0;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .contact-info {
            font-size: 0.9em;
            color: #555;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Role Update Notification</h1>
        <p>Dear ${user.name},</p>

        <p>We hope this message finds you well.</p>

        <p>We would like to inform you about an important update regarding your role within the company. Your assigned Manager has been updated. Please review the details below:</p>

        <div class="details">
            <p><strong>Update Details:</strong></p>
            <p><strong>Previous Manager:</strong> ${preManagerName}</p>
            <p><strong>New Manager:</strong> ${newManagerName}</p>
            <p><strong>Effective Date:</strong> ${formattedDate}</p>
        </div>

        <p><strong>What This Means for You:</strong></p>
        ${newManager ? `<p>New Point of Contact: ${newManager.name} will now be your primary point of contact for any support or guidance related to your tasks and responsibilities.</p>` : ""}

        <p><strong>Actions Required:</strong></p>
        <p>If you have any questions or need further information regarding this change, please do not hesitate to reach out to Admin's Contact Information or New Manager's Contact Information.</p>

        <div class="contact-info">
            <p><strong>Admin Email:</strong> <a href="mailto:${admin.email}">${admin.email}</a></p>
            <p><strong>Admin Contact:</strong> ${admin.contact}</p>
            ${newManager ? `<p><strong>New Manager Email:</strong> <a href="mailto:${newManager.email}">${newManager.email}</a></p>
            <p><strong>New Manager Contact:</strong> ${newManager.contact}</p>` : ""}
        </div>

        <p>Thank you for your attention to this matter and for your continued commitment to your role.</p>

        <p>Best regards,</p>
        <p>CRM Application</p>
    </div>
</body>
</html>
        `;
        sendEmail({
          email: user.email,
          subject: "User Manager Updated",
          message,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    }

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  }
);

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, contact } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, contact },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    updatedUser,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please enter all the fields", 400));
  }

  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Old Password", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = newPassword;
  await user.save({ runValidators: true });

  sendToken(user, 200, res);
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(User.find(), req.query).search().filter();
  const users = await apiFeatures.query;
  res.status(200).json({ success: true, users });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }
  if (user.role === "Manager") {
    const oldSaleReps = await User.find({ _id: { $in: user.salesTeam } });
    if (oldSaleReps) {
      await User.updateMany(
        { _id: { $in: user.salesTeam } },
        { $set: { assignedTo: null } }
      );
    }
  } else if (user.role === "Sales Representative") {
    await User.updateOne(
      { _id: user.assignedTo },
      { $pull: { salesTeam: user._id } }
    );
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter your email", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }

  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
        }
        p {
            margin: 0 0 10px 0;
        }
        .reset-link {
            display: block;
            margin: 20px 0;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .note {
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Your password reset token is:</p>
        <a href="${resetPasswordUrl}" class="reset-link">${resetPasswordUrl}</a>
        <p class="note">If you have not requested this email, please ignore it.</p>
    </div>
</body>
</html>`;

  try {
    sendEmail({
      email: user.email,
      subject: "FinalProject Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(`${error.message}`, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Token is invalid or has been expired. Please Try Again",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ runValidators: true });

  res.status(200).json({ success: true });
});

export const getUserDetailsAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }
  let salesTeamData = [];
  let managerData = null;

  if (Array.isArray(user.salesTeam) && user.salesTeam.length > 0) {
    const users = await User.find({ _id: { $in: user.salesTeam } });
    salesTeamData = users.map((user) => ({
      _id: user._id,
      salesRep: user.name,
    }));
  }
  if (user.assignedTo) {
    const manager = await User.findById(user.assignedTo);
    managerData = {
      _id: manager._id,
      manager: manager.name,
    };
  }
  res.status(200).json({ success: true, user, salesTeamData, managerData });
});

export const getUserDetailsManager = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }
    const manager = await User.findById({ _id: user.assignedTo });
    let managerName = manager.name;
    res.status(200).json({ success: true, user, managerName });
  }
);

export const getSalesTeamManager = catchAsyncErrors(async (req, res, next) => {
  const manager = await User.findById(req.user.id).populate("salesTeam");
  const salesRepIds = manager.salesTeam.map((rep) => rep._id);

  const apiFeatures = new ApiFeatures(
    User.find({ _id: { $in: salesRepIds } }),
    req.query
  )
    .search()
    .filter();
  const users = await apiFeatures.query;
  res.status(200).json({ success: true, users });
});

export const getManagerDetailsSalesRep = catchAsyncErrors(
  async (req, res, next) => {
    const salesRep = await User.findById(req.user.id);
    let manager = await User.findById(salesRep.assignedTo).populate("salesTeam");
    let managerData;
    if (!manager) {
      manager = null;
      managerData = null;
    }else {
        managerData = manager.salesTeam.map((rep) => ({
        salesRepName: rep.name,
      }));
    }
    res.status(200).json({ success: true, manager, managerData });
  }
);
