const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

router.get('/',auth.ensureAuthenticated,(req, res) => {
    res.render('page/profile')
})

module.exports = router