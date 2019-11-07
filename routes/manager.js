const express = require('express')
const router = express.Router()
const { body, validationResult, matchedData } = require('express-validator')
const query = require('../queries/table-queries')
const auth = require('../config/auth')

router.get('/',auth.ensureAuthenticated,(req, res) => {
    let params = {
        TableName: 'JobInfo',
        KeyConditionExpression: "#user=:user",
        ExpressionAttributeNames: {
            '#user': 'user'
        },
        ExpressionAttributeValues: {
            ':user': req.user.user.S
        }
    }

    query.queryItem(params, (err,data)=>{
        if (!err){
            let s = 0
            data.Items.map(it=>{ s += it.applicants?it.applicants.length:0 })
            let rs = {
                jobCount: data.Items.length,
                seekerCount: s
            }
            res.render('page/recruitment-manager',{ input: rs })
        }
    })
})

router.get('/new-job',auth.ensureAuthenticated,(req, res) => {
    let params= {
        TableName: 'Employer',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(params,(err,data)=>{
        if (err)
            res.render('page/new-job',{e: err,error:{}})
        else
            res.render('page/new-job',{ input: data.Item,error:{} })
    })
})

router.get('/search',auth.ensureAuthenticated,(req, res) => {
    let params = {
        TableName: 'JobSeeker'
    }

    query.scanItem(params,(err, data)=>{
        if (err)
            res.render('page/seeker-searching',{error: err})
        else
            res.render('page/seeker-searching',{ error:{}, input: data.Items })
    })
})

router.get('/jobs',auth.ensureAuthenticated,(req, res) => {
    let params = {
        TableName: 'JobInfo',
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
            res.render('page/job-manager',{ error: err })
        else
            res.render('page/job-manager',{ input: data.Items,error: {} })
    })
})

// GET LIST APPLICANTS
router.get('/seeker',auth.ensureAuthenticated,(req, res) => {
    let params = {
        TableName: 'JobInfo',
        KeyConditionExpression: " #user=:user ",
        ExpressionAttributeValues: {
            ':user': req.user.user.S
        },
        ExpressionAttributeNames: {
            '#user': 'user'
        }
    }

    query.queryItem(params, (err,data)=>{
        if (err) {
            res.render('page/seeker-manager')
        } else {
            res.render('page/seeker-manager', { people: data.Items[0], list: data.Items, err: {} })
        }
    })
})

router.post('/seeker-for-position', (req, res) => {
    let params = {
        TableName: 'JobInfo',
        KeyConditionExpression: "#user=:user and #pos=:pos",
        ExpressionAttributeNames: {
            '#user': 'user',
            '#pos': 'position'
        },
        ExpressionAttributeValues: {
            ':user': req.user.user.S,
            ':pos': req.body.value
        }
    }
    query.queryItem(params,(err,data)=>{
        if (err)
            res.send("Can't get select position")
        else
            res.send(data.Items[0])
    })
})

// QUẢN LÝ NGƯỜI NỘP ĐƠN
// LOẠI 1 NGƯỜI
router.post('/seeker-fired',(req, res) => {
    let params = {
        TableName: 'JobInfo',
        Key: {
            'user': req.user.user.S,
            'position': req.body.pos
        },
        UpdateExpression: "REMOVE applicants["+req.body.index+"]",
        ReturnValues: "ALL_NEW"
    }

    query.updateItem(params,(err,data)=>{
        if (!err)
            res.send(true)
        else
            res.send(false)
    })

})

// TĂNG BẬC CHO ỨNG VIÊN
router.post('/seeker-up', (req, res) => {
    let up = req.body.po==='0'?1:2
    let params = {
        TableName: 'JobInfo',
        Key: {
            'user': req.user.user.S,
            'position': req.body.pos
        },
        UpdateExpression: "set applicants["+req.body.index+"].classify=:value",
        ExpressionAttributeValues: {
          ':value': up
        },
        ReturnValues: "ALL_NEW"
    }

    query.updateItem(params,(err,data)=>{
        if (!err)
            res.send(true)
        else
            res.send(false)
    })
})

// HẠ BẬC ỨNG VIÊN
router.post('/seeker-down', (req, res) => {
    let down = req.body.po==='2'?1:0
    let params = {
        TableName: 'JobInfo',
        Key: {
            'user': req.user.user.S,
            'position': req.body.pos
        },
        UpdateExpression: "set applicants["+req.body.index+"].classify=:value",
        ExpressionAttributeValues: {
            ':value': down
        },
        ReturnValues: "ALL_NEW"
    }

    query.updateItem(params,(err,data)=>{
        if (!err)
            res.send(true)
        else
            res.send(false)
    })
})

