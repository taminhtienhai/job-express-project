const express = require('express')
const router = express.Router()
const query = require('../queries/table-queries')

router.get('/',(req, res) => {
    res.render('page/employer-home',{input: req.user})
})

router.get('/recruitment-package', (req, res) => {
    res.render('page/recruitment-package')
})

router.get('/account',(req, res) => {
    let params= {
        TableName: 'Employer',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(params,(err,data)=>{
        if (err)
            res.render('page/account-manager',{e: err,error:{}})
        else
            res.render('page/account-manager',{ input: data.Item,error:{} })
    })
})

router.get('/account-data',(req, res) => {
    let params= {
        TableName: 'Employer',
        Key: {
            'user': req.user.user
        }
    }
    query.getItem(params,(err,data)=>{
        if (err)
            res.send("Failed")
        else
            res.send(data.Item)
    })

})

router.post('/',(req, res) => {
    res.redirect('/')
})

router.post('/logout',(req, res) => {
    req.logout()
    res.send("success")
})

module.exports = router