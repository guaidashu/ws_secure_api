var express = require('express');
var router = express.Router();
var test = require('../app/test');
require('../app/test');
require("../app/dist/libs/getKey");
require("../app/dist/libs/unzip");



/* GET home page. */
router.get('/', function(req, res, next) {
  runEvel(res);  
});

router.get('/test', function(req, res, next){
	test.getParam(req, res);
});

router.post("/getDocId", function(req, res, next){
	getDocId();
});

router.get('/getParam', function(req, res, next){
	getParam(req, res);
});

module.exports = router;
