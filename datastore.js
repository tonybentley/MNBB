
//A simple way to query all GPGLL sentences

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
		query(talker_id);
	}
	
}


function query(talker_id){
	Sentence.find({ talker_id: talker_id }, function(error,result){
		join(talker_id,result);
	});
}

function join(talker_id,result){
		var talkerType = talker_id.substr(2),
			oneResult = result[result.length-1],
			qryResult = {},
			//get talker types to join with model
			typeJoin = function(){
				var types = config.nmea.talker_types,
					i;
				for (i = 0; i < types.length; i++){
					if(types[i].id === talkerType){
						//console.log(types[i])
						return types[i];
					}
				}	
				console.log(talkerType + " not found");
			},
			typeDesc = typeJoin();

		
		if(typeof(oneResult) == "object"){
			//there has to be an easier way...
			qryResult["_id"] = oneResult["_id"];
			qryResult["datetime"] = oneResult["datetime"];
			qryResult["sentence"] = oneResult["sentence"];
			qryResult["talker_id"] = oneResult["talker_id"];
			qryResult["talker_type"] = typeDesc.id;
			qryResult["talker_name"] = typeDesc.name;
			console.log(qryResult);
			console.log("\n");
		}
}

