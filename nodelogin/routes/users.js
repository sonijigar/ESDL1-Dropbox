var express = require('express');
var mysql = require('./mysql');
var crypto = require('crypto');
var session = require('client-sessions');
var router = express.Router();
var app = require('../app')

// app.use(function(req, res, next){
//     i f
// })
function check(req, res, next){
    if(req.session && req.session.user){
        var getUser = "select * from dropbox_users where firstname ='" + req.session.user[0].firstname +"'";
        mysql.fetchData(function(err,results){
            if(err){
                req.session.reset();
            }
            else if (results.length >= 1){
                console.log(results);
                return results;
            }
        },getUser);
    }
    else {
        console.log("here");
        return false;
    }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doWelcome', function(req, res, next){
    // if(req.session && req.session.user){
    //     var getUser = "select * from dropbox_users where firstname ='" + req.session.user.firstname +"'";
    //     mysql.fetchData(function(err,results){
    //         if(err){
    //             req.session.reset();
    //             //res.redirect('/doLogin')
    //
    //         }
    //         else{
    //
    //             res.status(201).json({message:"Session working"});
    //         }
    //     },getUser);
    // }
    // else{
    //     res.status(401).json({message:"Session Expired"});
    // }
    var ans = check(req, res, next);
    console.log(ans);
    if(ans){
        res.status(201).json({message:"Session working"});
    }
    else{
        res.status(401).json({message:"Session Expired"});
    }

})
router.post('/doSignUp', function (req, res, next) {
    var reqFirstname = req.body.firstname;
    var reqPassword = req.body.password;
    var reqEmail = req.body.email;
    var reqLastname = req.body.lastname;

    var genRandom = (length) => {
        return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
    };

    var sha512 = (pass, salt) => {
        var hash = crypto.createHmac('sha512', salt);
        hash.update(pass);
        var value = hash.digest('hex');
        return {
            salt:salt,
            passwordHash:value
        };
    };

    var salt = genRandom(16);
    var password = sha512(reqPassword, salt);

    var addUser = "insert into dropbox_users(firstname, lastname, email, password, salt) values ('"+reqFirstname+"','"+reqLastname+"','"+reqEmail+"','"+password.passwordHash+"','"+password.salt+"')";

    mysql.insertData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                req.session.user = user;
                res.status(201).json({message:"Signup successful"});
            }
            else{
                res.status(401).json({message: "Signup failed"});
            }
        }
    },addUser);

});

router.post('/doLogin', function (req, res, next) {

    var reqUsername = req.body.username;
    var reqPassword = req.body.password;

    var getUser = "select * from dropbox_users where firstname ='" + reqUsername + "' and password ='"+reqPassword+"'";

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                req.session.user = results;
                res.status(201).json({message:"Login successful"});
            }
            else{
                req.session.reset();
                res.status(401).json({message: "Login failed"});
            }
        }
    },getUser);

});

module.exports = router;
