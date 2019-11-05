const express = require('express')
const router = express.Router()
const query = require('../queries/table-queries')
const {body, validationResult, matchedData} = require('express-validator')
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
    res.render('page/employer-home', {input: req.user})
})

router.get('/recruitment-package', (req, res) => {
    res.render('page/recruitment-package')
})

router.get('/account', (req, res) => {
    let params = {
        TableName: 'Employer',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(params, (err, data) => {
        if (err)
            res.render('page/employer-personal-info', {e: err, error: {}})
        else
            res.render('page/employer-personal-info', {input: data.Item, error: {}})
    })
})

router.get('/account-data', (req, res) => {
    let params = {
        TableName: 'Employer',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(params, (err, data) => {
        if (err)
            res.send("Failed")
        else
            res.send(data.Item)
    })

})

router.post('/', (req, res) => {
    res.redirect('/')
})

router.post('/seeker-info', (req, res) => {
    let params = {
        TableName: 'JobSeeker',
        Key: {
            'user': {S: req.body.user}
        }
    }

    query.getItem(params, (err, data) => {
        if (err)
            res.send({err: err})
        else
            res.send(data.Item)
    })
})

router.post('/save-account', [
    body('company_name').not().isEmpty().withMessage("Bạn phải nhập tên công ty"),
    body('address').not().isEmpty().withMessage("Bạn phải nhập địa chỉ"),
    body('pro').not().isEmpty().withMessage("Bạn phải chọn chuyên ngành"),
    body('contact').not().isEmpty().withMessage("Bạn phải nhập liên hệ"),
    body('phone').not().isEmpty().withMessage("Bạn phải nhập số điện thoại"),
    body('benefit').not().isEmpty().withMessage("Bạn phải nhập phúc lợi của công ty"),
    body('basic_info')
], (req, res, next) => {
    let result = validationResult(req)
    let errors = result.mapped()
    console.log(errors)
    JSON.stringify(errors) == '{}' ? next() : res.render('page/employer-personal-info', {
        input: req.user,
        error: errors
    })
}, (req, res) => {
    const input = matchedData(req)

    let params = {
        TableName: 'Employer',
        Key: {
            'user': req.user.user.S
        },
        UpdateExpression: "set company_name=:name, job_profess=:pro, address=:address, phone=:phone, contact_name=:contact," +
            "benefits=:benefits, primary_info=:basic",
        ExpressionAttributeValues: {
            ":name": input.company_name,
            ":pro": input.pro,
            ":address": input.address,
            ":phone": input.phone,
            ":contact": input.contact,
            ":benefits": input.benefit,
            ":basic": input.basic_info
        },
        ReturnValue: "UPDATED_NEW"
    }

    query.updateItem(params, (err, data) => {
        if (err)
            res.render('page/employer-personal-info', {input: {}, error: err})
        else {
            res.redirect('/employer/account')
        }
    })
})

router.post('/pass-change', [
    body('old').not().isEmpty().withMessage('Bạn chưa nhập mật khẩu cũ'),
    body('news').not().isEmpty().withMessage('Bạn chưa nhập mật khẩu'),
    body('confirm').not().isEmpty().withMessage('Bạn chưa nhập dữ liệu')
        .custom((value, {req}) => {
            if (value !== req.body.news)
                throw new Error('Mật khẩu nhập lại không khớp')
            else
                return true
        })
], (req, res, next) => {
    let result = validationResult(req)
    let errors = result.mapped()
    let param = {
        TableName: 'Account',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(param, (err, data) => {
        if (bcrypt.compareSync(req.body.old, data.Item.password.S) === false) {
            errors.old = { msg: 'Mật khẩu cũ không đúng' }
        }

        JSON.stringify(errors) === '{}'?next():res.send(errors)
    })
}, (req, res) => {
    const input = matchedData(req)
    const newpass = bcrypt.hashSync(input.news, 10)

    let params = {
        TableName: 'Account',
        Key: {
            'user': req.user.user.S
        },
        UpdateExpression: "set password=:pass",
        ExpressionAttributeValues: {
            ':pass': newpass
        }
    }

    query.updateItem(params, (err, data) => {
        if (!err)
            res.send({})
    })
})

router.post('/logout', (req, res) => {
    req.logout()
    res.send("success")
})

module.exports = router