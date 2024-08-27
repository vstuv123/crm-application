import Customer from "../models/customerModel.js";
import Sales from "../models/salesModel.js";
import User from "../models/userModel.js";
import { catchAsyncErrors } from "./../middleware/catchAsyncErrors.js";
import ErrorHandler from "./../utils/ErrorHandler.js";
import SaleFeatures from "../utils/saleFeatures.js";

export const createSale = catchAsyncErrors(async (req, res, next) => {
  const {
    opportunity,
    value,
    customer,
    closedDate,
    productsSold,
    paymentTerms,
  } = req.body;

  const sale = await Sales.create({
    opportunity,
    value,
    customer,
    closedDate,
    productsSold,
    paymentTerms,
  });
  res.status(200).json({ success: true, message: "Sale Created Successfully" });
});

export const getAllSalesRep = catchAsyncErrors(async (req, res, next) => {
  const customers = await Customer.find({ assignedTo: req.user.id });
  const customerIds = customers.map((customer) => customer._id);

  const saleFeatures = new SaleFeatures(
    Sales.find({ customer: { $in: customerIds } }).populate("opportunity", "name").populate("customer", "name"),
    req.query
  )
    .filter()
    .value()
    .closedDate();

  const sales = await saleFeatures.query;
  const displaySales = sales.map((sale) => ({
    _id: sale._id,
    opportunity: sale.opportunity.name,
    value: sale.value,
    customer: sale.customer.name,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
    createdAt: sale.createdAt,
  }))
  
  res.status(200).json({ success: true, sales: displaySales });
});

export const getAllSalesManager = catchAsyncErrors(async (req, res, next) => {
  const manager = await User.findById(req.user.id).populate("salesTeam");
  const salesRepIds = manager.salesTeam.map((rep) => rep._id);
  const customers = await Customer.find({ assignedTo: { $in: salesRepIds } });
  const customerIds = customers.map((customer) => customer._id);
  const saleFeatures = new SaleFeatures(
    Sales.find({ customer: { $in: customerIds } }).populate("opportunity", "name").populate("customer", "name"),
    req.query
  )
    .filter()
    .value()
    .closedDate();

  const sales = await saleFeatures.query;

  const displaySales = sales.map((sale) => ({
    _id: sale._id,
    opportunity: sale.opportunity.name,
    value: sale.value,
    customer: sale.customer.name,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
    createdAt: sale.createdAt,
  }))
  res.status(200).json({ success: true, sales: displaySales });
});

export const getAllSalesAdmin = catchAsyncErrors(async (req, res, next) => {

  const saleFeatures = new SaleFeatures(
    Sales.find({}).populate("opportunity", "name").populate("customer", "name"),
    req.query
  )
    .filter()
    .value()
    .closedDate();

  const sales = await saleFeatures.query;

  const displaySales = sales.map((sale) => ({
    _id: sale._id,
    opportunity: sale.opportunity.name,
    value: sale.value,
    customer: sale.customer.name,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
    createdAt: sale.createdAt,
  }))
  res.status(200).json({ success: true, sales: displaySales });
});

export const getSingleSale = catchAsyncErrors(async (req, res, next) => {
  const sale = await Sales.findById(req.params.id).populate("opportunity", "name").populate("customer", "name");
  if (!sale) {
    return next(new ErrorHandler("Sale not found!", 404));
  }

  const saleData = {
    _id: sale._id,
    opportunity: sale.opportunity,
    value: sale.value,
    customer: sale.customer,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
    createdAt: sale.createdAt,
  }
  res.status(200).json({ success: true, sale: saleData });
});

export const updateSale = catchAsyncErrors(async (req, res, next) => {
  const {
    opportunity,
    value,
    customer,
    closedDate,
    productsSold,
    paymentTerms,
  } = req.body;
  const sale = await Sales.findById(req.params.id);
  if (!sale) {
    return next(new ErrorHandler("Sale not found!", 404));
  }
  await Sales.findByIdAndUpdate(
    req.params.id,
    { opportunity, value, customer, closedDate, productsSold, paymentTerms },
    { new: true }
  );
  res.status(200).json({ success: true, message: "Sale Updated Successfully" });
});

export const deleteSale = catchAsyncErrors(async (req, res, nex) => {
  const sale = await Sales.findById(req.params.id);
  if (!sale) {
    return next(new ErrorHandler("Sale not found!", 404));
  }

  await Sales.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Sale Deleted Successfully" });
});


export const salesOfSingleCustomer = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;
  const sales = await Sales.find({ customer: id }).populate("opportunity", "name").populate("customer", "name");

  const displaySales = sales.map((sale) => ({
    _id: sale._id,
    opportunity: sale.opportunity.name,
    value: sale.value,
    customer: sale.customer.name,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
  }))

  res.status(200).json({ success: true, sales: displaySales });
})


export const salesOfSingleRep = catchAsyncErrors(async (req, res, next) => {
  
  const { id } = req.body;
  const customers = await Customer.find({ assignedTo: id });
  const customerIds = customers.map((customer) => customer._id);
  const sales = await Sales.find({ customer: { $in: customerIds } }).populate("opportunity", "name").populate("customer", "name");

  const displaySales = sales.map((sale) => ({
    _id: sale._id,
    opportunity: sale.opportunity.name,
    value: sale.value,
    customer: sale.customer.name,
    closedDate: sale.closedDate,
    productsSold: sale.productsSold,
    paymentTerms: sale.paymentTerms,
  }))

  res.status(200).json({ success: true, sales: displaySales });
})