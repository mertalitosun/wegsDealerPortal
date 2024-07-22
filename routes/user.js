const express = require("express")
const router = express.Router();
const userController = require("../controller/user");
const isAuth = require("../middlewares/auth");

router.post("/user/customer/create",isAuth,userController.post_customer_create);
router.get("/user/customer/create",isAuth,userController.get_customer_create);
router.get("/user/customers",isAuth,userController.get_customers);
router.get("/",userController.get_index);

module.exports = router;