var wrong = $("h5.info");

function downloadFile(){
	window.location.href =  base + '/download.do?fileName=readCard.rar';
}

function refrshThis(){
	location.href = base + '/login.do';
}

function refrshThis_sy(){
	location.href = 'http://www.safecenter.com';
}

//错误描述
var errorDesc = {
	'0':'未安装安全控件，请<a href="javascript:" onclick="downloadFile()">下载</a>安装',
	'3':'安全控件有新版啦，请重新<a href="javascript:" onclick="downloadFile()">下载</a>安装',
	'4':'安全控件有新版啦，可以选择<a href="javascript:" onclick="downloadFile()">下载</a>安装',
	'-100':'您的USB Key不支持，请使用新版USB Key'
};

//错误页面信息
var errorStatus = {
		's0':{'msg':'未安装安全控件', 'imgurl':'/theme/secondDefault/images/no-key.png','errortip':'登录个人中心前，请先<a href="javascript:" onclick="downloadFile()">下载安装</a>安全控件','descbottom':'','descbottom2':'<span class="icon-question" style="padding-left: 5px;position: absolute;">?</span> <a href="javascript:void(0);" style="margin-left: 28px;" onclick="openDialog_s0()">安全控件下载安装失败？</a>'},
		's1':{'msg':'强制升级', 'imgurl':'/theme/secondDefault/images/no-key.png','errortip':'为了支持更多的安全业务，安全控件已经升级，赶快<a href="javascript:" onclick="downloadFile()">下载更新</a>吧！','descbottom':'','descbottom2':'<span class="icon-question" style="padding-left: 5px;position: absolute;">?</span> <a href="javascript:void(0);" style="margin-left: 28px;" onclick="openDialog_s0()">安全控件下载安装失败？</a>'},
		's2':{'msg':'非强制升级', 'imgurl':'/theme/secondDefault/images/no-key.png','errortip':'为了支持更多的安全业务，安全控件已经升级，赶快<a href="javascript:" onclick="downloadFile()">下载</a>更新吧！','descbottom':'','descbottom2':'<span class="icon-question" style="padding-left: 5px;position: absolute;">?</span> <a href="javascript:void(0);" style="margin-left: 28px;" onclick="openDialog_s0()">安全控件下载安装失败？</a>'},
		's3':{'msg':'USBKey未插入','imgurl':'/theme/secondDefault/images/no-ukeypic.png','errortip':'未检测到USB Key，请插入USB Key后<a href="javascript:" onclick="refrshThis()">刷新</a>页面','descbottom':'USB Key存放在你购买的手机、路由器等设备的包装盒内','descbottom2':'<span class="icon-question" style="padding-left: 5px;position: absolute;">?</span> <a href="javascript:void(0);" style="margin-left: 28px;" onclick="openDialog_s3()">已插入USB Key，但仍未检测到USB Key?</a>'},
		's4':{'msg':'USBKey未初始化','imgurl':'/theme/secondDefault/images/no-cloud.png','errortip':'该USB Key信息未被录入云端，请咨询客服解决<br/>客服电话：400-888-7801','descbottom':'','descbottom2':'卡号：'},
		's5':{'msg':'USBKey不可用','imgurl':'/theme/default/images/nonet.png','errortip':'您的USB Key暂不可用，请咨询客服：400-888-7801','descbottom':''},
		's6':{'msg':'USBKey锁死','imgurl':'/theme/default/images/nonet.png','errortip':'USB Key已被锁死，只有解锁后才能使用','errortip2':'请使用USB Key同安通帐号下的手机扫描解锁','descbottom2':'请使用ACE手机中的【设置-帐户-安通帐号】中的“扫一扫”扫描解锁'},
		's7':{'msg':'登录时只能插入一个USB Key','imgurl':'','errortip':'登录时只能插入一个USB Key','errortip2':'','descbottom2':''},
		's8':{'msg':'个人中心不支持当前游览器','imgurl':'','errortip':'','errortip2':'','descbottom2':''}
};

//通用错误页面的显示
function showErrorStatus(status) {
	//var info = errorStatus[status];
	//alert(info.imgurl +'~~'+ info.errortip);
	
	$('.login-form-ok').hide();
	$('.bgdiv').hide();
	
	if (status == 's0') {
		$('.login-form-error-s0').show();
		return;
	} else if(status == 's1') {
		$('.login-form-error-s1').show();
		return;
	} else if(status == 's3') {
		$('.login-form-error-s3').show();
		return;
	} else if(status == 's4') {
		$('.login-form-error-s4').show();
		return;
	} else if(status == 's5') {
		$('.login-form-error-s5').show();
		return;
	} else if(status == 's6') {
		$('.login-form-error-s6').show();
		return;
	} else if(status == 's7') {
		$('.login-form-error-s7').show();
		return;
	}
}

