const express = require("express")
const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middlewares/auth");


//Müşteri
router.post("/admin/customer/edit/:id",isAuth,adminController.post_customer_edit);
router.get("/admin/customer/edit/:id",isAuth,adminController.get_customer_edit);
router.post("/admin/customer/create/:id",isAuth,adminController.post_customer_create);
router.get("/admin/customer/create/:id",isAuth,adminController.get_customer_create);

//Bayi
router.post("/admin/dealer/edit/:id",isAuth,adminController.post_dealer_edit);
router.get("/admin/dealer/edit/:id",isAuth,adminController.get_dealer_edit);
router.post("/admin/dealer/delete/:id",isAuth,adminController.post_dealer_delete);
router.get("/admin/dealer/delete/:id",isAuth,adminController.get_dealer_delete);


router.post("/admin/dealer/create/:id",isAuth,adminController.post_admin_dealer_create); //Bayi Kayıt - Admin
router.get("/admin/dealer/create/:id",isAuth,adminController.get_dealer_create);         //Bayi Kayıt - Admin


router.post("/admin/:firstName/dealer/create/:id",isAuth,adminController.post_dealer_create); //Bayi Kayıt - Dealer
router.get("/admin/:firstName/dealer/create/:id",isAuth,adminController.get_dealer_create);  //Bayi Kayıt - Dealer

router.get("/admin/dealer/details/:id",isAuth,adminController.get_dealer_details);
router.get("/admin/dealers",isAuth,adminController.get_dealers);

router.get("/profile",isAuth,adminController.get_profile);
router.get("/",isAuth,adminController.get_index);


module.exports = router;