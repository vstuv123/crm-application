import express from "express";
import { isAuthorized, isAuthenticatedUser } from './../middleware/auth.js';
import { createSale, deleteSale, getAllSalesAdmin, getAllSalesManager, getAllSalesRep, getSingleSale, salesOfSingleCustomer, salesOfSingleRep, updateSale } from "../controllers/salesController.js";

const router = express.Router();

router.route("/sales/create-sale").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), createSale);

router.route("/sales/get-all-sales").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllSalesRep)

router.route("/manager/get-all-sales").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getAllSalesManager);

router.route("/manager/sales/sales-rep").post(isAuthenticatedUser, isAuthorized("Admin", "Manager"), salesOfSingleRep);

router.route("/admin/get-all-sales").get(isAuthenticatedUser, isAuthorized("Admin"), getAllSalesAdmin);

router.route("/get-single-sale/:id").get(isAuthenticatedUser, getSingleSale);

router.route("/sales/update-sale/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), updateSale);

router.route("/sales/delete-sale/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), deleteSale);

router.route("/sales/customer-sales").post(isAuthenticatedUser, salesOfSingleCustomer);


export default router;