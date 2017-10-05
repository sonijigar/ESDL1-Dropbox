var express = require('express');
var mysql = require('./mysql');
var multer  =   require('multer');
var crypto = require('crypto');
var session = require('client-sessions');
var app = express();
var storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, req.session.user[0].user_id + '-'+ file.originalname);
        var path = './uploads'+ req.session.user[0].user_id + '-'+ file.originalname;
        var type = file.originalname.split(".")
        mysql.addFileToDb(file.originalname, path, type[type.length-1], req.session.user[0].user_id);
    }
});
var upload = multer({storage:storage}).single('file');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/fileupload', function(req, res, next){
    if(req.session && req.session.user){
        var getUser = "select * from dropbox_users where firstname ='" + req.session.user.firstname +"'";
        mysql.fetchData(function(err,results){
            if(err){
                req.session.reset();
                //res.redirect('/doLogin')

            }
            else{
                upload(req, res, function(err){
                    console.log("here");
                    if(err){
                        res.status(401).json({message:"upload Error"});
                    }
                    res.status(201).json({message:"upload working"});
                })
                //res.status(201).json({message:"Session working"});
            }
        },getUser);
    }
    else{
        //res.status(401).json({message:"Session Expired"});
    }



});

module.exports = router;