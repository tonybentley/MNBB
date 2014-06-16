//TODO: clean up abbreviations, variable and method names. 
var True_Wind = ( function() {
	"use strict";

	var tw = {};

	tw.perRound = function(num, precision)  {
		 var _precision = typeof(precision) == "number" ? precision : 2, 
			result1 = num * Math.pow(10, _precision),
		 	result2 = Math.round(result1),
		 	result3 = result2 / Math.pow(10, _precision);
		return result3.toFixed(_precision);
	};
	tw.deg2rad = function(deg){
		var conv_factor = (2.0 * Math.PI)/360.0;
		return(deg * conv_factor);
	};
	tw.rad2deg = function(rad){
		var conv_factor = 360/(2.0 * Math.PI);
		return(rad * conv_factor);
	};
	tw.calculate = function(obj){
		// Get angle and convert to radians
		var apparent_wind_angle = parseFloat(obj.apparent_wind_angle);
		if (isNaN(apparent_wind_angle)){
			console.log("Please supply a valid value for Difference Between Heading and Apparent Wind Direction");
			return;
		}
		apparent_wind_angle = this.deg2rad(apparent_wind_angle);
		//Get apparent wind speed.  Convert to units to ship's speed if necesssary.
		var apparent_wind_speed = parseFloat(obj.apparent_wind_speed);



		if (isNaN(apparent_wind_speed)){
			console.log("Please supply a valid value for Apparent Wind Speed");
			return;
		}

		// Get ship's speed (if supplied)
		var speed_over_water = parseFloat(obj.speed_over_water);

		if (isNaN(speed_over_water)){
			console.log("The Ship's Speed must be specified if the Apparent Wind Speed is specified in knots.");
			return;
		}

		var apparent_wind_speed = apparent_wind_speed / speed_over_water,
		 	tan_alpha = (Math.sin(apparent_wind_angle) / (apparent_wind_speed - Math.cos(apparent_wind_angle))),
		 	alpha = Math.atan(tan_alpha),
		 	true_wind_angle = this.rad2deg(apparent_wind_angle + alpha),
		 	true_speed_over_water = Math.sin(apparent_wind_angle)/Math.sin(alpha),
		 	returnObject = {
				apparent_speed_over_water: obj.speed_over_water,
				apparent_wind_speed: obj.apparent_wind_speed,
				apparent_wind_angle: obj.apparent_wind_angle,
				true_wind_angle: true_wind_angle,
				true_speed_over_water: true_speed_over_water,
				true_wind_speed: (isNaN(speed_over_water) ? "Unknown" : (true_speed_over_water * speed_over_water)),
				rounded_true_wind_angle: this.perRound(true_wind_angle),
				rounded_true_speed_over_water: this.perRound(true_speed_over_water),
				rounded_true_wind_speed: (isNaN(speed_over_water) ? "Unknown" : this.perRound(true_speed_over_water * speed_over_water))
		};

		return returnObject;

	};

	return tw;

}());

module.exports = True_Wind;
