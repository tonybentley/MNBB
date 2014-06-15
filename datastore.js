
//A simple way to query all of the most recent sentences logged

var mongoose = require('mongoose'),
	config = require('./config');

mongoose.connect('mongodb://localhost/MNBB');

var sentenceSchema = mongoose.Schema({
	    talker_id: String,
	    sentence: Object,
	    datetime: { type : Date, default: Date.now }
	}),
	//our model declaration
	Sentence = mongoose.model('Sentence', sentenceSchema);

eachTalker();

//setInterval(eachTalker,10000);

function eachTalker(){
	var i,
		talkers = config.nmea.talkers;
	//loop through supported talkers and grab their count
	for (i = 0; i < talkers.length; i++){
		var	talker_id = talkers[i];
		Sentence.find({ talker_id: talker_id }, function(error,result){
			console.log(result[result.length-1]);
		});
	}
	console.log("Requested "+ talkers.length +" queries");
}

