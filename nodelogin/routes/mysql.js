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

function sqlGroup(callback, values){
    pool.getConnection(function (err, connection) {
        if(err){
            connection.release();
            throw err;
        }
        connection.query('INSERT INTO user_group (group_id, owner_id, permission) VALUES ?', values, function(err,row, fields) {
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
                callback(err,"yes");
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

function addFileToDb(name, content, type, ownerId){
    var addFile = "insert into file_table( dir_id, owner_id, name, type, content) values ('1','"+ownerId+"','"+name+"','"+type+"','"+content+"')";
    insertData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            colsole.log("Insertion error");
        }
    },addFile);
}

exports.addFileToDb = addFileToDb;
exports.fetchData=fetchData;
exports.insertData=insertData;
exports.sqlGroup=sqlGroup;