//检测游览器及版本
function checkBrowser(){}

//初始化安全控件
var plugin, loginPage = function(){

	//如果检测到壳就不进行浏览器校验
	if(typeof safekey === 'object') {
	
	} else {
		
		//检测游览器及版本		
		var explorer =navigator.userAgent ;
		//ie Chrome firefox Opera
		var flag = explorer.indexOf("MSIE") >= 0 
				    || explorer.indexOf("Firefox") >= 0
					 || explorer.indexOf("Chrome") >= 0
					  || explorer.indexOf("Opera") >= 0;
		//console.info(explorer);
		//alert(explorer);
		//Chrome不支持42版本之上的版本,如:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36
		if(explorer.indexOf("Chrome") >= 0) {
			var str = explorer.split("/");
			var a = str[str.length-2]
			if(a.indexOf(".") >=0 ) {
				var str2 = a.split(".");			
				//alert(str2[0]);
				if( str2[0] > 42 ) {
					flag = false;
				}
			}
		}
		
		if (!flag) {
			//个人中心 不支持 当前游览器
			$('.login-form-ok').hide();
			$('.bgdiv').hide();
			$('.login-form-error-ylqxz').show();
			return;
		}
	}
	//检测游览器及版本 END
	
	plugin = Card.ready(function(data){

		if(!data.success) { //卡控件未安装
			if (data.code == 3) {
				//强制升级
				showErrorStatus('s1');
				return;
			} else {
				//未安装安全控件
				showErrorStatus('s0');
				return;
			}
		}
		
		if(this.newVer) {//控件版本大于最低版本小于当前版本(有更新,但不强制)
			//非强制升级
			if(!errorMessage) wrong.addClass('wrong-bg').html(errorDesc[4]);
		}
		
		var card = checkCard(this);
		if(!card) {
			$('#userName-container').text('');
			return;
		}
		
		var ret = card.getPinTryCount();
		if(!ret.success) { //检测是否锁死
			if(ret.isLock){
				
				//登录环境检测完毕
				$('.login-form-jcdl').hide();
				$('.login-form-ok').show();
				
				wrong.addClass('wrong-bg').html('USB Key已锁死，请<a href="javascript:" class="usbkey-lock">解锁</a>后重试');
				$('#unlock-container').html('<a href="javascript:" class="usbkey-lock">USB Key锁死？</a>');
				$('.usbkey-lock').data('card', card).click(function(){openQrCode.call(this, '/USBKeyUnlock/toUkeyUnlock.do')});
				$('.usbkey-lock').trigger("click");
				
				pullCard(this, card);
				return ;
			}
			
			if(ret.code != -100){
				
				//登录环境检测完毕
				$('.login-form-jcdl').hide();
				$('.login-form-ok').show();
				
				wrong.addClass('wrong-bg').html(errorDesc[ret.code] || ret.message);
				pullCard(this, card);
				return ;
			}
		}
		
		if(card) {
			var _this = this;
			getAccount(this, card, function(data){
				
				//登录环境检测完毕
				$('.login-form-jcdl').hide();
				$('.login-form-ok').show();
				
				$('#btn-login').click(btnSubmit);
				pullCard(_this, card);
			});
		}

	});
};
setTimeout(loginPage, 200);

/**
 * 拔卡监听
 * @param plugin
 * @param card
 */
function pullCard(plugin, card){
	//监听拔卡
	card.onpullcard(function(){
//		wrong.addClass('wrong-bg').html('请插入您的USB Key，然后<a href="javascript:" onclick="refrshThis()">刷新</a>本页面');
//		$('#userName-container').text('插入USB Key后自动显示');
//		$('#userName').val('');
//		$('#unlock-container').html('USB Key锁死？');
//		$('#bind-container').html('绑定USB Key');
//		$('#btn-login').unbind('click');
		
		//USBKey未插入
		showErrorStatus('s3');
	});
}

//检测安全卡是否可用
function checkCard(plugin){
	if(plugin.error) {
		return;
	}
	
	//读取安全卡(uk和TF)
	var cards = plugin.readUserUSBKeyCard(); //读取Ukey
	cards.push(plugin.readUserTFCard()); //读取TF卡并且和Ukey组装到一起
	
	if(!cards.length){//USBKey未插入
		showErrorStatus('s3');
		return ;
	}

	if(cards.length > 1) {//插入了多张usbkey
		showErrorStatus('s7');
		return;
	}

	var cardId = cards[0].getCardId();
	if(cardId == 'changeSafePin'){
		wrong.addClass('wrong-bg').html('您已修改安全口令，必须关闭浏览器的所有窗口，然后重新登录');
		
		//登录环境检测完毕
		$('.login-form-jcdl').hide();
		$('.login-form-ok').show();

		return;
	}
	
	return cards[0];
}


