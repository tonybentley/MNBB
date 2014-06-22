
/*
Returns HCHDG sentences
*/
var HeadingModel = (function() {
	var heading = {},
		httpResponse,
		mongoose = require('mongoose'),
		config = require('../../config')
		Sentence = mongoose.model('Sentence');

	//browser 
	heading.setHttpResponse = function(cb){
		httpResponse = cb;
	};

	//query response
	heading.callback = function(error,result){
		httpResponse.status(200).write(JSON.stringify(result));
		httpResponse.end();
	};

	heading.query = function(limit){
		if(!limit){
			limit = null;
		}
		Sentence
			.where('talker_type').in(["HCHDG"])
			.sort({datetime: 'desc'})
			.limit(limit)
			.exec(heading.callback);
	};
	
	return heading;
}());

module.exports = HeadingModel;
