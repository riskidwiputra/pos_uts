const express           = require('express');
const router            = express.Router();

//Back
const authRouter        = require("./api/auth.js")
const productRouter     = require("./api/product.js")
const SaleRouter        = require("./api/sale.js")

// Front
const dashboardRouter   = require("./web/dashboard")
const loginRouter       = require("./web/login.js")
const registerRouter    = require("./web/register.js")
const adminRouter       = require("./web/admin/home")
const peopleRouter       = require("./web/admin/people/users.js")
const productRouterFront       = require("./web/admin/product/product.js")

// api
router.use("/api",      authRouter);
router.use("/api",      productRouter);
router.use("/api",      SaleRouter);


// Front 
router.use("/",         dashboardRouter);
router.use("/login",    loginRouter);
router.use("/register", registerRouter);
router.use("/",         adminRouter);

router.use("/admin",    peopleRouter);
router.use("/admin",    productRouterFront);
module.exports = router;
