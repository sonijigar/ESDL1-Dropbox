var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host    :'localhost',
    user    :'root',
    password:'toor',
    database:'test',
    port    :'3306',
    debug   :false
});

//module.exports = pool;
// function getConnection(){
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'toor',
//         database : 'test',
//         port	 : '3306'
//     });
//     return connection;
// }

function fetchData1(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    //var connection=getConnection();

    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            throw err;
        }
        connection.query(sqlQuery, function(err, rows, fields) {
            connection.release();
            if(err){
                console.log("ERROR: " + err.message);
            }
            else
            {	// return err or result
                console.log("DB Results:"+rows);
                callback(err, "ok");
            }
        });
        connection.on('error', function(err){
            throw err;
            return;
        });
    });
}

function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    //var connection=getConnection();

    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            throw err;
        }
        connection.query(sqlQuery, function(err, rows, fields) {
            connection.release();
            if(err){
                console.log("ERROR: " + err.message);
            }
            else
            {	// return err or result
                console.log("DB Results:"+rows);
                callback(err, rows);
            }
        });
        connection.on('error', function(err){
            throw err;
            return;
        });
    });

    // connection.query(sqlQuery, function(err, rows, fields) {
    //     if(err){
    //         console.log("ERROR: " + err.message);
    //     }
    //     else
    //     {	// return err or result
    //         console.log("DB Results:"+rows);
    //         callback(err, rows);
    //     }
    // });
    // console.log("\nConnection closed..");
    // connection.end();
}
function sqlGetUser(callback, values) {
    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            throw err;
        }
        connection.query('Select user_id from dropbox_users where email in (?)', [values], function (err, res) {
            connection.release();
            if(err) {
                console.log(values);
            }
            else {
                console.log('Success');
                console.log(values);
                callback(err,res);
            }
        });
        connection.on('error',function(err){
            throw err;
            return;
    });

});
}

function getUsers(str, callback, values) {
    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            throw err;
        }
        else{
            connection.query(str, [values], function(err, row, fields){
                connection.release();
                if(err){
                    console.log(values);
                }
                else{
                    console.log('success');
                    callback(err, row);
                }
            })
        }
    })
}
function sqlGroup(callback, values){
    pool.getConnection(function (err, connection) {
        if(err){
            connection.release();
            throw err;
        }
        connection.query('INSERT INTO user_group (group_id, owner_id, permission) VALUES ?', [values], function(err,row, fields) {
            connection.release();
            if(err) {
                console.log(values);
            }
            else {
                console.log('Success');
                callback(err,"yes");
            }
        });
        connection.on('error',function(err){
            throw err;
            return;
        });
    });
}

function mysqlGroup(callback, values){
    pool.getConnection(function (err, connection) {
        if(err){
            connection.release();
            throw err;
        }
        connection.query('INSERT INTO user_group (group_id, owner_id, permission, name) VALUES ?', [values], function(err,row, fields) {
            connection.release();
            if(err) {
                console.log(values);
            }
            else {
                console.log('Success');
                callback(err,"yes");
            }
        });
        connection.on('error',function(err){
            throw err;
            return;
        });
    });
}

function insertData(callback,sqlData){

    //var connection=getConnection();

    pool.getConnection(function(err, connection){
        if(err){
            connection.release();
            throw err;
        }
        connection.query(sqlData, function(err, rows, fields) {
            connection.release();
            if(err){
                console.log("ERROR: " + err.message);
            }
            else
            {	// return err or result
                console.log("DB insertion successful:"+rows);
                callback(err,rows);
            }
        });
        connection.on('error',function(err){
            throw err;
            return;
        });
    });
    // connection.query('INSERT INTO users SET ?',sqlData, function(err, rows, fields) {
    // connection.query(sqlData, function(err, rows, fields) {
    //     if(err){
    //         console.log("ERROR: " + err.message);
    //     }
    //     else
    //     {	// return err or result
    //         console.log("DB insertion successful:"+rows);
    //         callback(err,"yes");
    //     }
    // });
    // console.log("\nConnection closed..");
    // connection.end();
}

function addFileToDb(req, dir, name, content, type, ownerId){
    console.log("Insertion succcessful");
    var checkSharing = "select group_id from dir_table where dir_id = '"+dir+"'";
    fetchData(function(err, res){
        if(res[0].group_id != null) {
            var addFile = "insert into file_table( dir_id, owner_id, name, type, content, group_id) values ('" + dir + "','" + ownerId + "','" + name + "','" + type + "','" + content + "', '"+res[0].group_id+"')";
            insertData(function (err, results) {
                if (err) {
                    throw err;
                    console.log("error");
                }
                else {
                    var fileActivity = "insert into activity_history (user_id, file_id, activity, name) values ('" + req.session.user[0].user_id + "','" + results.insertId + "','1','" + name + "')"
                    fetchData(function (err, res) {
                        console.log("File.js history");
                    }, fileActivity)

                    //console.log(results);
                    console.log("Insertion succcessful");
                }
            }, addFile);
        }
        else{
            var addFile = "insert into file_table( dir_id, owner_id, name, type, content) values ('"+dir+"','"+ownerId+"','"+name+"','"+type+"','"+content+"')";
            insertData(function(err,results){
                if(err){
                    throw err;
                    console.log("error");
                }
                else
                {
                    var fileActivity = "insert into activity_history (user_id, file_id, activity, name) values ('"+req.session.user[0].user_id+"','"+results.insertId+"','1','"+name+"')"
                    fetchData(function(err, res){
                        console.log("File.js history");
                    },fileActivity)

                    //console.log(results);
                    console.log("Insertion succcessful");
                }
            },addFile);
        }
    },checkSharing);



}

exports.addFileToDb = addFileToDb;
exports.fetchData=fetchData;
exports.fetchData1=fetchData1;
exports.insertData=insertData;
exports.sqlGroup=sqlGroup;
exports.sqlGetUser = sqlGetUser;
exports.getUsers = getUsers;
exports.mysqlGroup=mysqlGroup;