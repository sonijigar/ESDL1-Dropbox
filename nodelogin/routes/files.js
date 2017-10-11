var express = require('express');
var mysql = require('./mysql');
var multer  =   require('multer');
var crypto = require('crypto');
var session = require('client-sessions');
var app = express();
var fs = require('fs');
const uuidv4 = require('uuid/v4');
var storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, req.session.user[0].user_id + '-'+ file.originalname);
        var path = './uploads'+ req.session.user[0].user_id + '-'+ file.originalname;
        var type = file.originalname.split(".");
        console.log(req.param('dirId'));
        console.log("hey");
        if(req.param('dirId')== null){
            mysql.addFileToDb(req, 1, file.originalname, path, type[type.length - 1], req.session.user[0].user_id);
        }
        else {
            mysql.addFileToDb(req, req.param('dirId'), file.originalname, path, type[type.length - 1], req.session.user[0].user_id);
        }
    }
});
var upload = multer({storage:storage}).single('file');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//creates directory for a user based on parent id
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


//share an existing file with number of users with permission no = 1 that is ++++++////check if it is already shared
router.post('/sharefile', function(req, response, next){
    if(req.session && req.session.user){
        reqData = req.body.arr;
        var grpId = uuidv4();
        var shrdir = "insert into user_group(group_id, owner_id, permission)  values ('"+grpId+"','"+req.session.user[0].user_id+"','2')";

        var val = [];
        var values = [];
        console.log(reqData.length);

        for(var i=0; i<reqData.length; i++)
            val.push([reqData[i].email]);

        mysql.sqlGetUser(function (err, res) {
            console.log("barobar");
            console.log(res);
            mysql.fetchData(function (err, results) {
                for(var i=0; i<res.length; i++){
                    values.push([grpId, res[i].user_id, '1']);
                }
                console.log(values);
                mysql.sqlGroup(function(err, resp){
                    console.log("kool");
                    var reqName = req.body.name;
                    var reqParent = req.body.parentId;
                    //if(!reqParent){
                        var createdir = " update file_table set group_id ='"+grpId+"' where file_id ='"+req.body.fileId+"'";
                    //}
                    // else{
                    //     var createdir = " update file_table(owner_id, group_id, parent_id, name) values('"+req.session.user[0].user_id+"','"+grpId+"','"+reqParent+"','"+reqName+"')";
                    //
                    // }
                    mysql.fetchData(function(err, ress){
                        console.log("done");
                        response.status(201).json({message:"file shared"});
                    }, createdir);
                }, values)
            }, shrdir);

        }, val);
    }
    else{
        response.status(401).json({message:"session expired"});
    }
});

//creates group of users
router.post('/creategroup', function(req, response, next){
    if(req.session && req.session.user){
        reqData = req.body.arr;
        var grpId = uuidv4();
        var shrdir = "insert into user_group(group_id, owner_id, permission,name)  values ('"+grpId+"','"+req.session.user[0].user_id+"','5','"+req.body.name+"')";

        var val = [];
        var values = [];
        console.log(reqData.length);

        for(var i=0; i<reqData.length; i++)
            val.push([reqData[i].email]);

        mysql.sqlGetUser(function (err, res) {
            console.log("barobar");
            console.log(res);
            mysql.fetchData(function (err, results) {
                for(var i=0; i<res.length; i++){
                    values.push([grpId, res[i].user_id, '6', req.body.name]);
                }
                console.log(values);
                mysql.mysqlGroup(function(err, resp){
                    console.log("kool");
                    response.status(201).json({message:"group created"});

                }, values)
            }, shrdir);

        }, val);
    }
    else{
        response.status(401).json({message:"session expired"});
    }
});

//show all the groups created by the user
router.get('/showgroup', function(req, resp){
   if(req.session && req.session.user){
    var showGroups = "select * from user_group where owner_id = '"+req.session.user[0].user_id+"' and permission = '5'";
    mysql.fetchData(function(err, res){
        if(err){
            console.log("err");
            throw err;
        }
        else{
            resp.status(201).json(res)
        }
    }, showGroups);
   }
   else{
       res.status(401).json({message:"session not working"});
   }
});

