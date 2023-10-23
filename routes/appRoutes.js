const router = require("express").Router();

const { loginMethod } = require("../controller/appController.js");

/** HTTP Reqeust */
// router.post("/user/signup", signup);
// router.post("/product/getbill", getbill);
router.post("/login", loginMethod);

module.exports = router;
