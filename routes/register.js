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

    router.get('/seeker',(req, res) => {
        res.render('page/seeker-register',{flash: req.flash('seekerSignup'),e: {}})
    })

    router.post('/employer',[
        body('email').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .isEmail().withMessage('Email bạn đã nhập không hợp lệ'),
        body('password').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .isLength({min: 6, max: 18}).withMessage('Mật khẩu phải chứa từ 6 đến 18 ký tự'),
        body('confirm').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu nhập lại không khớp')
            }
            return true
        }),
        body('company').not().isEmpty().withMessage('Bạn chưa nhập tên công ty')
            .trim().isLength({max:20}).withMessage('Bạn đã nhập quá 20 ký tự'),
        body('pro').not().isEmpty().withMessage('Bạn chưa chọn công việc chuyên môn'),
        body('city').not().isEmpty().withMessage('Bạn chưa chọn thành phố'),
        body('tel').not().isEmpty().withMessage('Bạn chưa nhập số điện thoại')
            .matches('[0-9]{8,12}').withMessage('Số điện thoại phải từ 8 đến 12 số')
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

    router.post('/seeker',[
        body('first_name').not().isEmpty().withMessage('Bạn chưa nhập họ')
            .isString().withMessage('Vui lòng chỉ nhập chữ'),
        body('last_name').not().isEmpty().withMessage('Bạn chưa nhập tên')
            .isString().withMessage('Vui lòng chỉ nhập chữ'),
        body('email').not().isEmpty().withMessage('Bạn chưa nhập email')
            .isEmail().withMessage("Email của bạn không hợp lệ VD: abc@gmail.com"),
        body('password').not().isEmpty().withMessage('Bạn chưa nhập mật khẩu')
            .matches('[a-zA-Z0-9]{6,18}').withMessage('Mật khẩu phải chứa từ 6 đến 12 ký tự'),
        body('confirm').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Mật khẩu nhập lại không khớp')
                }
                return true
            })
    ],(req, res, next) => {
        let result = validationResult(req)
        let errors = result.mapped() // get json errors
        // CONDITION FOR NEXT ACTION
        JSON.stringify(errors)=='{}'?next() : res.render('page/seeker-register',{flash: req.flash('seekerSignup'),e: errors})
    },passport.authenticate('local-signup-seeker',{
        successRedirect : '/',
        failureRedirect : '/register/seeker',
        failureFlash : true
    }))

    return router
}