//delete directory
// router.post('/deldir', function(req, response){
//     if(req.session && req.session.user){
//         var getStar = "select * from star where dir_id = '"+req.body.fileId+"'";
//         mysql.fetchData(function(err, res){
//             if(res.length > 0){
//                 var delStar = "delete from star where dir_id = '"+req.body.dirId+"'";
//                 mysql.fetchData(function(err, res){
//                     console.log("entries from star table deleted");
//                     var getGroupId = "select group_id from dir_table where dir_id = '"+req.body.dirId+"'";
//                     mysql.fetchData(function(err, result){
//                         if(result[0].group_id != null) {
//                             var delGroup = "delete from user_group where group_id = '" + result[0].group_id + "'";
//                             mysql.fetchData(function (err, results) {
//                                 var selFiles = "select file_id from file_table where parent_id = '"+req.body.dirId+"'";
//
//
//
//
//
//
//
//
//                                 var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
//                                 mysql.fetchData(function (err, res) {
//                                     if (err) {
//                                         throw err;
//                                     }
//                                     else {
//                                         response.status(201).json({message: "file deleted"});
//                                     }
//                                 }, delFile);
//                             }, delGroup);
//                         }
//                         else{
//                             var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
//                             mysql.fetchData(function (err, res) {
//                                 if (err) {
//                                     throw err;
//                                 }
//                                 else {
//                                     response.status(201).json({message: "file deleted"});
//                                 }
//                             }, delFile);
//                         }
//                     }, getGroupId);
//
//                 }, delStar);
//             }
//             else{
//                 var getGroupId = "select group_id from file_table where file_id = '"+req.body.fileId+"'";
//                 mysql.fetchData(function(err, result){
//                     if(result[0].group_id != null) {
//                         var delGroup = "delete from user_group where group_id = '" + result[0].group_id + "'";
//                         mysql.fetchData(function (err, results) {
//                             var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
//                             mysql.fetchData(function (err, res) {
//                                 if (err) {
//                                     throw err;
//                                 }
//                                 else {
//                                     response.status(201).json({message: "file deleted"});
//                                 }
//                             }, delFile);
//                         }, delGroup);
//                     }
//                     else{
//                         var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
//                         mysql.fetchData(function (err, res) {
//                             if (err) {
//                                 throw err;
//                             }
//                             else {
//                                 response.status(201).json({message: "file deleted"});
//                             }
//                         }, delFile);
//                     }
//                 }, getGroupId);
//             }
//         },getStar);
//     }
//     else{
//         response.status(401).json({message:"Session Expired"});
//     }
// });

//delete file
router.post('/delfile', function(req, response){
   if(req.session && req.session.user){
       var getStar = "select * from star where file_id = '"+req.body.fileId+"'";
       mysql.fetchData(function(err, res){
           if(res.length > 0){
               var delStar = "delete from star where file_id = '"+req.body.fileId+"'";
               mysql.fetchData(function(err, res){
                   console.log("all the entries from star table deleted");
                   var getGroupId = "select group_id from file_table where file_id = '"+req.body.fileId+"'";
                   mysql.fetchData(function(err, result){
                       if(result[0].group_id != null) {
                           var delGroup = "delete from user_group where group_id = '" + result[0].group_id + "'";
                           mysql.fetchData(function (err, results) {
                               var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
                               mysql.fetchData(function (err, res) {
                                   if (err) {
                                       throw err;
                                   }
                                   else {
                                       response.status(201).json({message: "file deleted"});
                                   }
                               }, delFile);
                           }, delGroup);
                       }
                       else{
                           var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
                           mysql.fetchData(function (err, res) {
                               if (err) {
                                   throw err;
                               }
                               else {
                                   response.status(201).json({message: "file deleted"});
                               }
                           }, delFile);
                       }
                   }, getGroupId);

               }, delStar);
           }
           else{
               var getGroupId = "select group_id from file_table where file_id = '"+req.body.fileId+"'";
               mysql.fetchData(function(err, result){
                   if(result[0].group_id != null) {
                       var delGroup = "delete from user_group where group_id = '" + result[0].group_id + "'";
                       mysql.fetchData(function (err, results) {
                           var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
                           mysql.fetchData(function (err, res) {
                               if (err) {
                                   throw err;
                               }
                               else {
                                   response.status(201).json({message: "file deleted"});
                               }
                           }, delFile);
                       }, delGroup);
                   }
                   else{
                       var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
                       mysql.fetchData(function (err, res) {
                           if (err) {
                               throw err;
                           }
                           else {
                               response.status(201).json({message: "file deleted"});
                           }
                       }, delFile);
                   }
               }, getGroupId);
           }
       },getStar);


       // var getGroupId = "select group_id from file_table where file_id = '"+req.body.fileId+"'";
       // mysql.fetchData(function(err, result){
       //     if(result[0].group_id != null) {
       //         var delGroup = "delete from user_group where group_id = '" + result[0].group_id + "'";
       //         mysql.fetchData(function (err, results) {
       //             var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
       //             mysql.fetchData(function (err, res) {
       //                 if (err) {
       //                     throw err;
       //                 }
       //                 else {
       //                     response.status(201).json({message: "file deleted"});
       //                 }
       //             }, delFile);
       //         }, delGroup);
       //     }
       //     else{
       //         var delFile = "delete from file_table where file_id = '" + req.body.fileId + "'";
       //         mysql.fetchData(function (err, res) {
       //             if (err) {
       //                 throw err;
       //             }
       //             else {
       //                 response.status(201).json({message: "file deleted"});
       //             }
       //         }, delFile);
       //     }
       // }, getGroupId);
   }
   else{
       response.status(401).json({message:"Session Expired"});
   }
});

