
var GpsModel = (function() {
	var gps = {},
		httpResponse,
		mongoose = require('mongoose'),
		config = require('../../config')
		Sentence = mongoose.model('Sentence');

	//browser 
	gps.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	gps.callback = function(error,result){
		httpResponse.status(200).write(JSON.stringify(result));
		httpResponse.end();
	};

	gps.query = function(limit){
		if(!limit){
			limit = null;
		}
		Sentence
			.where('talker_type').in(["GPRMC"])
			.sort({datetime: 'desc'})
			.limit(limit)
			.exec(gps.callback);
	};
	
	return gps;
}());

module.exports = GpsModel;
