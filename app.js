var MNBB = {},
    express = require('express'),
    net = require('net'),
    mongoose = require('mongoose'),
    path = require('path'),
    config = require('./config'),
    routes = require('./routes/index'),
    app = express(),
    //This is messed up. Sometimes it fails without it
    sentencesSchema = mongoose.Schema({
        sentences: Array,
        datetime: { type : Date, default: Date.now }
    }),
    Sentences = mongoose.model('Sentences');

mongoose.connect('mongodb://localhost/MNBB');
app.use('/', routes);
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
app.use(express.static(__dirname + '/public'));
module.exports = app;

var nmea_worker = require("./nmea_worker").init();

