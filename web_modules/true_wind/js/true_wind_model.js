var mongoose = require('mongoose'),
	config = require('../../../config.json'),
	true_wind_calculator = require('./true_wind_calc.js'),
	True_Wind_QO = ( function() {
		//constructor
		"use strict";
		mongoose.connect('mongodb://localhost/MNBB');

		var tw = {};
			tw.sentenceSchema = mongoose.Schema({
			    talker_id: String,
			    sentence: Object,
			    datetime: Date 
			});
			//our model declaration
			tw.Sentence = mongoose.model('Sentence', tw.sentenceSchema);
			tw.inputs = {
					apparent_wind_angle: 0.00,
					apparent_wind_speed: 0.00,
					speed_over_water: 0.00
			};
		//gather the most recent result for retreiving current true wind speed
		tw.queryLast = function(res){
			return tw.Sentence.find({ talker_id: 'WIMWV' }, function(error, result){
				var lastResult = result[result.length-1];
				tw.inputs.apparent_wind_angle = lastResult.sentence.angle;
				tw.inputs.apparent_wind_speed = lastResult.sentence.speed;
				//use the datetime stamp to query the speed using relational data
				tw.Sentence.find({ talker_id: 'GPVTG', datetime: lastResult.datetime }, function(error, result){
					tw.inputs.speed_over_water = result[result.length-1].sentence.knots;
					var twObj = true_wind_calculator.calculate(tw.inputs);
					res.send( JSON.stringify(twObj) );
					
				});
			});
		};

		return tw;

	}());

module.exports = True_Wind_QO;
