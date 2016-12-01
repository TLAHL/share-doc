
require.config({
	baseUrl: 'js',
	paths : {
		'jquery' : 'jquery-2.2.0.min',
		'jqueryUI' : 'jquery-ui',
		'widget' : 'widget'
	},
	shim: {
        'jqueryUI': {
            deps: ['jquery']
        }
    }

});

	
require(['jquery','window'], function($,w){
    $("#a").click(function(){
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
		win.on("alert",function(){alert("you click 2 alert handler")})
		win.on("alert",function(){alert("you click 3 alert handler")})
		win.on("close",function(){alert("you click 2 close handler")})

    });
    $("#b").click(function(){
    	new w.Window().confirm({
			title: "系统消息",
			content: "您确定要删除这个文件吗？",
			width: 300,
			height: 150,
			y: 50,
			hasCloseBtn: true,
			text4ConfirmBtn: "是",
			text4CancelBtn: "否",
			dragHandle: ".window_header"
		}).on("confirm",function(){
			alert("确定");
		}).on("cancel",function(){
			alert("取消");
		});

    });

	$("#c").click(function(){
		
		

		new w.Window().prompt({
			title: "请输入你的名字",
			content: "我们将会为你保存您输入的信息。",
			width: 300,
			height: 150,
			x: 550,
			y: 50,
			hasCloseBtn: true,
			text4PromptBtn: "输入",
			text4CancelBtn: "取消",
			defaultValue4PromptInput: "张三",
			dragHandle: ".window_header",
			//handler4PromptBtn: function(inputValue){
			//	alert("您输入的内容是：" + inputValue);
			//},
			//handler4CancelBtn: function(){
			//	alert("取消");
			//},
		}).on("prompt",function(inputValue){
			alert(inputValue);
		}).on("cancel",function(){
			alert("取消");
		});

	});
});
 