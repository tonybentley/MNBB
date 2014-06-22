var nmea_worker = (function() {    
    var nw = {},
        net = require('net'),
        config = require('../config'),
        mongoose = require('mongoose'),


        sentenceSchema = mongoose.Schema({
            data: Object,
            talker_type: String,
            datetime: { type : Date, default: Date.now }
        }),
        sentencesSchema = mongoose.Schema({
            sentences: [sentenceSchema],
            datetime: { type : Date, default: Date.now }
        }),
        Sentence = mongoose.model('Sentence',sentenceSchema),
        Sentences = mongoose.model('Sentences',sentencesSchema),

        nmeaParser = require('node-nmea'),
        connectionIntervalTime = 30000,
        connectionDuration = 10000,
        connectionInterval,
        sentencesArray = [],
        talkerTypeArray = [],
        sentencesObject = {}
        unparsedTalkerTypes = [];

    //open connection, do some stuff then close
     nw.connectToNmeaClient = function() {

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
            nw.parseDataPackets(data);
            setTimeout(function(){
                client.destroy();
            }, connectionDuration);
        });

        client.on('error', function(err) {
            console.log("Connection error: " + err );
        });

         client.on('close', function(data) {
            nw.storeSentenceObjects();
            console.log("Unable to parse and store sentence types: "+unparsedTalkerTypes);
            console.log('NMEA TCP Client Connection Closed.\n');
        });

    }


    nw.parseDataPackets = function (packet){

            //each nmea sentence
        var unparsedSentences = packet.split("\n"),
            parsedNmeaSentence,
            i;

        //loop through the sentences in this data packet
        for (i = 0; i < unparsedSentences.length; i++){
            //NMEA sentence
            var  unparsedSentence = unparsedSentences[i],
                //get the unique sentence key
                talkerType =  unparsedSentence.split(",")[0].replace(/\W+/g, ""),
                jsonSentence,
                success = true,
                isUniqueTalker = talkerTypeArray.indexOf(talkerType) === -1,
                isSupportedTalker = config.nmea.talkers.indexOf(talkerType) > -1,
                hasNotBeenParsedYet = unparsedTalkerTypes.indexOf(talkerType) === -1;
            
            if(isUniqueTalker && talkerType !== "" && isSupportedTalker){
                 talkerTypeArray.push(talkerType);
                //if the parser is supported and has not already been parsed in this block
                try{
                    parsedNmeaSentence = nmeaParser.parse( unparsedSentence );
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
                //helpful to log things
                if(talkerType == 'SDDBT'){
                    console.log(parsedNmeaSentence);
                }


                var sentence = new Sentence({'data':parsedNmeaSentence, 'talker_type': talkerType});

                sentence.save(function (err, _sentence) {
                    if (err){
                        console.log(err);
                    } 
                    else{
                       console.log("saved " + _sentence.talker_type);
                    }
                });

                //console.log(talkerType);
                //console.log(parsedNmeaSentence);
                sentencesArray.push(sentence);
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


     nw.storeSentenceObjects = function(){

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

    nw.getRecentSentence = function(talkerType){
        return;
    };

    nw.init = function(){
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
    return nw;
}());
module.exports = nmea_worker;