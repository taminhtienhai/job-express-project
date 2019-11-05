const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')
const DynamoDBStore = require('connect-dynamodb')({session: session})

const homeRouter = require('./routes/home')
const seekerRouter = require('./routes/seeker')
const loginRouter = require('./routes/login')(passport)
const registerRouter = require('./routes/register')(passport)
const employerRouter = require('./routes/employer')
const managerRouter = require('./routes/manager')

const app = express()

// LOGIN and SIGNUP SCRIPTS
require('./config/passport')(passport)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}))

var options = {
    table: 'SessionsTable',
    AWSConfigJSON: {
        accessKeyId: 'foo',
        secretAccessKey: 'bar',
        region: 'us-east-1'
    },
// Optional client for alternate endpoint, such as DynamoDB Local
    client: require('./queries/dynamodb').dynamo(),

    // Optional ProvisionedThroughput params, defaults to 5
    readCapacityUnits: 10,
    writeCapacityUnits: 10
}

// Init passport and flash
app.use(session({
    secret: "HaiTa",
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// user http://localhost:3000/ to direct resources
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-select/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/smooth-scrollbar/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/animate.css')))
app.use(express.static(path.join(__dirname, 'node_modules/aos/dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')))

app.use('/', homeRouter)
app.use('/seeker', seekerRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/employer', employerRouter)
app.use('/employer/manager',managerRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