/**
 * 检测ukey状态
 */
function getAccount(plugin, card, success){
	var reqData = {};
	success = success || $.noop;
	
	var ret = card.getCertEx(pageConfig.container, pageConfig.certType);
	if(!ret.success) {
		wrong.addClass('wrong-bg').html(errorDesc[ret.code] || ret.message);
		return ;
	}
	
	$.ajax({
		url:base + '/getAccount.do?r=' + Math.random(),
		type:'post',
		data:(reqData = {cert:ret.cert,supportB64:supportB64}),
		success:function(data){
			if(data.success) {
				success.call(this, data);
				$('#userName').val(data.account).data('cert', reqData.cert).data('username', data.account);
				$('#userName-container').text(data.account);
				if (data.avatar || data.imagePath) {
					if (supportB64) {
						$('.pmc-head-img').attr('src', data.avatar);
					} else {
						$('#user-head-img').attr('src', base + "/" + data.imagePath);
						$('#user-head-img').css('margin-left','8px');
					}
				}
				
				return ;
			}
			
			if(data.status == 's4'){//USBKey未初始化
				showErrorStatus('s4');
				$('#s4-cardNo').append(data.cardNo);
				pullCard(plugin, card);
				return;
			} else if(data.status == 's5') {//USBKey不可用
				showErrorStatus('s5');
				pullCard(plugin, card);
				return;				
			} else if(data.status == '-s') {//USBKey为绑定账号信息
				showErrorStatus('s5');
				pullCard(plugin, card);
				return;				
			}
			
			wrong.addClass('wrong-bg').html(data.message);
			if($('.bind-card').length > 0) {
				$('#bind-container').html('<a href="javascript:" class="bind-card">绑定USB Key</a>');
				$('.bind-card').data('card', card).click(function(){openQrCode.call(this, '/UsbKeyBind/toUkeyBind.do')});
				pullCard(plugin, card);
			}
		},
		error:function(){
			wrong.addClass('wrong-bg').html('网络异常，请稍候重试');
		}
	});
}

var isLoginLock = false; //是否是由于输错PIN码
// 用户名密码登录按钮事件
function btnSubmit(){
	var $this = $(this).unbind('click');
	
	var dlz = base + '/theme/secondDefault/images/loadinglb5.gif';
	var loadingImg = '<img class="loadingImg" src="'+dlz+'" style="width: 18px;"/>';
	$('#btn-login').after(loadingImg);
	$('#btn-login').val('登录中');
	
	var fn = function(){
		
		var card = checkCard(plugin);
		if(!card) {
			$this.click(btnSubmit);
			$('#btn-login').val('个人登录');
			$('.loadingImg').remove();
			
			setTimeout(function(){
				$("#pin-pwd").focus();
			}, 2000);
			return;
		}
		if(!checkForm()) {
			$this.click(btnSubmit);
			$('#btn-login').val('个人登录');
			$('.loadingImg').remove();
			
			setTimeout(function(){
				$("#pin-pwd").focus();
			}, 2000);
			return ;
		}
		
		var ret = card.checkPin($("#pin-pwd").val());
		if(!ret.success) {
			keydownTemp = false;
			
			if(ret.code > 0){
				isLoginLock = true;
				
				if (ret.code > 5) {//前五次信息提示
					wrong.addClass('wrong-bg').html('安全口令错误，请重试');
					
					setTimeout(function(){
						$("#pin-pwd").focus();
					}, 2000);
				} else {//后五次弹出框提示
					//$alert('安全口令错误，您还有' + ret.code + '次机会' + (ret.code == 1?'，再次输错将锁死USB Key':'，再连续输错'+ret.code+'次将锁死USB Key'));
					var dialogList = art.dialog.list;
					for (var i in dialogList) {
						if (!dialogList[i].closed) {//代表已经有弹出框
							keydownTemp = true;
							break;
						}
					}
					
					if (!keydownTemp) {//允许弹出框弹出
						keydownTemp = true;
						openDialog({
									id:'simple-dialog-wrong',
									title:"提示",
									width:265,
									heigth:150,
									content:'安全口令错误，您还有' + ret.code + '次机会' + (ret.code == 1?'，再次输错将锁死USB Key':'，再连续输错'+ret.code+'次将锁死USB Key'),
									okVal:'确认',
									ok:function(){
										keydownTemp = false;
										$("#pin-pwd").focus();
									},
									left:'56%'
								});
					}
				}
				$this.click(btnSubmit);
				$('#btn-login').val('个人登录');
				$('.loadingImg').remove();
				return ;
			}
			
			if(ret.isLock){
				wrong.addClass('wrong-bg').html('USB Key已锁死，请<a href="javascript:" class="usbkey-lock">解锁</a>后重试');
				$('#unlock-container').html('<a href="javascript:" class="usbkey-lock">USB Key锁死？</a>');
				$('.usbkey-lock').data('card', card).click(function(){openQrCode.call(this, '/USBKeyUnlock/toUkeyUnlock.do')});
				//$('.usbkey-lock').trigger("click");
				
				pullCard(plugin, card);
				if(isLoginLock) {
					isLoginLock = false; //重置回去
					$.post(base + '/logLocked.do?r=' + Math.random(), {username:$('#userName').data('username'), cert:$('#userName').data('cert')});
				}
				$('#btn-login').val('个人登录');
				$('.loadingImg').remove();
				return;
			
			} else {
				//读卡错误，错误代码：
				//wrong.addClass('wrong-bg').html("读取USB Key错误，错误代码： " + ret.code);
				
				//费勇修改于2015-7-15 17：09
				wrong.addClass('wrong-bg').html("安全口令错误");
				$this.click(btnSubmit);
				$('#btn-login').val('个人登录');
				$('.loadingImg').remove();
				return ;
			}
		}
		
		var hiddens = '<input type="hidden" name="cert" value="' + $('#userName').data('cert') + '"/>'
				+ '<input type="hidden" name="deviceType" value="' + card.getCardInfo().type + '"/>';
		$('#cert-container').html(hiddens);
		wrong.removeClass('wrong-bg').html('&nbsp;');
		$("#frm").submit();
	};
	
	setTimeout(fn, 100);
}

