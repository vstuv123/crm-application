import express from 'express';
import { isAuthenticatedUser, isAuthorized } from '../middleware/auth.js';
import { archiveOpportunity, createOpportunity, deleteOpportunityPermanently, getAllArchivedOpportunities, getAllNonArchivedOpportunities, getAllOpportunitiesOfSingleLead, getSingleOpportunity, unArchiveOpportunity, updateOpportunity } from '../controllers/opportunityController.js';

const router = express.Router();

router.route("/sales/create-opportunity").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), createOpportunity);

router.route("/sales/un-archived-opportunities").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllNonArchivedOpportunities);

router.route("/sales/archived-opportunities").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllArchivedOpportunities);

router.route("/sales/single-opportunity/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getSingleOpportunity);

router.route("/sales/lead-opportunities").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllOpportunitiesOfSingleLead);

router.route("/sales/update-opportunity/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), updateOpportunity);

router.route("/sales/archive-opportunity/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), archiveOpportunity);

router.route("/sales/un-archive-opportunity/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), unArchiveOpportunity);

router.route("/sales/delete-opportunity/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), deleteOpportunityPermanently);

export default router;