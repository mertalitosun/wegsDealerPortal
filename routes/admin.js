const express = require("express")
const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middlewares/auth");
const {isAdmin,isModerator} = require("../middlewares/isAccess");

router.post("/admin/customer/addOrder/:customerCode",isAuth,isAdmin,adminController.post_add_order);
router.get("/admin/customer/addOrder/:customerCode",isAuth,isAdmin,adminController.get_add_order);
//Müşteri
router.post("/admin/customer/edit/:customerCode/:purchaseCode",isAuth,isAdmin,adminController.post_customer_edit);
router.get("/admin/customer/edit/:customerCode/:purchaseCode",isAuth,isAdmin,adminController.get_customer_edit);
router.post("/admin/customer/create/:dealerCode",isAuth,isAdmin,adminController.post_customer_create);
router.get("/admin/customer/create/:dealerCode",isAuth,isAdmin,adminController.get_customer_create);

//Bayi
router.post("/admin/dealer/edit/:dealerCode",isAuth,isAdmin,adminController.post_dealer_edit);
router.get("/admin/dealer/edit/:dealerCode",isAuth,isAdmin,adminController.get_dealer_edit);
router.post("/admin/dealer/delete/:id",isAuth,isAdmin,adminController.post_dealer_delete);
router.get("/admin/dealer/delete/:id",isAuth,isAdmin,adminController.get_dealer_delete);


router.post("/admin/dealer/create/:id",isAuth,isAdmin,adminController.post_admin_dealer_create); //Bayi Kayıt - Admin
router.get("/admin/dealer/create/:id",isAuth,isAdmin,adminController.get_dealer_create);         //Bayi Kayıt - Admin


router.post("/admin/:firstName/dealer/create/:dealerCode",isAuth,isAdmin,adminController.post_dealer_create); //Bayi Kayıt - Dealer
router.get("/admin/:firstName/dealer/create/:dealerCode",isAuth,isAdmin,adminController.get_dealer_create);  //Bayi Kayıt - Dealer

router.get("/admin/dealer/details/:dealerCode",isAuth,adminController.get_dealer_details);
router.get("/admin/dealers",isAuth,adminController.get_dealers);

router.get("/profile",isAuth,adminController.get_profile);
router.get("/",isAuth,adminController.get_index);


module.exports = router;