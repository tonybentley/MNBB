    
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
    connectionIntervalTime = 30000,
    connectionDuration = 10000,
    connectionInterval,
    sentencesArray = [],
    talkerTypeArray = [],
    unparsedTalkerTypes = [];
    
console.log("TCP Client connection interval at "+(connectionIntervalTime/1000)+" seconds");    
console.log("TCP Client open for "+(connectionDuration/1000)+" seconds");       
mongoose.connect('mongodb://localhost/MNBB');

//set an interval to connect, grab some data, store the data, then close the connection
setInterval(connectToNmeaClient,connectionIntervalTime);

//open connection, do some stuff then close
function connectToNmeaClient(){

    var client = new net.Socket(),
        sentencesArray = [],
        talkerTypeArray = [];

    client.setEncoding('utf8');

    client.connect(config.nmea.port, config.nmea.host, function() {
        console.log("Connected to NMEA TCP Client")
    });
     
    client.on('data', function(data) {
        parseDataPackets(data);
        setTimeout(function(){
            client.destroy();
        } ,connectionDuration);
        
    });

    client.on('error', function(err) {
        console.log("Connection error: " + err + " for ip " + HOST);
    });

     client.on('close', function(data) {
        storeSentenceObjects();
        console.log("Unable to parse and store sentence types: "+unparsedTalkerTypes);
        unparsedTalkerTypes = [];
        console.log('NMEA TCP Client Connection Closed.');
        console.log("\n");
    });

}


function parseDataPackets(packet){

        //each nmea sentence
    var unparsedSentences = packet.split("\n"),
        parsedNmeaSentence,
        i;

    //loop through the sentences in this data packet
    for (i = 0; i < unparsedSentences.length; i++){
        //NMEA sentence
        var sentence = unparsedSentences[i],
            //get the unique sentence key
            talkerType = sentence.split(",")[0].replace(/\W+/g, ""),
            jsonSentence,
            success = true,
            isUniqueTalker = talkerTypeArray.indexOf(talkerType) === -1;

        if(isUniqueTalker && talkerType !== "" && config.nmea.talkers.indexOf(talkerType) > -1){
             talkerTypeArray.push(talkerType);
            //if the parser is supported and has not already been parsed in this block
            try{
                parsedNmeaSentence = nmeaParser.parse(sentence);
            }
            catch(e){
                success = false;
                console.log(e);
            }
        }
        else{
            success = false;
            if(unparsedTalkerTypes.indexOf(talkerType) === -1){
                unparsedTalkerTypes.push(talkerType);
            }
            /*
            //if we want to log a specific unsupported talker type sentence
            if(talkerType == 'WIMWV'){
                console.log(e);
            }
            */
        } //end if
        //save the sentence for db transaction
        if(parsedNmeaSentence !== undefined && success === true) {
            //console.log(talkerType);
            //console.log(parsedNmeaSentence);
            sentencesArray.push(parsedNmeaSentence);
        }
        else{
            //console.log(talkerType);
            //console.log(talkerTypeArray);
        }

    } //end for loop  
    /*
    //if there are elements to store
    if(talkerTypeArray.length > 0 && sentencesArray.length > 0){
        //console.log("Captured: "+talkerTypeArray);
     
    }
    else{
        //console.log(talkerTypeArray.length +", "+ storageArray.length);
        //console.log("Failed to store data.");
    }
    */
}


function storeSentenceObjects(){

    var _sentence,
        sentence,
        i;

    for (i = 0; i < sentencesArray.length; i++){
        sentence = sentencesArray[i],
        talkerid = sentence.id;
        _sentence = new Sentence({talker_id : talkerid, sentence : sentence});
        
        console.log("Saving sentence: "+talkerid+", hash: "+_sentence.id);

        _sentence.save(function (err, _sentence) {
            if (err){
                console.log(err);
            } 
            else{
               console.log("Hash: "+_sentence.id+" with talker ID: "+_sentence.talker_id+" saved.");
               /*
                //to see a given sentence database structure
               if(_sentence.talker_id == 'WIMWV'){
                    console.log(_sentence);
               }
               */
            }
        });
    }
}

