
//TODO: If any parameter is invalid, do not query and return an empty object

var TrueWindModel = (function() {
	var tw = {},
		httpResponse,
		mongoose = require('mongoose'),
		true_wind = require('true_wind'),
		config = require('../../config'),
        Sentence = mongoose.model('Sentence'),
        Sentences = mongoose.model('Sentences');

	//browser 
	tw.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	tw.callback = function(error,result){

		var	output = [],
			i;
			
		if(result.length){
			//loop through each document
			for ( i = 0; i < result.length; i++){
				var resultItem = result[i],
					inputs = {},
					outputObj = {},
					j;

				//for each document's sentence
				for (j = 0; j < resultItem.sentences.length; j++){
					//individual if statements allow for checking properties for each scenario
					//else if will cause the wind angle or wind speed to not be set
					if(resultItem.sentences[j].data.hasOwnProperty("apparent_wind_angle")){
						inputs.apparent_wind_angle = resultItem.sentences[j].data.apparent_wind_angle;
					}
					if(resultItem.sentences[j].data.hasOwnProperty("apparent_wind_speed")){
						inputs.apparent_wind_speed = resultItem.sentences[j].data.apparent_wind_speed;
					}
					if(resultItem.sentences[j].data.hasOwnProperty("sow_knots")){
						inputs.speed_over_water = resultItem.sentences[j].data.sow_knots;
					}

				}
				//if we have all the data then build the document item
				if (inputs.hasOwnProperty("apparent_wind_speed") 
					&& inputs.hasOwnProperty("speed_over_water") 
					&& inputs.hasOwnProperty("apparent_wind_angle")){

					outputObj = true_wind.calculate(inputs);
					outputObj.id = resultItem.id;
					outputObj.datetime = resultItem.datetime;
					outputObj.apparent_wind_speed = inputs.apparent_wind_speed;
					outputObj.speed_over_water = inputs.speed_over_water;
					outputObj.apparent_wind_angle = inputs.apparent_wind_angle;

					output.push(outputObj);
				}
				else{
					console.log("no inputs for calculating true wind ");
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
			.where('sentences.talker_type').in(["GPVTG","WIMWV"])
			.select('_id datetime sentences.data.sow_knots sentences.data.apparent_wind_angle sentences.data.apparent_wind_speed')
			.limit(limit)
			.sort({datetime: 'desc'})
			.exec(tw.callback);
	};
	
	return tw;
}());

module.exports = TrueWindModel;