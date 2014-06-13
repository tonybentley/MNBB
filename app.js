
var net = require('net'),
    nmeaParser = require('node-nmea'),
    config = require('./config'),
    HOST = config.nmea.host,
    PORT = config.nmea.port,
    client = new net.Socket();

client.setEncoding('utf8');

client.connect(PORT, HOST, function() {
    console.log("Connected to NMEA TCP Client")
});
 
client.on('data', function(data) {
    parseDataPackets(data);
});

client.on('error', function(err) {
    console.log("Connection error: " + err + " for ip " + HOST);
});

function parseDataPackets(packet){
    //each nmea sentence
    var sentences = packet.split("\n"),
        i

    //loop through the sentences in this data packet
    for (i = 0; i < sentences.length; i++){
        //NMEA sentence
        var sentence = sentences[i],
            //get the unique sentence key
            talkerType = sentence.split(",")[0].replace(/\W+/g, ""),
            jsonSentence;
        //if a parser is available.... otherwise an error gets thrown
        try{
            jsonSentence = nmeaParser.parse(sentence);
            console.log("parsed: "+talkerType);
            console.log(jsonSentence);
        }
        catch(e){
            //handle this gracefully
           console.log(sentence)
        }
    }
}
