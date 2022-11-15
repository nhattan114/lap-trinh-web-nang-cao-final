const { check } = require('express-validator')
const connect = require('../config/db')


const validatorPostDeposit = [
    check('phone_receiver')
    .exists().withMessage("Please enter phone receiver")
    .notEmpty().withMessage("Phone_receiver can not be empty")
    ,

    check('money')
    .exists().withMessage("Please enter money to deposit")
    .notEmpty().withMessage("Money can not be empty")
    ,
    
    check('note')
    .exists().withMessage("Please enter note for receiver")
    .notEmpty().withMessage("Note can not be empty")
    ,
    
]

module.exports = {
    validatorPostDeposit,

}