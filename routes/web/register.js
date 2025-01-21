const express = require('express')
const router = express.Router();

router.get('/', (req,res) =>{

    const baseUrl = process.env.BASE_URL;
    res.render('admin/sign-up',{
        layout : false,
        title : "Register",
        baseUrl: baseUrl,
        messages: req.flash('msg')
    });

});


module.exports = router;
