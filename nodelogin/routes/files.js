var express = require('express');
var mysql = require('./mysql');
var multer  =   require('multer');
var crypto = require('crypto');
var session = require('client-sessions');
var app = express();
var fs = require('fs');
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

router.post('/createdir', function(req, res, next){
    if(req.session && req.session.user){
        //var reqParent = null;

        var reqName = req.body.name;
        var groupId;
        // var group = "insert into user_group(owner_id, permission, name) values('"+req.session.user[0].user_id+"','2','"+reqName+"')";
        // mysql.fetchData(function(err, results){
        //     if(err){
        //         console.log("wrong query");
        //     }
        //     else{
        //         console.log(results);
        //         groupId = results[0].group_id;
        //     }
        // }, group);','"+reqParent+"
        var groupId = null;
        if(!(req.body.parentId)) {
            var createdir = " insert into dir_table(owner_id, name) values('"+req.session.user[0].user_id+"','"+reqName+"')";
        }
        else{
            var reqParent = req.body.parentId;
            var createdir = " insert into dir_table(owner_id, parent_id, name) values('"+req.session.user[0].user_id+"','"+reqParent+"','"+reqName+"')";
        }

        mysql.fetchData(function(err, results){
            if(err){
                console.log("wrong query");
            }
            else{
                res.status(201).json({message:"directory created successfully"});
            }
        }, createdir);
    }
    else{
        res.status(401).json({message:"sessions problem"});
    }
});

router.post('/sharedir', function(req, res, next){
    if(req.session && req.session.user){
        reqData = req.body;
        var shrdir = "insert into user_group(group_id, owner_id, permission)  values ('"+req.session.user[0].user_id+"','2')";
        var grpId ;

        var values = [];
        console.log(reqData.length);
        // for(var i=0; i<reqData.length; i++){
        //     values.push([grpId, reqData[i].userId]);
        // }
        // console.log(values);
        mysql.fetchData(function(err, results){
            // if(err){
            //     console.log("something wrong");
            // }
            // else{
            //     grpId = results.insertId
            //     console.log(results.insertId);
            // }
            grpId = results.insertId;
            for(var i=0; i<reqData.length; i++){
                values.push([grpId, reqData[i].userId, '1']);
            }
            console.log(values);
            mysql.sqlGroup(function(err, res){
                console.log("kool");
            }, values)
        },shrdir);

        //var sharedir = "insert into user_group(group_id, user_id, permission) values ?"
        // mysql.sqlGroup(function(err, results){
        //     if(err){
        //         console.log("cool");
        //     }
        //     else{
        //         console.log("uncool");
        //     }
        // },values)
    }
})

router.get('/filedownload', function(req, res, next){
    if(req.session && req.session.user){
        var getUser = "select * from dropbox_users where email ='" + req.session.user[0].email +"'";
        mysql.fetchData(function(err,results){
            if(err){
                req.session.distroy();
                //res.redirect('/doLogin');

            }
            else{
                var file = "./uploads/10-3-1 (2 files merged).pdf";
                res.setHeader('Content-disposition', 'attachment; filename='+file);
                res.setHeader('Content-type', 'text/plain');
                // res.download(file);
                var fileStream = fs.createReadStream(file);
                //fileStream.pipe(res);
                res.attachment(file);
                res.json
                    res.status(201).json({message:"Session working"});
            }
        },getUser);
    }

    else{
        res.status(401).json({message:"Session not working find the way to reroute"});
    }
});

router.post('/fileupload', function(req, res, next){
    if(req.session && req.session.user){
        var getUser = "select * from dropbox_users where email ='" + req.session.user[0].email +"'";
        mysql.fetchData(function(err,results){
            if(err){
                req.session.destroy();
                //res.redirect('/doLogin')

            }
            else{
                upload(req, res, function(err){
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
        //res.redirect('/users/doLogin');
        res.status(401).json({message:"Session Expired"});
    }



});

module.exports = router;