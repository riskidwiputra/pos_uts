const express         = require('express')
const {register,login, logout,refresh_token}  = require("../../app/controllers/AuthController")
const registerValidate  = require("../../app/validators/validateRegister")
const verifyToken   = require("../../middleware/verifyToken")

const router            = express.Router();


router.post("/register",  registerValidate, register);
router.post("/login",       login);
router.post("/refresh-token",       refresh_token);
router.post('/logout',     verifyToken,logout);

module.exports = router;
