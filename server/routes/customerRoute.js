import express from 'express';
import { isAuthenticatedUser, isAuthorized } from '../middleware/auth.js';
import { archiveCustomer, createCustomer, deleteCustomerPermanently, getAllArchivedCustomersAdmin, getAllArchivedCustomersManager, getAllArchivedCustomersSalesRep, getAllNonArchivedCustomersAdmin, getAllNonArchivedCustomersManager, getAllNonArchivedCustomersSalesRep, getAllPendingCustomersManager, getCustomersOfSingleSaleRep, getSingleCustomer, unArchiveCustomer, updateCustomerByManager, updateCustomerBySalesRep, updatePendingStatusManager } from '../controllers/customerController.js';


const router = express.Router();

router.route("/sales/create-customer").post(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), createCustomer);

router.route("/manager/create-customer").post(isAuthenticatedUser, isAuthorized("Admin", "Manager"), createCustomer);

router.route("/sales/single-customer/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getSingleCustomer);

router.route("/admin/single-customer/:id").get(isAuthenticatedUser, getSingleCustomer);

router.route("/manager/single-customer/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getSingleCustomer);

router.route("/sales/non-archived-customers").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllNonArchivedCustomersSalesRep);

router.route("/admin/non-archived-customers").get(isAuthenticatedUser, isAuthorized("Admin"), getAllNonArchivedCustomersAdmin);

router.route("/sales/archived-customers").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getAllArchivedCustomersSalesRep);

router.route("/admin/archived-customers").get(isAuthenticatedUser, isAuthorized("Admin"), getAllArchivedCustomersAdmin);

router.route("/sales/archive-customer/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), archiveCustomer);

router.route("/sales/unarchive-customer/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), unArchiveCustomer);

router.route("/sales/delete-customer/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), deleteCustomerPermanently);

router.route("/sales/update-customer/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), updateCustomerBySalesRep);

router.route("/manager/non-archived-customers").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getAllNonArchivedCustomersManager);

router.route("/manager/archived-customers").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getAllArchivedCustomersManager);

router.route("/manager/pending-customers").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getAllPendingCustomersManager);

router.route("/manager/update-pending-customer/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Manager"),updatePendingStatusManager);

router.route("/manager/delete-customer/:id").delete(isAuthenticatedUser, isAuthorized("Admin", "Manager"), deleteCustomerPermanently);

router.route("/manager/update-customer/:id").put(isAuthenticatedUser, isAuthorized("Admin", "Manager"),updateCustomerByManager);

router.route("/manager/get-customers/sales-rep").post(isAuthenticatedUser, isAuthorized("Admin", "Manager"),getCustomersOfSingleSaleRep);


export default router