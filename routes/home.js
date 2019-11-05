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

    // GET ALL INFO OF JOB
    query.scanItem({ TableName: "JobInfo" }, (err, dataJob) => {
        let length = dataJob.Items.length
        if (err)
            res.render('page/all-job', {input: {}, err: err, auth: req.user})
        else {
            // INSERT NECESSARY DATA FROM EMPLOYER
            let jobData = dataJob.Items.map((value) => {
                const postDate = new Date(value.date ? value.date : new Date())
                let param = {
                    TableName: 'Employer',
                    Key: {
                        'user': {S: value.user}
                    }
                }
                return new Promise(resolve => {
                    query.getItem(param, (err, data) => {
                        if (err) {
                            console.log("Can't get One Item")
                        } else {
                            value.company_name = data.Item.company_name ? data.Item.company_name.S : 'no data'
                            value.logo = data.Item.logo ? data.Item.logo.S : 'no data'
                            value.benefits = data.Item.benefits ? data.Item.benefits.S : 'no data'
                            value.date = Math.round(Math.abs((today - postDate) / oneDay))
                            arrays.push(value)
                            resolve(value)
                        }
                    })
                })

            })
            Promise.all(jobData).then(function (completed) {
                res.render('page/all-job', {input: completed, err: {}, auth: req.user})
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

                    let isApply = true

                    // KIỂM TRA XEM BẠN ĐÃ CÓ TRONG DANH SÁCH NGƯỜI NỘP ĐƠN HAY CHƯA
                    if (vl.applicants)
                        vl.applicants.L.forEach(it => {
                            if (req.user)
                                if (it.M.applicant.S === req.user.user.S)
                                    isApply = false
                        })

                    res.render('page/job-detail', {input: vl, isApply: isApply, auth: req.user, error: {}})

                }
            })
        }
    })
})

router.post('/', (req, res) => {
    res.redirect('/employer')
})

// NỘP ĐƠN XIN VIỆC
router.post('/apply-job',auth.ensureAuthenticated, (req, res) => {

    let params = {
        TableName: 'JobInfo',
        Key: {
            user: req.body.user,
            position: req.body.pos
        },
        UpdateExpression: "set #apply=list_append(if_not_exists(#apply, :empty_list), :apply)",
        ConditionExpression: "not contains (#apply, :applyStr)",
        ExpressionAttributeNames: {
            '#apply': 'applicants'
        },
        ExpressionAttributeValues: {
            ':apply': [{
                date: String(new Date()),
                applicant: req.user.user.S,
                classify: 0
            }],
            ':applyStr': req.body.user,
            ':empty_list': []
        },
        ReturnValue: 'UPDATED_NEW'
    }

    let param = {
        TableName: 'JobSeeker',
        Key: {
            user: req.user.user.S
        },
        UpdateExpression: "set #apply=list_append(if_not_exists(#apply, :empty_list), :apply)",
        ConditionExpression: "not contains (#apply, :applyStr)",
        ExpressionAttributeNames: {
            '#apply': 'company_apply'
        },
        ExpressionAttributeValues: {
            ':apply': [req.body.user],
            ':applyStr': req.body.user,
            ':empty_list': []
        },
        ReturnValue: 'UPDATED_NEW'
    }

    query.updateItem(param,(err,data)=>{})

    query.updateItem(params, (err, data) => {
        if (err)
            res.send(false)
        else
            res.send(true)
    })

})

// HỦY ĐƠN ĐÃ NỘP
router.post('/avoid-job',auth.ensureAuthenticated, (req, res) => {
    let params = {
        TableName: 'JobInfo',
        Key: {
            'user': { S: req.body.user},
            'position': { S: req.body.pos }
        }
    }

    let deleteParams = (tableName, key, expression)=>{
        return {
            TableName: tableName,
            Key: key,
            UpdateExpression: expression,
            ReturnValue: 'UPDATED_NEW'
        }
    }

    query.getItem(params, (err,data)=>{
        if(!err)
            if (data.Item.applicants)
            data.Item.applicants.L.forEach(function (it,index) {
                if (it.M.applicant.S===req.user.user.S)
                    query.updateItem(deleteParams(
                        'JobInfo',
                        { user:  req.body.user,  position: req.body.pos },
                        "remove applicants["+index+"]"
                    ),(err,data)=>{
                        if (!err)
                            res.send(true)
                        else
                            res.send(false)
                    })
            })

    })

})

router.post('/logout', (req, res) => {
    req.logout()
    res.send("Success")
})

module.exports = router
