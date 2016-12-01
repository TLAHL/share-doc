define(['widget','jquery','jqueryUI'], function(widget,$,$UI){
	function Window(){
		//默认配置
		this.config = {
			width: 500,
			height: 300,
			title: "系统消息",
			content: "",
			hasCloseBtn: false,                                    // 是否添加关闭按钮
            skinClassName: null,                                   // 引入定制样式
            hasMask: true,                                         // 是否为模态窗，默认为true
			isDraggable: true,                                     // 是否可拖动
			dragHandle: null,                                      // 可拖动区域

			handler4AlertBtn: null,                                // alert按钮回调
			handler4PromptBtn: null,                               // prompt按钮回调
			handler4ConfirmBtn: null,                              // confirm按钮回调
			handler4CloseBtn: null,                                // 关闭按钮回调
			handler4CancelBtn: null,                               // 取消按钮回到
			
			text4AlertBtn: "确定",                                 // 定制alert确认按钮文本
			text4ConfirmBtn: "确定",                               // 定制confirm确认按钮文本
			text4PromptBtn: "确定",                                // 定制prompt确认按钮文本
			text4CancelBtn: "取消",                                // 定制取消按钮文本	

			isPromptInputPassword: false,
			defaultValue4PromptInput: "",                          // prompt输入框默认文本
			maxlength4PromptInput: 20,                             // prompt输入框文本最大输入长度
			
			//winType: "common"                                      // 默认弹窗
		};    


	}

	Window.prototype = $.extend({},new widget.Widget(),{

		renderUI : function(){
			var footerContent = "";
			switch(this.config.winType){
				case "alert"  :
				              footerContent	= '<input type="button" value="' + this.config.text4AlertBtn + '"class="window_alertBtn">';
				              break;
				case "confirm":
				              footerContent	= '<input type="button" value="' + this.config.text4ConfirmBtn	+ '"class="window_confirmBtn">' + '<input type="button" value="' + 
				              this.config.text4CancelBtn + '" class="window_cancelBtn">';
				              break;
				case "prompt" :
				              this.config.content += '<p class="window_promptInputWrapper"><input type="' + (this.config.isPromptInputPassword?"password":"text") + 
				              ' "value="' + this.config.defaultValue4PromptInput + ' "maxlength="' + this.config.maxlength4PromptInput + '  "class="window_promptInput"></p>';
				              footerContent	= '<input type="button" value="' + this.config.text4PromptBtn	+ ' "class="window_promptBtn">' + '<input type="button"  value="' + 
				              this.config.text4CancelBtn + ' " class="window_cancelBtn">';
				              break;
			}
			
			this.boundingBox = $(
				'<div class="window_boundingBox">' + 
				       '<div class="window_header">' + this.config.title + '</div>' +
				       '<div class="window_body">' + this.config.content + '</div>' +
				       '<div class="window_footer">' + footerContent + '</div>' +
				'</div>');
			this._promptInput = $(this.boundingBox).find(".window_promptInput");
			if(this.config.hasMask){
				this._mask = $('<div class="window_mask"></div>');
				this._mask.appendTo("body");
			}
			if(this.config.hasCloseBtn){
				this.boundingBox.append('<span class="window_closeBtn">X</span>');
			}
			this.boundingBox.appendTo(document.body);

		},

		bindUI : function(){
			var that = this;
			this.boundingBox.delegate(".window_alertBtn","click",function(){
				that.fire("alert");
				that.destroy();
			}).delegate(".window_closeBtn","click",function(){
				that.fire("close");
				that.destroy();
			}).delegate(".window_confirmBtn","click",function(){
				that.fire("confirm");
				that.destroy();
			}).delegate(".window_cancelBtn","click",function(){
				that.fire("cancel");
				that.destroy();
			}).delegate(".window_promptBtn","click",function(){
				that._promptInput;
				that.fire("prompt",that._promptInput.val());
				that.destroy();
			});
			if(this.config.handler4AlertBtn){
				this.on("alert",this.config.handler4AlertBtn);
			}
			if(this.config.handler4CloseBtn){
				this.on("close",this.config.handler4CloseBtn);
			}
			if(this.config.handler4confirmBtn){
				this.on("confirm",this.config.handler4confirmBtn);
			}
			if(this.config.handler4CancelBtn){
				this.on("cancel",this.config.handler4CancelBtn);
			}
			if(this.config.handler4PromptBtn){
				this.on("prompt",this.config.handler4PromptBtn);
			}
		},

		syncUI : function(){
			this.boundingBox.css({
				width: this.config.width + "px",
				height: this.config.height + "px",
				left: (this.config.x || (window.outerWidth - this.config.width)/2) + "px",
				top: (this.config.y || (window.outerHeight - this.config.height)/2) + "px",
			});
			if(this.config.skinClassName){
				this.boundingBox.addClass(this.config.skinClassName);
			}
			if(this.config.isDraggable){
				if(this.config.dragHandle){
					this.boundingBox.draggable({handle:this.config.dragHandle});
				}else{
					this.boundingBox.draggable();
				}
				
			}
		},

		destructor :　function(){                              // 销毁前判断是否存在遮罩，如果是，移除遮罩
			this._mask && this._mask.remove();
		},
		alert : function(config){
			$.extend(this.config,config,{winType:"alert"});
			this.render();
			return this;
		},

	    confirm : function(config){
	    	$.extend(this.config,config,{winType:"confirm"});
			this.render();
			return this;
		},
		prompt : function(config){
			$.extend(this.config,config,{winType:"prompt"});
			this.render();
			this._promptInput.focus();
			return this;
		}
	});

	return {
		Window : Window
	}
});