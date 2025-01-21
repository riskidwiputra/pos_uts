const {
  body,
  check
} = require('express-validator');
const User = require('../models').Users;

module.exports = [
  check('email').custom( async (value) => {
      const duplikat = await User.findOne({where : {email : value}});
      if (duplikat) {
          throw new Error("Email Anda Telah digunakan");
      }
      return true;
  }).exists().withMessage("email wajib diisi"),
  check('fullname').exists().withMessage("fullname wajib diisi"),
  check("password").isLength({min: 8 }).withMessage("Password Wajib 8 karakter"),
  check("password_confirmation").custom( async (value,{req}) => {
      if (value != req.body.password_confirmation ) {
          throw new Error("password dan confirm password tidak sama");
      }
      return true;
  }),
]

