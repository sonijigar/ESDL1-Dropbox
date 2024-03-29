var express = require('express');
var mysql = require('./mysql');
var crypto = require('crypto');
var session = require('express-session');
var router = express.Router();
var CryptoJs = require('crypto-js');

// function check(req, res, next){
//     if(req.session && req.session.user){
//         var getUser = "select * from dropbox_users where firstname ='" + req.session.user[0].firstname +"'";
//         mysql.fetchData(function(err,results){
//             if(err){
//                 req.session.reset();
//             }
//             else if (results.length >= 1){
//                 console.log(results);
//                 return results;
//             }
//         },getUser);
//     }
//     else {
//         console.log("here");
//         return false;
//     }
// }

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doWelcome', function(req, res, next){
    if(req.session && req.session.user){
        var getUser = "select * from dropbox_users where email ='" + req.session.user[0].email +"'";
        mysql.fetchData(function(err,results){
            if(err){
                req.session.destroy();
                //res.redirect('/doLogin')

            }
            else{

                res.status(201).json({message:"Session working"});
            }
        },getUser);
    }
    else{
        res.status(401).json({message:"Session Expired"});
    }
    // var ans = check(req, res, next);
    // console.log(ans);
    // if(ans){
    //     res.status(201).json({message:"Session working"});
    // }
    // else{
    //     res.status(401).json({message:"Session Expired"});
    // }

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
            //console.log(results.length);
            if(results.insertId){
                req.session.user = results;
                res.status(201).json({message:"Signup successful"});
            }
            else{
                res.status(401).json({message: "Signup failed"});
            }
        }
    },addUser);

});

router.post('/doLogin', function (req, res, next) {

    var reqEmail = req.body.email;
    var reqPassword = req.body.password;

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



    var getUser = "select * from dropbox_users where email ='" + reqEmail +"'";

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0) {
                var salt = results[0].salt;
                var password = sha512(reqPassword, salt);

                if (results[0].password == password.passwordHash) {
                    req.session.user = results;
                    delete req.session.user[0].password;
                    res.json(results[0]);

                }
                else{
                    res.json({message:"password not found"});
                }
                // console.log("something wrong");
            }
            else{
                req.session.destroy();
                res.json({message: "Login failed"});
            }
        }
    },getUser);

});

router.post('/logout', function(req, res){
    console.log(req.session.user);
    req.session.destroy();
    console.log('session destroyed');
    res.status(200).json({message:"Session destroyed"});
})
module.exports = router;
