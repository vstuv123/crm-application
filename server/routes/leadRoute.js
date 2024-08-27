import express from 'express';
import { isAuthenticatedUser, isAuthorized } from '../middleware/auth.js';
import { archiveLead, createLead, deleteLeadPermanently, getAllArchivedLeadsManager, getAllArchivedLeadsSalesRep, getAllNonArchivedLeadsAdmin, getAllNonArchivedLeadsManager, getAllNonArchivedLeadsSalesRep, getAllPendingLeadsManager, getLeadsOfSingleSaleRep, getSingleLead, unArchiveLead, updateLeadByManager, updateLeadBySalesRep, updatePendingStatusManager } from '../controllers/leadController.js';
const router = express.Router();

router.route("/manager/create-lead").post(isAuthenticatedUser, isAuthorized("Admin", "Manager"), createLead);
router.route("/manager/single-lead/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getSingleLead);

router.route("/sales/create-lead").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), createLead);

router.route("/sales/single-lead/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getSingleLead);

router.route("/sales/non-archived").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllNonArchivedLeadsSalesRep);

router.route("/admin/non-archived").get(isAuthenticatedUser, isAuthorized("Admin"), getAllNonArchivedLeadsAdmin);

router.route("/sales/archived").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllArchivedLeadsSalesRep);

router.route("/sales/archive-lead/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), archiveLead);

router.route("/sales/unarchive-lead/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), unArchiveLead);

router.route("/sales/delete-lead/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), deleteLeadPermanently);

router.route("/sales/update-lead/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), updateLeadBySalesRep);

router.route("/manager/non-archived").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getAllNonArchivedLeadsManager);

router.route("/manager/archived").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"),getAllArchivedLeadsManager);

router.route("/manager/pending").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"),getAllPendingLeadsManager);

router.route("/manager/update-pending/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Manager"),updatePendingStatusManager);

router.route("/manager/update-lead/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Manager"),updateLeadByManager);

router.route("/manager/get-leads/sales-rep").post(isAuthenticatedUser, isAuthorized("Admin", "Manager"),getLeadsOfSingleSaleRep);





export default router