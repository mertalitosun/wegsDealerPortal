const express = require("express")
const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAccess");


router.post("/admin/commissionRate/edit/:id",isAuth,isAdmin,adminController.post_commissionRate_edit);
router.get("/admin/commissionRate/edit/:id",isAuth,isAdmin,adminController.get_commissionRate_edit);
router.get("/admin/commissionRates",isAuth,isAdmin,adminController.get_commissionRates);

//paket
router.post("/admin/package/edit/:id",isAuth,isAdmin,adminController.post_package_edit);
router.get("/admin/package/edit/:id",isAuth,isAdmin,adminController.get_package_edit);
router.post("/admin/package/delete/:id",isAuth,isAdmin,adminController.post_package_delete);
router.get("/admin/package/delete/:id",isAuth,isAdmin,adminController.get_package_delete);
router.post("/admin/package/create",isAuth,isAdmin,adminController.post_package_create);
router.get("/admin/package/create",isAuth,isAdmin,adminController.get_package_create);
router.get("/admin/packages",isAuth,isAdmin,adminController.get_packages);
//Bayi
router.get("/admin/user/details/:id",isAuth,isAdmin,adminController.get_user_details);
router.get("/admin/dealers",isAuth,isAdmin,adminController.get_dealers);
//Roles
router.post("/admin/role/edit/:id",isAuth,isAdmin,adminController.post_role_edit);
router.get("/admin/role/edit/:id",isAuth,isAdmin,adminController.get_role_edit);
router.post("/admin/role/delete/:id",isAuth,isAdmin,adminController.post_role_delete);
router.get("/admin/role/delete/:id",isAuth,isAdmin,adminController.get_role_delete);
router.post("/admin/role/create",isAuth,isAdmin,adminController.post_role_create);
router.get("/admin/role/create",isAuth,isAdmin,adminController.get_role_create);
router.get("/admin/roles",isAuth,isAdmin,adminController.get_roles);
router.get("/profile",isAuth,adminController.get_profile);

module.exports = router;