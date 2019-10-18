const express = require('express')
const router = express.Router()
const auth = require('../config/auth')


module.exports = function (passport) {
    router.get('/',auth.forwardAuthenticated,(req, res) => {
        res.render('page/login')
    })

    router.post('/',passport.authenticate('local-login',{
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }))

    return router
}