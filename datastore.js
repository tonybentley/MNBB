
//A simple way to query all GPGLL sentences

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/MNBB');

var sentenceSchema = mongoose.Schema({
	    talker_id: String,
	    sentence: Object,
	    datetime: { type : Date, default: Date.now }
	}),
	//our model declaration
	Sentence = mongoose.model('Sentence', sentenceSchema);


Sentence.find({ talker_id: /^GPGLL/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPGLL");
});

Sentence.find({ talker_id: /^GPRMC/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPRMC");
});

Sentence.find({ talker_id: /^GPVTG/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPVTG");
});

Sentence.find({ talker_id: /^GPGGA/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPGGA");
});

Sentence.find({ talker_id: /^GPGSA/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPGSA");
});

Sentence.find({ talker_id: /^GPGSV/ }, function(error,result){
	console.log("Returned "+Object.keys(result).length+" results for talker ID: GPGSV");
});

