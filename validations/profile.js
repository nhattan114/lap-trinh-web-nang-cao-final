const { check } = require('express-validator')
const connect = require('../config/db')


var allowedMimeTypes= ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
const profilePostCMNDValidation = [
    check('images').custom((value, { req }) => {
        console.log(allowedMimeTypes)
        console.log(req.files[0].mimetype)
        console.log(allowedMimeTypes.includes(req.files[0].mimetype))
        console.log(req.files[1].mimetype)
        console.log(allowedMimeTypes.includes(req.files[1].mimetype))
        if (allowedMimeTypes.includes(req.files[0].mimetype) === false ||
         allowedMimeTypes.includes(req.files[1].mimetype) === false) {
            throw new Error("Profile Img is required")
        };
        return true;
    }),
    
]



module.exports = {
    profilePostCMNDValidation,

}