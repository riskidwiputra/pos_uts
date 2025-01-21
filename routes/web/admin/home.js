const express       = require('express')
const router        = express.Router();
const checkToken   = require("../../../middleware/checkToken")
const {admin}        = require('../../../app/controllers/AdminController')


router.get('/admin', checkToken, admin);



module.exports = router;
