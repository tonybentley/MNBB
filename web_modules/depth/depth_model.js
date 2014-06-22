
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
	depth.callback = function(error,result){
		httpResponse.status(200).write(JSON.stringify(result));
		httpResponse.end();
	};

	depth.query = function(limit){
		if(!limit){
			limit = null;
		}
		/*
		{"id":"SDDBT",
		"talker_type_id":"DBT",
		"talker_type_desc":"Depth Below Transducer",
		"depth1":20.9,"depth1_format":"feet",
		"depth2":6.3,"depth2_format":"meters",
		"depth3":3.4,"depth3_format":"fathoms"}
		*/
		Sentence
			.where('talker_type').in(["SDDBT","IIDBT"])
			.limit(limit)
			.exec(depth.callback);
	};
	
	return depth;
}());

module.exports = DepthModel;
