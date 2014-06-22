
var DepthModel = (function() {
	var depth = {},
		httpResponse,
		mongoose = require('mongoose'),
		config = require('../../config')
		Sentence = mongoose.model('Sentence');

	//browser 
	depth.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	depth.callback = function(error, result){
		httpResponse.status(200).write(JSON.stringify(result));
		httpResponse.end();
	};

	depth.query = function(limit){
		if(!limit){
			limit = null;
		}
		Sentence
			.where('talker_type').in(["SDDBT","IIDBT"])
			.sort({datetime: 'desc'})
			.limit(limit)
			.exec(depth.callback);
	};
	
	return depth;
}());

module.exports = DepthModel;
