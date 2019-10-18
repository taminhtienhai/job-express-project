// THIS JS for CHECK Authenticated
module.exports= {
    ensureAuthenticated: function(req,res,next) { // APPROVE IF LOGIN
        if (req.isAuthenticated())
            return next()
        req.flash('error_msg',"Bạn phải tiến hành đăng nhập để truy cập")
        res.redirect('/login')
    },
    forwardAuthenticated: function (req,res,next) { // APPROVE IF NOT LOGIN
        if (!req.isAuthenticated())
            return next()
        res.redirect('/')
    },
    employerAuthenticated: function (req,res,next) { // APPROVE IF LOGIN BY EMPLOYER
        let isEmployerLogin = req.isAuthenticated() && req.session.passport.permission == "Employer"
        if (isEmployerLogin)
            return next()
        res.redirect('/')
    },
    seekerAuthenticated: function (req,res,next) { // APPROVE IF LOGIN BY SEEKER
        let isSeekerLogin = req.isAuthenticated() && req.session.passport.permission == "Seeker"
        if (isSeekerLogin)
            return next()
        res.redirect('/')
    }
}
