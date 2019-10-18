const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home',{input: req.user});
})

router.post('/',(req, res) => {
  res.redirect('/employer')
})

router.post('/logout',(req, res) => {
  req.logout()
  res.send("Success")
})

module.exports = router;
