import express from 'express';
import { isAuthorized, isAuthenticatedUser } from './../middleware/auth.js';
import { createCustomerLog, deleteInteraction, getAllInteractions, getInteractionDetails, interactionLogsOfCustomer, updateInteraction } from '../controllers/cutomerLogController.js';

const router = express.Router();

router.route("/sales/create-interaction").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), createCustomerLog);

router.route("/sales/get-all-interactions").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllInteractions);

router.route("/sales/get-single-interaction/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getInteractionDetails);

router.route("/sales/update-interaction/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), updateInteraction);

router.route("/sales/delete-interaction/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), deleteInteraction);

router.route("/sales/interactions-customer").post(isAuthenticatedUser, interactionLogsOfCustomer);

export default router;