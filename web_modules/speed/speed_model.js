
/*
Returns both speed over ground from GPS and speed over water from Knotmeter
*/
var SpeedModel = (function() {
	var speed = {},
		httpResponse,
		mongoose = require('mongoose'),
		config = require('../../config')
		Sentences = mongoose.model('Sentences');

	//browser 
	speed.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	speed.callback = function(error,result){
		var output = [];
		for (var i=0; i<result.length; i++){
			var resultItem = result[i],
				outputObj = {};

			outputObj.id = resultItem.id;
			outputObj.datetime = resultItem.datetime;
			for (var j=0; j < resultItem.sentences.length; j++){
				//gps
				if(resultItem.sentences[j].data.hasOwnProperty("sog")){
					outputObj['sog'] = resultItem.sentences[j].data.sog;
				}
				//knotmeter
				if(resultItem.sentences[j].data.hasOwnProperty("sow_knots")){
					outputObj['sow_knots'] = resultItem.sentences[j].data.sow_knots;
				}
			}
			output.push(outputObj);
		}
		httpResponse.status(200).write(JSON.stringify(output));
		httpResponse.end();
	};

	speed.query = function(limit){
		if(!limit){
			limit = null;
		}
		Sentences
			.where('sentences.talker_type').in(["GPVTG","GPRMC","VWVHW"])
			.sort({datetime: 'desc'})
			.select('sentences.data.sog sentences.data.sow_knots datetime _id')
			.limit(limit)
			.exec(speed.callback);
	};
	
	return speed;
}());

module.exports = SpeedModel;