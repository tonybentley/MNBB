    
var MNBB = {},

    net = require('net'),
    mongoose = require('mongoose'),
    nmeaParser = require('node-nmea'),
    //store some constants here
    config = require('./config'),
    //our data scheme for each sentence
    sentenceSchema = mongoose.Schema({
        talker_id: String,
        sentence: Object,
        datetime: { type : Date, default: Date.now }
    }),
    //our model declaration
    Sentence = mongoose.model('Sentence', sentenceSchema),
    connectionIntervalTime = 10000,
    connectionInterval;
            
mongoose.connect('mongodb://localhost/MNBB');


console.log("Save interval set at "+(10000/1000)+" seconds");

connectToNmeaClient();

//set an interval to connect, grab some data, store the data, then close the connection
setInterval(connectToNmeaClient,connectionIntervalTime);

//open connection, do some stuff then close
function connectToNmeaClient(){

    var client = new net.Socket();

    client.setEncoding('utf8');

    client.connect(config.nmea.port, config.nmea.host, function() {
        console.log("Connected to NMEA TCP Client")
    });
     
    client.on('data', function(data) {
        parseDataPackets(data);
        client.destroy();
    });

    client.on('error', function(err) {
        console.log("Connection error: " + err + " for ip " + HOST);
    });

     client.on('close', function(data) {
        console.log('Connection Closed.');
    });

}





function parseDataPackets(packet){


    //each nmea sentence
    var sentences = packet.split("\n"),
        parsedNmeaSentence,
        storageArray = [],
        talkerTypeArray = [],
        i;

    //loop through the sentences in this data packet
    for (i = 0; i < sentences.length; i++){
        //NMEA sentence
        var sentence = sentences[i],
            //get the unique sentence key
            talkerType = sentence.split(",")[0].replace(/\W+/g, ""),
            jsonSentence,
            success = true,
            isUniqueSentence = talkerTypeArray.indexOf(talkerType) === -1;

        if(isUniqueSentence && talkerType !== ""){

            //if a parser is available.... otherwise an error gets thrown
            try{
                parsedNmeaSentence = nmeaParser.parse(sentence)
            }
            catch(e){
                success = false;
                //handle this gracefully
                console.log("Unable to parse and store sentence type: "+talkerType);
            }//end try

            if (parsedNmeaSentence !== undefined && success === true) {
                //console.log(talkerType);
                //console.log(parsedNmeaSentence);
                talkerTypeArray.push(talkerType);
                storageArray.push(parsedNmeaSentence);
            }
            else{
                //console.log(talkerType);
                //console.log(talkerTypeArray);
            }

        } //end if

    } //end for loop  

    //if there are elements to store
    if(talkerTypeArray.length > 0 && storageArray.length > 0){
        //console.log("Captured: "+talkerTypeArray);
        storeSentenceObjects(storageArray);
    }
    else{
        //console.log(talkerTypeArray.length +", "+ storageArray.length);
        //console.log("Failed to store data.");
    }



}//close function

function storeSentenceObjects(sentences){

    var _sentence,
        sentence,
        i;

    for (i = 0; i < sentences.length; i++){
        sentence = sentences[i],
        talkerid = sentence.id;
        _sentence = new Sentence({talker_id : talkerid, sentence : sentence});
        
        console.log("Saving sentence: "+talkerid+", hash: "+_sentence.id);

        _sentence.save(function (err, _sentence) {
            if (err){
                console.log(err);
            } 
            else{
               console.log("Hash: "+_sentence.id+" with talker ID: "+_sentence.talker_id+" saved.")
            }
        });
        
    }
}












