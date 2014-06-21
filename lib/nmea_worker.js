    
var nmea_worker = {},
    net = require('net'),
    config = require('../config'),
    mongoose = require('mongoose'),
    nmeaParser = require('node-nmea'),
    connectionIntervalTime = 20000,
    connectionDuration = 10000,
    connectionInterval,
    sentencesArray = [],
    talkerTypeArray = [],
    sentencesObject = {}
    unparsedTalkerTypes = [];

//open connection, do some stuff then close
 nmea_worker.connectToNmeaClient = function() {

    var client = new net.Socket();

    //reset for a new group
    sentencesArray = [];
    talkerTypeArray = [];
    sentencesObject = {};
    unparsedTalkerTypes = [];

    client.setEncoding('utf8');

    client.connect(config.nmea.port, config.nmea.host, function() {
        console.log("Connected to NMEA TCP Client")
    });
     
    client.on('data', function(data) {
        nmea_worker.parseDataPackets(data);
        setTimeout(function(){
            client.destroy();
        }, connectionDuration);
    });

    client.on('error', function(err) {
        console.log("Connection error: " + err );
    });

     client.on('close', function(data) {
        nmea_worker.storeSentenceObjects();
        console.log("Unable to parse and store sentence types: "+unparsedTalkerTypes);
        console.log('NMEA TCP Client Connection Closed.\n');
    });

}


nmea_worker.parseDataPackets = function (packet){

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
            isUniqueTalker = talkerTypeArray.indexOf(talkerType) === -1,
            isSupportedTalker = config.nmea.talkers.indexOf(talkerType) > -1,
            hasNotBeenParsedYet = unparsedTalkerTypes.indexOf(talkerType) === -1;
        /*
        //helpful to log things
        if(talkerType == 'VWVHW'){
            console.log(isSupportedTalker);
        }
        */
        if(isUniqueTalker && talkerType !== "" && isSupportedTalker){
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
            if(hasNotBeenParsedYet && !isSupportedTalker){
                unparsedTalkerTypes.push(talkerType);
            }
            
        } 
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
};


 nmea_worker.storeSentenceObjects = function(){

    var insertObj = {},
        sentence = {},
        sentences,
        Sentences = mongoose.model('Sentences'),
        i;

    insertObj["sentences"] = sentencesArray;
    
    sentences = new Sentences(insertObj);
    sentences.save(function (err, _sentence) {
        if (err){
            console.log(err);
        } 
        else{
           console.log("saved on: "+sentences.datetime);
        }
    });

};

nmea_worker.init = function(){
    var error;
    console.log("TCP Client connection interval at "+(connectionIntervalTime/1000)+" seconds");    
    console.log("TCP Client open for "+(connectionDuration/1000)+" seconds");       
    //smoke test for a single insert
    try{
        this.connectToNmeaClient();
    }
    catch(e){
        error = e;
    }
    
    //set an interval to connect, grab some data, store the data, then close the connection
    //keep it running for logging data
    if(!error){
        setInterval(this.connectToNmeaClient,connectionIntervalTime);
    }
    else{
        console.log("unable to connect:");
        console.log(error);
    }
    
};

module.exports = nmea_worker;