//show all the members of selected group
router.post('/getmembers', function(req,resp){
    if(req.session && req.session.user){
        var showMembers = "select owner_id, permission from user_group where group_id ='"+req.body.groupId+"'";
        mysql.fetchData(function(err, res){
            console.log(res);
            var values = [];
            for(var i= 0; i<res.length; i++){
                values.push([res[i].owner_id]);
            }
            console.log(values);
            var str = "select * from dropbox_users where user_id in (?)";
            mysql.getUsers(str, function(err, result){
                if(err){
                    throw err;
                }
                else{
                    resp.status(201).json(result);
                }
            },values)
        }, showMembers);
    }
    else{
        resp.status(401).json({message:"session not working"});
    }
});

//delete group member
router.post('/delmember', function(req, res){
    if(req.session && req.session.user) {
        var values = [];
        for (var i = 0; i < req.body.arr.length; i++) {
            values.push([req.body.arr[i].userId]);
        }
        var delMember = "delete from user_group where group_id = '"+req.body.groupId+"' and owner_id in (?)";
        mysql.getUsers(delMember, function (err, result) {
            if (err) {
                throw err;
            }
            else{
                res.status(201).json({message:"user(s) deleted"});
            }
        }, values);
    }
    else{
        res.status(401).json({message:"session expired"});
    }
})


//lists all the files and directories in home or main folder
router.post('/listfiles', function(req,response, next){
   if(req.session && req.session.user){
       if(!req.body.dirId){
            var getFiles = "select * from file_table where owner_id = '"+req.session.user[0].user_id+"' and dir_id = '1'";
           var getDirs = "select * from dir_table where owner_id = '"+req.session.user[0].user_id+"'";
            mysql.fetchData(function(err, res1){
                mysql.fetchData(function (err, res2) {
                    res1.push(res2);
                    response.status(201).json(res1);
                }, getDirs);
            },getFiles)
       }
       else{
           var getFiles = "select * from file_table where dir_id = '"+req.body.dirId+"' and owner_id = '"+req.session.user[0].user_id+"'";
           mysql.fetchData(function(err, res){
               response.status(201).json(res);
           }, getFiles);
       }
   }
});

