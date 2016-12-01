define(['jquery'],function($){
	function Widget(){
		//this.boundingBox = null;
		this.handlers = {};
	}
	Widget.prototype = {
		// 监听多个事件
		on : function(type, handler){
			if(typeof this.handlers[type] == 'undefined'){
				this.handlers[type] = [];
			}
			this.handlers[type].push(handler);
			return this;
		},
		// 时间触发
		fire : function(type, data){
			if(this.handlers[type] instanceof Array){
				var handlers = this.handlers[type];
				for (var i = 0,len = handlers.length; i < len; i++) {
					handlers[i](data);
				}
			}
		},
		//renderUI: function(){},
		//bindUI : function(){},
		//syncUI : function(){},
		//render : function(container){                                         // 方法： 渲染组件
		//	this.renderUI();
		//	this.handlers = {};
		//	this.bindUI();
		//	this.syncUI();
		//	$(container || document.body).append(this.boundingBox);
		//},
		//destructor :　function(){},
		//destroy : function(){
		//	this.destructor();
		//	this.boundingBox.off();
		//	this.boundingBox.remove();
		//}
	}
	return { 
		Widget : Widget
	}
});