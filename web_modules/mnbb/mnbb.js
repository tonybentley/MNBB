//application namespace for Angular
(function() {

	var mnbb  = angular.module("mnbb",[]);

	mnbb.controller("mnbbController", function($scope){
		$scope.info = {
			"title" : "Mariners NMEA Black Box",
			"version" : "0.0.2",
			"description" : "Data logger and user application for marine NMEA 0183 instruments for Raspberry Pi"
		};

		$scope.modules = [
			"depth",
			"gps",
			"heading",
			"speed",
			"true_wind",
			"wind"
		];
	});

}());