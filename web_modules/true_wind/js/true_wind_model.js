
var TrueWindModel = (function() {
	var tw = {},
		httpResponse,
		mongoose = require('mongoose'),
		true_wind = require('true_wind'),
		config = require('../../../config'),
		sentencesSchema = mongoose.Schema({
	        sentences: Array,
	        datetime: { type : Date, default: Date.now }
	    }),
		Sentences = mongoose.model('Sentences',sentencesSchema);
	tw.setHttpResponse = function(cb){
		httpResponse = cb;
	};
	tw.callback = function(error,result){

		var	inputs = {},
			outputObj = {},
			output = [];

		if(result.length){
			for(var i = 0; i < result.length; i++){
				
				var sentences = result[i].sentences;
				var datetime = result[i].datetime;
				for(var j = 0; j < sentences.length; j++){

					var sentence  =  sentences[j];

					for(key in sentence){
						inputs[key] = sentence[key]
					}
					if(inputs.hasOwnProperty("sow_knots")){
						inputs.speed_over_water = inputs.sow_knots;
						delete(inputs.sow_knots);
					}
			
				}

				outputObj = true_wind.calculate(inputs);
				outputObj.datetime = datetime;
				output.push(outputObj);
				
			}
		}
		httpResponse.write(JSON.stringify(outputObj));
		httpResponse.end();
	};
	tw.query = function(limit){
		if(!limit){
			throw new Error("Provide a limit to query");
		}
		Sentences
			.where('sentences.id').in(["GPVTG","WIMWV"])
			.select('datetime sentences.sow_knots sentences.apparent_wind_angle sentences.apparent_wind_speed')
			.limit(limit)
			.sort({datetime: 'desc'})
			.exec(tw.callback);
	};
	return tw;
}());

module.exports = TrueWindModel;