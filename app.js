
var net = require('net');

var nmea   = require('nmea-0183');

var HOST = '192.168.0.101';
var PORT = 39150;

var net = require('net');
 
var client = new net.Socket();
client.setEncoding('utf8');
client.connect(PORT, HOST, function() {
    console.log("connected to NMEA TCP Client")
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
        try{
            var jsonNmea = nmea.parse(line);
            console.log(jsonNmea)
        }
        catch(e){
            console.log(e)
        }
        


console.log(jsonNmea);
        /*if(keys.indexOf(key) === -1){
            keys.push(key);
            console.log(line)
        }
        else{
            console.log("dup");
        }*/
    }


}

function uniqueKeys(objects) {
  var keys = objects.reduce(function (collector, obj) {
    Object.keys(obj).forEach(function (key) {
      collector[key] = true;
    });
    return collector;
  }, {});
  return Object.keys(keys);
}