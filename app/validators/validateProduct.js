
const {
    body,
  } = require('express-validator');

module.exports = [
  body('name')
  .notEmpty().withMessage('Name is required')
  .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
body('price')
  .notEmpty().withMessage('Price is required')
  .isNumeric().withMessage('Price must be a number')
  .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
body('description')
  .notEmpty().withMessage('Description is required'),
]