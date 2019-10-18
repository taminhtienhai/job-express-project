const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    res.render('page/employer-home',{input: req.user})
})

router.post('/',(req, res) => {
    res.redirect('/')
})

router.post('/logout',(req, res) => {
    req.logout()
    res.send("success")
})

module.exports = router