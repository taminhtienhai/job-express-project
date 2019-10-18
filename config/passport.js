const LocalStrategy = require('passport-local')
const query= require('../queries/table-queries')
const { body, validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcrypt')

module.exports = function (passport) {
    passport.serializeUser( (user,done) => {
        done(null,user.user)
    })

    passport.deserializeUser((user,done) => {
        query.getItem({TableName: "Account", Key: { user: user }}, (err, data) => {
            if (err) {
                done(err, false);
            }
            done(err, data.Item);
        })
    })

    // LOGIN session
    passport.use('local-login', new LocalStrategy(
        { passReqToCallback: true },
        (req,username,password,done) => {
            let params = {
                TableName: 'Account',
                Key: {
                    'user': {S: username}
                }
            }
            function callback(err, data) {
                if (err) {
                    return done(err)
                }
                if (data.Item.length == 0) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                if (bcrypt.compareSync(password, data.Item.password.S)){
                    return done(null, data.Item)
                }else{
                    return done(null,false)
                }
            }

            query.getItem(params,callback)
        }
    ))

    // SIGNUP SESSION
    passport.use('local-signup-employer', new LocalStrategy(
        {
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        (req,username,password,done) => {
            let input = matchedData(req)
            let params= {
                TableName: 'Account',
                Key: {
                    'user': {S: username}
                }
            }
           async function callback(err,data){
                if (err)
                    return done(err,false)
                if (data.Item!=null)
                    return done(null,false,req.flash('signupMess','Tên đăng nhập đã tồn tại'))
                let paramEmployer = {
                    TableName: 'Employer',
                    Item: {
                        'user': {S: username},
                        'company_name': {S: input.company},
                        'job_profess': {S: input.pro},
                        'address': {S: input.city},
                        'phone': {S: input.tel},
                    }
                }
                let paramAccount = {
                    TableName: 'Account',
                    Item: {
                        'user': {S: username},
                        'password': {S: bcrypt.hashSync(password,10)},
                        'permission': {S: 'Employer'},
                        'date': {S: String(new Date())}
                    }
                }
                function callbackAc(error,data){
                    if (error)
                        return done(null,false)
                    else
                        return done(null,paramAccount.Item)
                }
                function callbackEm(error,data){
                    if (error)
                        return done(null,false)
                }
                await query.addOneItem(paramEmployer,callbackEm)
                query.addOneItem(paramAccount,callbackAc)
            }
            query.getItem(params,callback)
        }
    ))
}