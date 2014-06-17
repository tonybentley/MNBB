

var config = require('../config');
var express = require('express');
var router = express.Router();
var root = {'root': config.server.root_path};

var tw = require('../web_modules/true_wind/js/true_wind_model.js');


router.get('/true_wind/current', function(req,res){
	tw.setHttpResponse(res);
	tw.query(1);
});


/* GET home page. */
router.get('/true_wind', function(req, res) {
    res.sendfile('web_modules/true_wind/index.html',root);
});


module.exports = router;
