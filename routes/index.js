

var config = require('../config'),
	express = require('express'),
	router = express.Router(),
	root = {'root': config.server.root_path},
	tw = require('../web_modules/true_wind/true_wind_model.js'),
	wind = require('../web_modules/wind/wind_model.js'),
	heading = require('../web_modules/heading/heading_model.js'),
	depth = require('../web_modules/depth/depth_model.js');

router.get('/', function(req, res) {
	res.sendfile('public/index.html',root);
});

router.get('/true_wind/:count', function(req, res) {
	tw.setHttpResponse(res);
	tw.query(req.params.count);
});

router.get('/depth/:count', function(req, res) {
	depth.setHttpResponse(res);
	depth.query(req.params.count);
});

router.get('/heading/:count', function(req, res) {
	heading.setHttpResponse(res);
	heading.query(req.params.count);
});

router.get('/wind/:count', function(req, res) {
	wind.setHttpResponse(res);
	wind.query(req.params.count);
});

module.exports = router;