// 监听Enter键进行登陆
$(document.documentElement).keydown(function(event) {
	if (!keydownTemp) {
		if (event.keyCode == 13 && $('#userName').data('cert')) {
			$("#btn-login").click();
		}
	}
});

//禁止回车提交表单
$('#pin-pwd').keypress(function(evt){
	if (evt.keyCode == 13) {
		return false;
	}
});

//校验表单
function checkForm() {
	if ($("#userName").val() == '') {
		//密码不能为空
		wrong.addClass('wrong-bg').html('安通帐号不能为空');
		return ;
	}
	
	if ($("#password").val() == '') {
		//密码不能为空
		wrong.addClass('wrong-bg').html('密码不能为空');
		return ;
	}
	
	if (!/^\w{6,16}$/g.test($("#userName").val()) || !/^\w{6,16}$/g.test($("#password").val()) ) {
		//密码不能为空
		wrong.addClass('wrong-bg').html('安通帐号或密码错误');
		return ;
	}
	
	if ($("#pin-pwd").val() == '') {
		//安全卡口令不能为空!
		wrong.addClass('wrong-bg').html('安全口令不能为空 ');
		return ;
	}
	return true;
}

//打开二维码
function openQrCode(action){
	$('.bind-card, .usbkey-lock').unbind('click');
	
	var frame = document.getElementById('qrcode-frame');
	var doc = frame.contentWindow.document;
	var loading = '<!DOCTYPE html><html><head><style>\
		body{background:rgba(0,0,0,0);text-align:center;}\
		div{padding-top;200px;line-height:300px;font-size:16px;font-family: Microsoft Yahei;color:#fff;}\
		</style></head><body><div>正在加载...</div></body></html>';
	
	doc.write(loading);
	doc.close();
	
	$('#frm').hide();
	$('#qrcode-frame').show();
	var form = $('#qrcode-frm');
	form.attr('action', base + action + '?r=' + Math.random());
	form.html('<input type="hidden" name="cardId" value="' + $(this).data('card').getCardId() + '" />');
	form.submit();
}

function openDialog_s3(){
	openDialog({
		title:'未检测到USB Key,请尝试以下操作后重试',
		ajaxUrl:'openDialog_s3.do?r=' + Math.random(),
		width :'600px',
		height:'350px',
		left:'38%',
		init:function(){			
			$('#showDiv').focus();
			$('#showDiv').blur();
			//解决虚线框
			$(".aui_close").bind("focus", function(){
				if(this.blur){
					this.blur();
				}
			});
		}
//		lock: true,
//		ok:function(){
//			//this.iframe.contentWindow.editorSave(this);
//			return false;
//		},
//		okVal:'保存',	
//		cancel:true
	});
}

function openDialog_s0(){
	openDialog({
		title:'安全控件安装失败,请尝试以下操作后重试',
		ajaxUrl:'openDialog_s0.do?r=' + Math.random(),
		width :'640px',
		height:'350px',
		left:'37%',
		init:function(){
			$('#showDiv').focus();
			$('#showDiv').blur();
			//解决虚线框
			$(".aui_close").bind("focus", function(){
				if(this.blur){
					this.blur();
				}
			});
		}
	});
}

//监听Enter键进行登陆
var keydownTemp;
//监听Enter键进行登陆 END
