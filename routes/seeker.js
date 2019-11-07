const express = require('express')
const router = express.Router()
const query = require('../queries/table-queries')
const auth = require('../config/auth')
const {body, validationResult, matchedData} = require('express-validator')

router.get('/account', auth.ensureAuthenticated, (req, res) => {
    let params = {
        TableName: 'JobSeeker',
        KeyConditionExpression: "#user=:user",
        ExpressionAttributeNames: {
            '#user': 'user'
        },
        ExpressionAttributeValues: {
            ':user': req.user.user.S
        }
    }
    query.queryItem(params, (err, data) => {
        if (err)
            res.render('page/seeker-personal-info', {input: {}, auth: req.user})
        else
            res.render('page/seeker-personal-info', {input: data.Items[0], auth: req.user, error: {}})
    })
})

router.get('/job-notification', (req, res) => {
    let param = (tableName, email) => {
        return {
            TableName: tableName,
            Key: {
                'user': {S: email}
            }
        }
    }

    query.getItem(param('JobSeeker', req.user.user.S), (err, data) => {
        if (!err) {
            let params = (tableName, email) => {
                return {
                    TableName: tableName,
                    KeyConditionExpression: "#user=:user",
                    ExpressionAttributeNames: {
                        '#user': 'user'
                    },
                    ExpressionAttributeValues: {
                        ':user': email
                    }
                }
            }
            if (data.Item.company_apply) {
                let result = data.Item.company_apply.L.map(function (it,index) {
                    return new Promise(resolve => {
                        query.getItem(param('Employer', it.S), (err, result) => {
                            if (!err)
                                query.queryItem(params('JobInfo', it.S), (err, dt) => {
                                    let rs = dt.Items.filter(function (i) {
                                        return i.applicants.filter(function (item) {
                                            return item.applicant === req.user.user.S
                                        }).length != 0 ? true : false
                                    })
                                    if (rs.length === 0){
                                        let deleteParams = (tableName, key, expression)=>{
                                            return {
                                                TableName: tableName,
                                                Key: key,
                                                UpdateExpression: expression,
                                                ReturnValue: 'UPDATED_NEW'
                                            }
                                        }
                                        query.updateItem(deleteParams(
                                            'JobSeeker',
                                            { user: req.user.user.S },
                                            "remove company_apply["+index+"]"
                                        ),(err,data)=>{})
                                        resolve(null)
                                    } else {
                                        let rlt = rs.map(function (value) {
                                            console.log(value)
                                            return {
                                                position: value.position,
                                                location: value.applicants.filter(function (vl) {
                                                    return vl.applicant === req.user.user.S
                                                }),
                                                company_name: result.Item.company_name.S
                                            }
                                        })
                                        resolve(rlt[0])
                                    }
                                })
                        })
                    })
                })

                Promise.all(result).then(rs=>{
                    console.log(rs)
                    res.render('page/job-notification', {input: rs, auth: req.user})
                })
            } else
                res.render('page/job-notification', {input: [], auth: req.user})

        }
    })

})

router.post('/save-account', [
    body('first_name').not().isEmpty().withMessage('Bạn chưa nhập họ')
        .matches('[a-zA-Z ]+').withMessage('Bạn phải nhập chữ'),
    body('last_name').not().isEmpty().withMessage('Bạn chưa nhập tên')
        .matches('[a-zA-Z ]+').withMessage('Bạn phải nhập chữ'),
    body('male'),
    body('birthday').not().isEmpty().withMessage('Bạn chưa chọn năm sinh'),
    body('city').not().isEmpty().withMessage('Bạn chưa chọn tỉnh thành')
], (req, res, next) => {
    let result = validationResult(req)
    let errors = result.mapped()
    console.log(errors)
    JSON.stringify(errors) == '{}' ? next() : res.render('page/seeker-personal-info', {
        input: {},
        error: errors,
        auth: req.user
    })
}, (req, res) => {
    const input = matchedData(req)

    let params = {
        TableName: 'JobSeeker',
        Key: {
            'user': req.user.user.S
        },
        UpdateExpression: "set first_name=:first, last_name=:last, sex=:sex, birthday=:birth, city=:city",
        ExpressionAttributeValues: {
            ":first": input.first_name,
            ":last": input.last_name,
            ":sex": input.male,
            ":birth": input.birthday,
            ":city": input.city
        },
        ReturnValue: "UPDATED_NEW"
    }

    query.updateItem(params, (err, data) => {
        if (err)
            res.render('page/seeker-personal-info', {input: {}, error: err, auth: req.user})
        else {
            res.redirect('/seeker/account')
        }
    })
})


module.exports = router