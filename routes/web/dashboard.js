const express       = require('express')
const router        = express.Router();
const {home}        = require('../../app/controllers/HomeController')

router.get('/', home);

module.exports = router;