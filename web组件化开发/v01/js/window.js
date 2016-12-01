define(['widget','jquery','jqueryUI'], function(widget,$,$UI){
	function Window(){
		//默认配置
		this.config = {
			width: 500,
			height: 300,
			title: "系统消息",
			content: "",
			hasCloseBtn: false,                                    // 是否添加关闭按钮
			handler4AlertBtn: null,                                // 确认按钮回调
			handler4CloseBtn: null,                                // 关闭按钮回调
			skinClassName: null,                                   // 引入定制样式
			text4AlertBtn: "确定",                                 // 定制确认按钮文本
			hasMask: true,                                         // 是否为模态窗，默认为true
			isDraggable: true,                                     // 是否可拖动
			dragHandle: null                                       // 可拖动区域
		};    

	}

	Window.prototype = $.extend({},new widget.Widget(),{
		// 监听多个事件
		//on : function(type, handler){
		//	if(typeof this.handlers[type] == 'undefined'){
		//		this.handlers[type] = [];
		//	}
		//	this.handlers[type].push(handler);
		//	return this;
		//},
		// 时间触发
		//fire : function(type, data){
		//	if(this.handlers[type] instanceof Array){
		//		var handlers = this.handlers[type];
		//		for (var i = 0,len = handlers.length; i < len; i++) {
		//			handlers[i](data);
		//		}
		//	}
		//},



		alert : function(config){
			var CONFIG = $.extend(this.config, config);
			that = this;
			//var CONFIG = this.config;

			// jquery
			var boundingBox = $(
				'<div class="window_boundingBox">' + 
				       '<div class="window_header">' + CONFIG.title + '</div>' +
				       '<div class="window_body">' + CONFIG.content + '</div>' +
				       '<div class="window_footer"><input type="button" value="' + CONFIG.text4AlertBtn +'"></div>' +
				'</div>');
			var btn = boundingBox.find(".window_footer input");
			var mask = null;
			if(CONFIG.hasMask){
				mask = $('<div class="window_mask"></div>');
				mask.appendTo("body");
			}

			boundingBox.appendTo("body");
			

			btn.click(function(){
				//CONFIG.handler4AlertBtn && CONFIG.handler4AlertBtn();
				boundingBox.remove();
				mask && mask.remove();
				that.fire("alert");
			});

			boundingBox.css({
				width: this.config.width + "px",
				height: this.config.height + "px",
				left: (this.config.x || (window.outerWidth - this.config.width)/2) + "px",
				top: (this.config.y || (window.outerHeight - this.config.height)/2) + "px",
			});
			if(CONFIG.hasCloseBtn){
				var closeBtn = $('<span class="window_closeBtn">X</span>');
				closeBtn.appendTo(boundingBox);
				closeBtn.click(function(){
					//CONFIG.handler4CloseBtn && CONFIG.handler4CloseBtn();
					boundingBox.remove();
					mask && mask.remove();
					that.fire("close");
				});
			}
			if(CONFIG.skinClassName){
				boundingBox.addClass(CONFIG.skinClassName);
			}
			if(CONFIG.isDraggable){
				if(CONFIG.dragHandle){
					boundingBox.draggable({handle:CONFIG.dragHandle});
				}else{
					boundingBox.draggable();
				}
				
			}

			if(CONFIG.handler4AlertBtn){
				this.on("alert",CONFIG.handler4AlertBtn);
			}
			if(CONFIG.handler4CloseBtn){
				this.on("close",CONFIG.handler4CloseBtn);
			}
			return this;

		
		},
		confirm : function(){

		},
		prompt : function(){

		}
	});

	return {
		Window : Window
	}
});