const express = require('express')
const router = express.Router()
const auth = require('../config/auth')


module.exports = function (passport) {
    router.get('/',(req, res) => {
        res.render('page/login')
    })

    router.get('/success',auth.ensureAuthenticated,(req, res) => {
        res.render('page/login-success',{ input: req.user})
    })

    router.post('/',passport.authenticate('local-login',{
        successRedirect : '/login/success',
        failureRedirect : '/login',
        failureFlash : true
    }))

    return router
}