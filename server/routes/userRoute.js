import express from 'express';
import { isAuthorized, isAuthenticatedUser } from '../middleware/auth.js';
import { createNewUser, deleteUser, forgotPassword, getAllUsers, getManagerDetailsSalesRep, getSalesTeamManager, getUserDetailsAdmin, getUserDetailsManager, loginUser, logoutUser, resetPassword, updatePassword, updateUserProfile, updateUserProfileAdmin } from '../controllers/userController.js';

const router = express.Router();

router.route("/admin/create").post(isAuthenticatedUser, isAuthorized("Admin"),createNewUser);
router.route("/admin/update-profile/:id").put(isAuthenticatedUser, isAuthorized("Admin"), updateUserProfileAdmin);
router.route("/admin/delete-user/:id").delete(isAuthenticatedUser, isAuthorized("Admin"), deleteUser);

router.route("/admin/users").get(isAuthenticatedUser, isAuthorized("Admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, isAuthorized("Admin"), getUserDetailsAdmin);

router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedUser, logoutUser);
router.route("/update-profile").put(isAuthenticatedUser, updateUserProfile);
router.route("/update-password").put(isAuthenticatedUser, updatePassword);

router.route("/manager/user-details/:id").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getUserDetailsManager);

router.route("/sales/manager-details").get(isAuthenticatedUser, isAuthorized("Admin", "Sales Representative"), getManagerDetailsSalesRep);

router.route("/manager/users").get(isAuthenticatedUser, isAuthorized("Admin", "Manager"), getSalesTeamManager);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


export default router;