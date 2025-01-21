const express       = require('express')
const router        = express.Router();
const checkToken   = require("../../../../middleware/checkToken")
const {listUsers}        = require('../../../../app/controllers/PeopleController')


router.get('/list-users', checkToken, listUsers);



module.exports = router;