//first asks emails of group members and creates shared directory
router.post('/sharedir', function(req, response, next){
    if(req.session && req.session.user){
        reqData = req.body.arr;
        var grpId = uuidv4();
        var shrdir = "insert into user_group(group_id, owner_id, permission)  values ('"+grpId+"','"+req.session.user[0].user_id+"','2')";

        var val = [];
        var values = [];
        console.log(reqData.length);
        // for(var i=0; i<reqData.length; i++){
        //     values.push([grpId, reqData[i].userId]);
        // }
        // console.log(values);

        //mysql.fetchData(function(err, results){
            for(var i=0; i<reqData.length; i++)
                val.push([reqData[i].email]);

            mysql.sqlGetUser(function (err, res) {
                console.log("barobar");
                console.log(res);
                mysql.fetchData(function (err, results) {
                    for(var i=0; i<res.length; i++){
                        values.push([grpId, res[i].user_id, '1']);
                    }
                    console.log(values);
                    mysql.sqlGroup(function(err, resp){
                        console.log("kool");
                        var reqName = req.body.name;
                        var reqParent = req.body.parentId;
                        if(!reqParent){
                            var createdir = " insert into dir_table(owner_id, group_id, name) values('"+req.session.user[0].user_id+"','"+grpId+"','"+reqName+"')";
                        }
                        else{
                            var createdir = " insert into dir_table(owner_id, group_id, parent_id, name) values('"+req.session.user[0].user_id+"','"+grpId+"','"+reqParent+"','"+reqName+"')";

                        }
                        mysql.fetchData(function(err, ress){
                            console.log("done");
                            response.status(201).json({message:"Shared directory created"});
                        }, createdir);
                        }, values)
                }, shrdir);

            }, val);

        // mysql.fetchData(function(err, results){    -----------------<
        //     // if(err){
        //     //     console.log("something wrong");
        //     // }
        //     // else{
        //     //     grpId = results.insertId
        //     //     console.log(results.insertId);
        //     // }
        //     //grpId = results.insertId;
        //     for(var i=0; i<reqData.length; i++){
        //         values.push([grpId, reqData[i].userId, '1']);
        //     }
        //     console.log(values);
        //     mysql.sqlGroup(function(err, res){
        //         console.log("kool");
        //     }, values)
        // },shrdir);------------------------------------------->>


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
    else{
        response.status(401).json({message:"session expired"});
    }
});

//shows shared files and directories for a user
router.post('/listshared', function(req, res, next){
    if(req.session && req.session.user){
        var values = [];
        var getShared = "select group_id from user_group where owner_id = '"+req.session.user[0].user_id+"' and permission = '1'";
        //var getShared = "select group_id from user_group where owner_id = '1' and permission = '1'";
        mysql.fetchData(function(err, results) {
            console.log(results);
            if (results.length > 0) {

                for (var i = 0; i < results.length; i++) {
                    values.push(results[i].group_id);
                }
                //console.log(values);
                var getFiles = 'select * from file_table where group_id in (?)';
                var getDirs = 'select * from dir_table where group_id in (?)';
                mysql.getUsers(getFiles, function (err, result) {
                    console.log("success");
                    mysql.getUsers(getDirs, function(err, reslt){
                        result.push(reslt);
                        res.status(201).json(result);
                    }, values);

            }, values)
        }
        else{
                res.status(201).json({message:"no shared files or directories"});
            }
        }, getShared);
    }
})

//downloads a file
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

//star a file or directory based on flag
router.post('/addtostar', function(req, res, next) {
    if (req.session && req.session.user){
        var starFile = "insert into star (user_id, file_id) values ('" + req.session.user[0].user_id + "','" + req.body.id + "')";
        var starDir = "insert into star (user_id, dir_id) values ('" + req.session.user[0].user_id + "','" + req.body.id + "')";
        if(req.body.flag == "file"){
            starDir = starFile;
        }
        mysql.fetchData(function (err, results) {
            console.log("starres");
            res.status(201).json({message:"item starred"});
        },starDir);
    }
    else{
        res.status(401).json({message:"session expired"});
    }
});

//unstar a file or directory based on flag
router.post('/unstar', function(req, res, next) {
    if (req.session && req.session.user){
        var unstarFile = "delete from star where user_id = '"+req.session.user[0].user_id+"' and file_id = '"+req.body.id+"'";
        var unstarDir = "delete from star where user_id = '"+req.session.user[0].user_id+"' and dir_id = '"+req.body.id+"'";
        if(req.body.flag == "file"){
            unstarDir = unstarFile;
        }
        mysql.fetchData(function (err, results) {
            console.log("starres");
            res.status(201).json({message:"item unstarred"});
        },unstarDir);
    }
    else{
        res.status(401).json({message:"session expired"});
    }
});

//uploads a single file
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