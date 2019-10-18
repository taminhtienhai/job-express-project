const express = require('express')
const router = express.Router()
const { body, validationResult, matchedData } = require('express-validator')

module.exports = function (passport) {
    /** GET METHOD **/
    router.get('/',(req, res) => {
        res.render('page/directional')
    })

    router.get('/employer',(req, res) => {
        res.render('page/employer-register',{flash: req.flash('signupMess'),e: {}})
    })

    router.post('/employer',[
        body('email').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .isEmail().withMessage('Email bạn đã nhập không hợp lệ'),
        body('password').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .matches('[a-zA-Z0-9]{6,18}').withMessage('Mật khẩu phải chứa từ 6 đến 12 ký tự'),
        body('confirm').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu nhập lại không khớp')
            }
            return true
        }),
        body('company').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .trim().isLength({max:20}).withMessage('Bạn đã nhập quá 20 ký tự'),
        body('pro').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu'),
        body('city').not().isEmpty().withMessage('Bạn chưa chọn dữ liệu'),
        body('tel').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .matches('0[0-9]{8,9}').withMessage('Số điện thoại bắt đầu với số 0')
    ],(req, res, next) => {
        let result = validationResult(req)
        let errors = result.mapped() // get json errors
        // CONDITION FOR NEXT ACTION
        JSON.stringify(errors)=='{}'?next() : res.render('page/employer-register',{flash: req.flash('signupMess'),e: errors})
    },passport.authenticate('local-signup-employer',{
        successRedirect : '/employer',
        failureRedirect : '/register/employer',
        failureFlash : true
    }))

    router.get('/seeker',(req, res) => {
        res.render('page/seeker-register')
    })

    return router
}