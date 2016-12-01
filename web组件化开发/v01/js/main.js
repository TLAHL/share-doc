require.config({
	baseUrl: 'js',
	paths : {
		'jquery' : 'jquery-2.2.0.min',
		'jqueryUI' : 'jquery-ui'
	}
});

require(['jquery','window'], function($,w){
	$("#a").click(function(){
		
		//new w.Window().alert({
		//	title: "提示",
		//	content: "welcome!",
		//	handler4AlertBtn: function(){
		//		alert("you click the alert button");
		//    },
		//    handler4CloseBtn: function(){
		//		alert("you click the close button");
		//    },
		//	width: 300,
		//	height: 150,
		//	hasCloseBtn: true,
		//	text4AlertBtn: "ok",
		//	dragHandle: ".window_header"
		//});




		var win = new w.Window();
		win.alert({
			title: "提示",
			content: "welcome!",
			//handler4AlertBtn: function(){
			//	alert("you click the alert button");
		    //},
		    //handler4CloseBtn: function(){
			//	alert("you click the close button");
		    //},
			width: 300,
			height: 150,
			hasCloseBtn: true,
			text4AlertBtn: "ok",
			dragHandle: ".window_header"
		}).on("alert",function(){
			alert("the 2 alert handler");
		}).on("alert",function(){
			alert("you click 3 alert handler")
		}).on("close",function(){
			alert("you click 2 close handler")
		});
		//win.on("alert",function(){alert("you click 2 alert handler")})
		//win.on("alert",function(){alert("you click 3 alert handler")})
		//win.on("close",function(){alert("you click 2 close handler")})

	});
});