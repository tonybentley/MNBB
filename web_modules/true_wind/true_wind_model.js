
//TODO: If any parameter is invalid, do not query and return an empty object

var TrueWindModel = (function() {
	var tw = {},
		httpResponse,
		mongoose = require('mongoose'),
		true_wind = require('true_wind'),
		config = require('../../config'),
		/*
		sentencesSchema = mongoose.Schema({
	        sentences: Array,
	        datetime: { type : Date, default: Date.now }
	    }),
		*/
		Sentences = mongoose.model('Sentences');

	//browser 
	tw.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
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
				if (inputs.hasOwnProperty("apparent_wind_speed") 
					&& inputs.hasOwnProperty("speed_over_water") 
					&& inputs.hasOwnProperty("apparent_wind_angle")){

					outputObj = true_wind.calculate(inputs);
					outputObj.datetime = datetime;
					outputObj.apparent_wind_speed = inputs.apparent_wind_speed;
					outputObj.speed_over_water = inputs.speed_over_water;
					outputObj.apparent_wind_angle = inputs.apparent_wind_angle;

					output.push(outputObj);
				}
				else{
					console.log("no inputs for calculating true wind for "+datetime);
				}
			}
		}
		httpResponse.write(JSON.stringify(output));
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