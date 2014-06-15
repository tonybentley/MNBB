//TODO: clean up abbreviations, variable and method names. 
var True_Wind = ( function() {
	"use strict";

	var tw = {};

	tw.perRound = function(num, precision)  {
		var precision = 2; //default value if not passed from caller, change if desired
		// remark if passed from caller
		precision = parseInt(precision); // make certain the decimal precision is an integer
		var result1 = num * Math.pow(10, precision),
		 	result2 = Math.round(result1),
		 	result3 = result2 / Math.pow(10, precision);
		return this.zerosPad(result3, precision);
	};

	tw.zerosPad = function(rndVal, decPlaces) {
		var valStrg = rndVal.toString(),// Convert the number to a string
		 	decLoc = valStrg.indexOf("."), // Locate the decimal point
		 	decPartLen;

		// check for a decimal 
		if (decLoc == -1) {
		    decPartLen = 0; // If no decimal, then all decimal places will be padded with 0s
		    // If decPlaces is greater than zero, add a decimal point
		    valStrg += decPlaces > 0 ? "." : "";
		}
		else {
		    decPartLen = valStrg.length - decLoc - 1; // If there is a decimal already, only the needed decimal places will be padded with 0s
		}

		var totalPad = decPlaces - decPartLen;    // Calculate the number of decimal places that need to be padded with 0s

		if (totalPad > 0) {
		    // Pad the string with 0s
		    for (var cntrVal = 1; cntrVal <= totalPad; cntrVal++) {
		        valStrg += "0";
		    }

			return valStrg;
		}
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
		 	tdiff = this.rad2deg(apparent_wind_angle + alpha),
		 	tspeed = Math.sin(apparent_wind_angle)/Math.sin(alpha);

		return {
			apparent_speed_over_water: obj.speed_over_water,
			apparent_wind_speed: obj.apparent_wind_speed,
			apparent_wind_angle: obj.apparent_wind_angle,
			true_wind_angle: tdiff,
			true_speed_over_water: tspeed,
			true_wind_speed: (isNaN(speed_over_water) ? "Unknown" : (tspeed * speed_over_water)),
			rounded_true_wind_angle: this.perRound(tdiff),
			rounded_true_speed_over_water: this.perRound(tspeed),
			rounded_true_wind_speed: (isNaN(speed_over_water) ? "Unknown" : this.perRound(tspeed * speed_over_water))
		};

	};

	return tw;

}());

module.exports = True_Wind;
