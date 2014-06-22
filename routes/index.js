

var config = require('../config');
var express = require('express');
var router = express.Router();
var root = {'root': config.server.root_path};
var tw = require('../web_modules/true_wind/true_wind_model.js');
var depth = require('../web_modules/depth/depth_model.js');

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

module.exports = router;
