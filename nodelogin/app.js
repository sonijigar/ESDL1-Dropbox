var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('client-sessions');
var expressSessions = require('express-session')
var index = require('./routes/index');
var users = require('./routes/users');
var file_s = require('./routes/files');
var mysql = require('./routes/mysql');
var mysq = require('mysql');
var MySQLStore = require('express-mysql-session')(expressSessions);
var options = {
    host    :'localhost',
    user    :'root',
    password:'toor',
    database:'test',
    port    :'3306',
    debug   :false
}
var connection = mysq.createPool(options);
var sessionStore = new MySQLStore({}, connection);
//const fileUpload = require('express-fileupload');

var app = express();
//Enable CORS
app.use(cors());
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(fileUpload());
app.use(expressSessions({
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: sessionStore
}))

// app.use(session({
//     cookieName:'session',
//     secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
//     duration: 30*60*1000,
//     activeDuration: 5*60*1000,
//     httpOnly: true,
//     secure: true,
//     ephemeral: true
// }));

// app.use(function(req, res, next){
//     if(req.session && req.session.user){
//
//     }
// })

app.use('/', index);
app.use('/users', users);
app.use('/files', file_s);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;
