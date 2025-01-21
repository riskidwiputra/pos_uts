const express = require('express')
const router = express.Router();

router.get('/', (req,res) =>{
    res.render('admin/sign-in', {
        layout : false,
        title : "Login",
        messages: req.flash('msg')
    });
});


module.exports = router;
