function handle(data){
	var result = new Object();
	for (i in data.RelateInfo){
		if (data.RelateInfo[i].key == "reason"){
			result.case_reason = data.RelateInfo[i].value;
		}
		if (data.RelateInfo[i].key == "trialDate"){
			result.cp_date = data.RelateInfo[i].value;
		}
		if (data.RelateInfo[i].key == "appellor"){
			result.litigant = data.RelateInfo[i].value;
		}
	}
	for (i in data.LegalBase){
		result.legislative_authority = data.LegalBase[i];
	}
	return JSON.stringify(result);
}


function handleFlfg(req, res){
	// res.setCharacterEncoding("utf-8");
	var data = req.body.data;
	// change str to json Object
	data = eval('(' + data + ')');
	res.writeHead(200, {"Content-Type":"application/json;charset=utf-8"});
	// data = {Elements: ["RelateInfo", "LegalBase"],RelateInfo: [{ name: "审理法院", key: "court", value: "最高人民法院" },{ name: "案件类型", key: "caseType", value: "民事案件" },{ name: "案由", key: "reason", value: "合同纠纷" },{ name: "审理程序", key: "trialRound", value: "二审" },{ name: "裁判日期", key: "trialDate", value: "2018-01-02" },{ name: "当事人", key: "appellor", value: "联通华盛通信有限公司,重庆商社信息科技有限公司" }],LegalBase: [{法规名称:'《中华人民共和国民事诉讼法》',Items:[{法条名称:'第一百七十条',法条内容:'第一百七十条   系统尚未收录或引用有误&amp;#xA;'},{法条名称:'第一百七十一条',法条内容:'第一百七十一条   系统尚未收录或引用有误&amp;#xA;'}]}]};
	res.end(handle(data));
}

global.handleFlfg = handleFlfg;