// ĐĂNG 1 CÔNG VIỆC MỚI
router.post('/new-job/post-job',[
    body('pos').not().isEmpty().withMessage('Bạn chưa nhập vị trí')
        .matches("[a-zA-Z ]+").withMessage('Dữ liệu bạn nhập phải là chữ cái'),
    body('rank').not().isEmpty().withMessage('Bạn chưa chọn trình độ'),
    body('pro').not().isEmpty().withMessage('Bạn chưa chọn ngành'),
    body('workplace').not().isEmpty().withMessage('Bạn chưa chọn nơi làm việc'),
    body('minSalary').not().isEmpty().withMessage('Bạn chưa chọn mức lương tối thiểu'),
    body('maxSalary').not().isEmpty().withMessage('Bạn chưa chọn lương tối đa')
        .custom((value, { req }) => {
            if (parseInt(value) <= parseInt(req.body.minSalary)) {
                throw new Error('Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu')
            }
            return true
        }),
    body('description').not().isEmpty().withMessage('Bạn chưa nhập mô tả công việc'),
    body('require').not().isEmpty().withMessage('Bạn chưa nhập yêu cầu công việc'),
    body('lang').not().isEmpty().withMessage('Bạn chưa chọn ngôn ngữ nộp hồ sơ'),
    body('contact').not().isEmpty().withMessage('Bạn chưa nhập tên liên hệ của bạn'),
    body('email').not().isEmpty().withMessage('Bạn chưa nhập email liên lạc')
        .isEmail().withMessage('Email của bạn không đúng định dạng abc@gmail.com'),
    body('name').not().isEmpty().withMessage('Bạn chưa nhập tên công ty'),
    body('address').not().isEmpty().withMessage('Bạn chưa nhập địa chỉ công ty'),
    body('info'),
    body('benefit').not().isEmpty().withMessage('Bạn chưa phúc lợi công ty'),
    body('logo')
],(req, res, next) => {
    let result = validationResult(req)
    let errors = result.mapped()
    console.log(errors)
    JSON.stringify(errors)=='{}'?next():res.render('page/new-job',{error:errors, input: {}})
},async (req, res) => {
    // GET DATA FROM USER LOGIN
    const loginData = req.user
    const input = matchedData(req)

    console.log(input)

    if(loginData==null)
        res.redirect("/employer")

    let paramJob= {
        TableName: 'JobInfo',
        Item: {
            'user': { S: loginData.user.S },
            'position': { S: input.pos },
            'job_profess': { S: input.pro },
            'edu_level': { S: input.rank },
            'workplace': { S: input.workplace },
            'language': { S: input.lang },
            'salary': { M: {
                    'min_salary': { S: input.minSalary },
                    'max_salary': { S: input.maxSalary }
                } },
            'description': { S: input.description },
            'requirement': { S: input.require },
            'date': { S: String(new Date()) }
        }
    }

    let paramEm = {
        TableName: 'Employer',
        Key: {
            user: loginData.user.S
        },
        UpdateExpression: "set #name=:name, #pro=:pro, #address=:address," +
            "#contact_name=:contact_name, #contact_email=:contact_email,#benefit=:benefit,#logo=:logo",
        ExpressionAttributeNames: {
            '#name': 'company_name',
            '#pro': 'job_profess',
            '#address': 'address',
            '#benefit': 'benefits',
            '#contact_name': 'contact_name',
            '#contact_email': 'contact_email',
            '#logo': 'logo'
        },
        ExpressionAttributeValues: {
            ':name': input.name ,
            ':pro': input.pro,
            ':address': input.address,
            ':benefit': input.benefit,
            ':contact_name': input.contact,
            ':contact_email': input.email,
            ':logo': input.logo
        },
        ReturnValue: "UPDATED_NEW"
    }

    // HANDLE ERROR AFTER UPDATE EMPLOYER
    function callbackEm(err,data) {
        if (err)
            res.redirect('/employer/manager/new-job')
    }
    // HANDLER ACTION AFTER ADD A JOB INTO JOB-INFO
    function callbackJob(err,data) {
        if (err)
            res.redirect('/employer/manager/new-job')
        else
            res.redirect('/employer/manager')
    }
    function updateCompany(err,data) {


    }
    await query.updateItem(paramEm,callbackEm)
    query.addOneItem(paramJob,callbackJob)
})

module.exports = router