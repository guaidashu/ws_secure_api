var url = require('url');
require("./function");

exports.getParam = function(req, res){
	var param = url.parse(req.url, true).query;
	data = new Object();
	data.name = "奕弈";
	data.age = "18";
	data2 = new Object();
	data2.data = "ok"
	data.data = data2;
	var json = JSON.stringify(data);
	res.write(json);
	res.write("\n");
	res.write(param.name);
	res.write("\n");
	res.write(param.url);
	res.write("\n");
	res.write(test());
	res.end();
}
