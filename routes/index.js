var express = require('express');
var router = express.Router();
var test = require('../app/test');
var getDocId = require("../app/dist/libs/getDocId");
require("../app/dist/libs/getKey");

/* GET home page. */
// router.get('/', function(req, res, next) {
  // res.end(getDocId.getDocId());
// });

router.get('/test', function(req, res, next){
	test.getParam(req, res);
});

router.get('/getParam', function(req, res, next){
	getParam(req, res);
});

module.exports = router;
