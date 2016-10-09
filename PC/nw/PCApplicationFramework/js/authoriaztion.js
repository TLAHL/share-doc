var fs = require('fs');
const https = require("https");
var ticket;
GetAccount = function(cardid, onSuccess, onError){
	var uri = "/account/name/"+cardid;
	var options ={
		host:"11.12.110.129",
		port:6006,
		path:"https://11.12.110.129:6006/account-api"+uri,
		//ca: [fs.readFileSync('ca.cer')],
		rejectUnauthorized:false,
		method:"GET"
		}
		
	try{
		
		var req = https.request(options,function(res){
			console.log("statusCode: ", res.statusCode);
			res.setEncoding('utf-8');
			res.on('data',function(d){
					console.log(d);
					if(onSuccess){
						onSuccess(d);
					}
				})
			});
			
		req.end();

		req.on('error',function(e){
			console.log(e);
			onError(e);
			});
	}
	catch(e){
		return e.message;
	}
}

Login = function(cardid,pin,atplus, onSuccess, onError){
	var post_data= {
		"clientModel" : "ACTOMA ACE",
		"clientType" : 3,
		"clientVersion" : "0.2.1.150813",
		"loginType" : 3,
		"osName" : "Android",
		"osVersion" : "5.0.2",
		"pnToken" : cardid,
		"resource" : cardid
		}
	
	var options ={
		host:"11.12.110.129",
		port:6001,
		path:"https://11.12.110.129:6001/as-api/login/single",
		//ca: [fs.readFileSync('ca.cer')],
		rejectUnauthorized:false,
		method:"POST"
		}
		
	try{
		var headers = atplus.GetHeaders(cardid, pin,"/login/single","POST",JSON.stringify(post_data));
		options.headers = JSON.parse(headers);
		
		var req = https.request(options,function(res){			
			res.setEncoding('utf-8');
			res.on('data',function(d){
				console.log(d);
				if(onSuccess){
						onSuccess(d);
					}
				})
			});
			
		req.write(JSON.stringify(post_data));
		req.end();

		req.on('error',function(e){
			console.log(e);
			onError(e);
			});
	}
	catch(e){
		return e.message;
	}
}

GetFriendList = function(cardid,pin,Serial,atplusObj){
	if(ticket==null||ticket==""||ticket==undefined){
		return 0;
	}
	
	var uri = "/friends?lastQuerySerial=" + Serial;	
	var options ={
		host:"11.12.110.129",
		port:6003,
		path:"https://11.12.110.129:6003/friend"+uri,
		//ca: [fs.readFileSync('ca.cer')],
		rejectUnauthorized:false,
		method:"GET"
		}
		
	try{
		var headers = atplusObj.GetHeaders(cardid, pin,uri,"GET","");
		options.headers = JSON.parse(headers);
		options.headers.ticket = ticket;
		
		var req = https.request(options,function(res){
			console.log("statusCode: ", res.statusCode);
			console.log("headers: ", options.headers);
			res.setEncoding('utf-8');
			res.on('data',function(d){
				console.log(d);
				ticket = JSON.parse(d).ticket;
				})
			});
			
		req.end();

		req.on('error',function(e){
			console.log(e);
			});
	}
	catch(e){
		return e.message;
	}
}

GetAccountInfo = function(cardid,pin,atplusObj, onSuccess){
	if(ticket==null||ticket==""||ticket==undefined){
		return 0;
	}
	
	var uri = "/account/info";	
	var options ={
		host:"11.12.110.129",
		port:6006,
		path:"https://11.12.110.129:6003/account-api/account/info",
		//ca: [fs.readFileSync('ca.cer')],
		rejectUnauthorized:false,
		method:"GET"
		}
		
	try{
		var headers = atplusObj.GetHeaders(cardid, pin,uri,"GET","");
		options.headers = JSON.parse(headers);
		options.headers.ticket = ticket;
		
		var req = https.request(options,function(res){
			res.setEncoding('utf-8');
			res.on('data',function(d){
				console.log(d);
				onSuccess(JSON.parse(d));
				})
			});
			
		req.end();

		req.on('error',function(e){
			console.log(e);
			});
	}
	catch(e){
		return e.message;
	}
}