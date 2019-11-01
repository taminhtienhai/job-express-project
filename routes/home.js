const express = require('express')
const router = express.Router()
const query = require('../queries/table-queries')
const auth = require('../config/auth')
const { body, validationResult, matchedData } = require('express-validator')

/* GET home page. */
router.get('/', (req, res) => {
    res.render('home', {auth: req.user})
})

router.get('/all-job', (req, res) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    let arrays = []

    let params = {
        TableName: 'JobInfo'
    }

    // GET ALL INFO OF JOB
    query.scanItem(params, (err, dataJob) => {
        let length = dataJob.Items.length
        if (err)
            res.render('page/all-job', {input: {}, err: err, auth: req.user})
        else {
            // INSERT NECESSARY DATA FROM EMPLOYER
            let jobData = dataJob.Items.map(async (value, index) => {
                const postDate = new Date(value.date ? value.date : new Date())
                let param = {
                    TableName: 'Employer',
                    Key: {
                        'user': {S: value.user}
                    }
                }
                await query.getItem(param, (err, data) => {
                    if (err) {
                        console.log("Can't get One Item")
                    } else {
                        value.company_name = data.Item.company_name ? data.Item.company_name.S : 'no data'
                        value.logo = data.Item.logo ? data.Item.logo.S : 'no data'
                        value.benefits = data.Item.benefits ? data.Item.benefits.S : 'no data'
                        value.date = Math.round(Math.abs((today - postDate) / oneDay))
                        arrays.push(value)
                        if (index == length - 1) {
                            console.log(arrays)
                            res.render('page/all-job', {input: arrays, err: {}, auth: req.user})
                        }
                    }
                })
            })
        }
    })
})

router.get('/job-details', (req, res) => {
    let params = {
        TableName: 'JobInfo',
        Key: {
            'user': {S: req.query.user},
            'position': {S: req.query.job}
        }
    }
    query.getItem(params, (err, data) => {
        if (err)
            res.render('page/job-detail', {input: {}, auth: req.user, error: err})
        else {
            let vl = data.Item
            let param = {
                TableName: 'Employer',
                Key: {
                    'user': vl.user
                }
            }
            query.getItem(param, (err, dt) => {
                if (!err) {
                    vl.company_name = {S: dt.Item.company_name.S}
                    vl.logo = {S: dt.Item.logo.S}
                    vl.benefits = {S: dt.Item.benefits.S}

                    if (!vl.applicants)
                        return res.render('page/job-detail', {input: vl, isApply: false, auth: req.user, error: {}})
                    else{
                        vl.applicants.L.forEach(it => {
                            console.log(it)
                            if (!req.user)
                                return res.render('page/job-detail', {input: vl, isApply: false, auth: req.user, error: {}})
                            if (vl.applicants.L.length==0)
                                return res.render('page/job-detail', {input: vl, isApply: true, auth: req.user, error: {}})
                            if (it.M.applicant.S === req.user.user.S)
                                return res.render('page/job-detail', {input: vl, isApply: false, auth: req.user, error: {}})
                            else
                                return res.render('page/job-detail', {input: vl, isApply: true, auth: req.user, error: {}})
                        })
                    }

                    return res.render('page/job-detail', {input: vl, isApply: true, auth: req.user, error: {}})

                }
            })
        }
    })
})

router.get('/account',auth.ensureAuthenticated,(req, res) => {
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
    query.queryItem(params,(err,data)=>{
        if (err)
            res.render('page/seeker-personal-info',{ input: {},auth: req.user })
        else
            res.render('page/seeker-personal-info',{ input: data.Items[0], auth: req.user,error: {}})
    })
})

router.post('/save-account',[
    body('first_name').not().isEmpty().withMessage('Bạn chưa nhập họ')
        .matches('[a-zA-Z]+').withMessage('Bạn phải nhập chữ'),
    body('last_name').not().isEmpty().withMessage('Bạn chưa nhập tên')
        .matches('[a-zA-Z]+').withMessage('Bạn phải nhập chữ'),
    body('male'),
    body('birthday').not().isEmpty().withMessage('Bạn chưa chọn năm sinh'),
    body('city').not().isEmpty().withMessage('Bạn chưa chọn tỉnh thành')
],(req, res, next) => {
    let result = validationResult(req)
    let errors = result.mapped()
    console.log(errors)
    JSON.stringify(errors)=='{}'?next():res.render('page/seeker-personal-info',{ input: {}, error:errors, auth: req.user })
},(req, res) => {
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

    query.updateItem(params,(err,data)=>{
        if (err)
            res.render('page/seeker-personal-info',{ input: {}, error: err, auth: req.user })
        else{
            res.redirect('/account')
        }
    })
})

router.post('/', (req, res) => {
    res.redirect('/employer')
})

router.post('/apply-job', (req, res) => {

    let params = {
        TableName: 'JobInfo',
        Key: {
            user: req.body.user,
            position: req.body.pos
        },
        UpdateExpression: "set #apply=list_append(#apply, :apply)",
        ExpressionAttributeNames: {
            '#apply': 'applicants'
        },
        ExpressionAttributeValues: {
            ':apply': [{
                date: String(new Date()),
                applicant: req.user.user.S,
                classify: 0
            }]
        },
        ReturnValue: 'UPDATED_NEW'
    }

    query.updateItem(params, (err, data) => {
        if (err)
            res.send(false)
        else
            res.send(true)
    })
})

router.post('/logout', (req, res) => {
    req.logout()
    res.send("Success")
})

module.exports = router
