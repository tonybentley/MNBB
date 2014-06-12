
var net = require('net');
var nmeaParser = require('nmea-0183');

var config = require('./config');

var HOST = config.nmea.host;
var PORT = config.nmea.port;

var net = require('net');
 
var client = new net.Socket();
client.setEncoding('utf8');
client.connect(PORT, HOST, function() {
    console.log("Connected to NMEA TCP Client")
});
 
client.on('data', function(data) {
    parseDataPackets(data);
});

function parseDataPackets(packet){
    //each nmea sentence
    var lines = packet.split("\n");

    var keys = [];

    //loop through the sentences in this data packet
    for (i=0;i<lines.length;i++){
        //NMEA sentence
        var line = lines[i];
        //get the unique key
        var key = line.split(",")[0].replace(/\W+/g, "");;
        //if a parser is available.... otherwise an error gets thrown
        try{
            //if 
            var jsonNmea = nmeaParser.parse(line);
            console.log("parsed: "+key);
            console.log(jsonNmea);
        }
        catch(e){
           console.log(line)
        }
        
    }
}
