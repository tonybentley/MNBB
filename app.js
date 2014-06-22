var MNBB = {},
    nmea_worker = require("./lib/nmea_worker").init(),
    express = require('express'),
    net = require('net'),
    mongoose = require('mongoose'),
    path = require('path'),
    config = require('./config'),
    root = {'root': config.server.root_path},
 
    routes = require('./routes/index'),
    app = express();
    

mongoose.connect('mongodb://localhost/MNBB');

app.use(routes);
app.use('/js', express.static(__dirname + '/public/js'));  
app.use('/css', express.static(__dirname + '/public/css'));  


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

module.exports = app;
