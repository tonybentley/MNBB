
var WindModel = (function() {
	var wind = {},
		httpResponse,
		mongoose = require('mongoose'),
		config = require('../../config')
		Sentence = mongoose.model('Sentence');

	//browser 
	wind.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	wind.callback = function(error,result){
		httpResponse.status(200).write(JSON.stringify(result));
		httpResponse.end();
	};

	wind.query = function(limit){
		if(!limit){
			limit = null;
		}
		Sentence
			.where('talker_type').in(["IIMWV","WIMWV"])
			.sort({datetime: 'desc'})
			.limit(limit)
			.exec(wind.callback);
	};

	wind.max = function(){
		Sentences
			.where('sentences.talker_type').in(["IIMWV","WIMWV"])
			.select('datetime sentences.data.apparent_wind_speed')
			.sort({'sentences.data.apparent_wind_speed': 'desc'})
			.limit(1)
			.exec(wind.callback);
	};

	
	return wind;
}());

module.exports = WindModel;
