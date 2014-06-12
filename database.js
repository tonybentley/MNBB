var mysql = require('mysql');
var config = require('./config.json');


var connection = mysql.createConnection(config.mysql);
 
connection.connect();
 
var query = connection.query('SELECT * FROM sentences');
 
query.on('error', function(err) {
    throw err;
});
 
query.on('fields', function(fields) {
   // console.log(fields);
});
 
query.on('result', function(row) {
    
});
 
connection.end();