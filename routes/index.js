
var express = require('express');
var router = express.Router();
var root = {'root': '/Users/tbentley/Sites/MNBB/'};

var tw = require('../web_modules/true_wind/js/true_wind_model.js');


router.get('/true_wind/current', function(req,res){
	tw.queryLast(res);
});


/* GET home page. */
router.get('/true_wind', function(req, res) {
    res.sendfile('web_modules/true_wind/index.html',root);
});


module.exports = router;
