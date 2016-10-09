var app = angular.module("PCApp", ['ui.router', 'ui.bootstrap', 'PCApp.directive', 'PCApp.filter', 'app.lang']);

var configFile = null;
var tray = null;
var interval = 1000*10;
var settingInfo = {auto: false,update: false, sort: 1, locktime: 10, voicenotice:false, desktopnotice:false, isShowLock:false};
app.config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
        $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: './login.html',
            controller: "loginCtr"
        })
        .state('main', {
            url: '/main',
            templateUrl: './main.html',
            controller: "mainCtr"
        })

        $urlRouterProvider.otherwise('/login');

});

app.controller("IndexCtr",['$rootScope', '$scope', '$sce','$templateCache', '$filter','$modal', function($rootScope, $scope, $sce, $templateCache, $filter, $modal){
	
	$templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog {{size}}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    "</div>");
	$rootScope.dialogs = {};
	var isShowWindow = true;
    var gui = require('nw.gui');
    var win = gui.Window.get();
	var http = require('http');
	$scope.iframe = {};
    var fs = require("fs");
    var queryStr = require('querystring');
    var process = require('process');
    var path = process.cwd();
	var file = fs.readFileSync(path + '/PCApplicationFramework/customconfig/main.json','utf8');
	var installC = fs.readFileSync(path +'/user.json','utf8');
    console.log(installC);
	configFile = JSON.parse(file);
    $rootScope.installConfig = JSON.parse(installC);
    $rootScope.configFile = configFile;
    if(configFile.closeWindow){
    	$scope.isClose = true;
    }
    else
    {
    	$scope.isClose = false;
    }
    initLoginInfo(configFile.login)
    initPersonalCenter(configFile.personal);
    initLogo(configFile.logo);
    initSearch(configFile.search);
    
	console.log(installC);
	$scope.isSingleApp = false;
	if(configFile.single_app){
		$scope.isSingleApp = Boolean(configFile.single_app);
	}
	
//	function getInstallConfig(fs, q){
//		var ds = [];
//		var t;
//  	var installConfig = fs.readFileSync(path +'/user.ini','utf8');
//  	var v = q.parse(installConfig, '[', ']');
//  	console.log(v);
//  	for(var i in v){
//  		if(i!='' && v[i] !=''){
//  			ds[i] = [];
//  			t=q.parse(v[i], '\n', '=');
//  			for(var j in t){
//  				if( j != '' && t[j] != '')
//  				{
//  					ds[i][j] = t[j];
//  				}
//  			}
//  		}
//  	}
//  	return ds;
//	}
	
	function initPersonalCenter(personalInfo){
		if(!personalInfo)return;
		var url = personalInfo.url;
		$scope.personalInfo = {};
		if(personalInfo.position == "bottom"){
			$scope.personalInfo.position = true;
		}
		else{
			$scope.personalInfo.position = false;
		}
		$scope.openPersonalCenter = function(userId){
			$scope.openUrlByDefaultBrowser($sce.trustAs($sce.RESOURCE_URL, url));
		}
	}
	
	function initLogo(logo){
		if(!logo)return;
		$scope.Logo = {};
		if(logo.hide){
			$scope.Logo.hide = Boolean(logo.hide);
		}
		else{
			$scope.Logo.hide = false;
			$scope.Logo.icon = logo.icon;
		}
	}
	
	function initSearch(search){
		if(!search)return;
		$scope.TopSearch = {};
		if(search.hide){
			$scope.TopSearch.hide = Boolean(search.hide);
		}
		else{
			$scope.TopSearch.hide = false;
			if(search.position == "right"){
				$scope.TopSearch.position = true;
			}
			else{
				$scope.TopSearch.position = false;
			}
			$scope.TopSearch.method = function(){
				return [{text:'aaa'},{text:'bbb'},{text:'ccc'},{text:'acd'},{text:'aer'}];
			}
			
			if(search.method){
				$scope.TopSearch.data = eval(search.method);	
			}
			
			if(search.submitSearch){
				$scope.TopSearch.submitSearch = function(){
					var data = $scope.TopSearch.searchvalue;
					if(data)
					{
						$scope.TopSearch.focus = false;
						eval(search.submitSearch);
					}
				}
				
				$scope.TopSearch.click = function(value){
					$scope.TopSearch.focus = false;
					$scope.TopSearch.searchvalue = value;
					$scope.TopSearch.submitSearch();
				}
				
				$scope.TopSearch.onblur = function(ev){
				   		//$scope.TopSearch.focus = false;
				   		if($scope.TopSearch.focus==false){
				   			$scope.TopSearch.submitSearch();
				   		}
				}
			}
		}
	}
	
	function initLoginInfo(login){
		if(!login)return;
		if(login.login_carousel){
			var info = login.login_carousel;
			$scope.Carousel = {};
			if(info.hide){
				$scope.Carousel.hide = Boolean(info.hide);
			}
			else{
				$scope.Carousel.hide = false;
				$scope.Carousel.carousels = info.items;
			}
		}
		if(login.getATAccount)
		{
			var info = login.getATAccount;
			$scope.GetATAccount = {};
			if(info.hide){
				$scope.GetATAccount.hide = Boolean(info.hide);
			}
			else{
				$scope.GetATAccount.hide = false;
				$scope.GetATAccount.url = info.url;
			}
		}
		if(login.findPassword)
		{
			var info = login.findPassword;
			$scope.FindPassword = {};
			if(info.hide){
				$scope.FindPassword.hide = Boolean(info.hide);
			}
			else{
				$scope.FindPassword.hide = false;
				$scope.FindPassword.url = info.url;
				$scope.FindPassword.lockUrl = info.lockUrl;
				settingInfo.lockUrl = info.lockUrl;
			}
		}
	}
	
	$scope.openUrlByDefaultBrowser = function(url)
	{
		url && nw.openUrl(url);
	}
	
//	$scope.openUrl = function(url) {
//		url && nw.openUrl($filter('decodeURI')(url));
//	};
    
	$scope.quitWindow = function(){
    	win.close();
    	tray.remove();
	    tray = null;
    }
    
    $scope.maxWindow = function(){
		win.maximize();
    }
    $scope.restoreWindow = function(){
    	win.restore()
    }
    $scope.minWindow = function(){ 
    	win.minimize();
    }
    $scope.closeWindow = function(){ 
    	win.hide();
    }
}]);

app.controller("loginCtr",['$rootScope', '$scope', '$state', "$sce", function($rootScope, $scope, $state, $sce){
//	window.settingInfo.isShowLock = false;
//  if($rootScope.card)$rootScope.card = null;
	var gui = require('nw.gui');
    var win = gui.Window.get();
    
    var w = 572, h = 402;
	win.resizeTo(w, h);
	win.setMinimumSize(w, h);
	win.setMaximumSize(w, h);
	win.setResizable(false);
	win.setPosition('center');
	win.moveTo((screen.width - w)/2, (screen.height - h)/2);
	$scope.key = {status: 'loadding', notice:false};
	$scope.login = {account:"", password:""};
	var plugin, loginPage = function(){
	
	if(tray){
    	tray.remove();
        tray = null;
    }
	
	$scope.key = {status: 'loadding', notice:false};
	plugin = Card.ready(function(data){
		
		var card = checkCard(this);
		$rootScope.card = card;
		if(!card) {
			return;
		}
		
		var ret = card.getPinTryCount();
		if(!ret.success) { 
			if(ret.isLock){
 				
				$scope.key.locked = true;
				$scope.key.status = "nomal";
				pullCard(this, card);
				return $scope.$apply();
			}
			
			if(ret.code != -100){
				$scope.key.status = "nomal";
				if(ret.message)
				{
					$scope.login.errorMsg = ret.message;
				}else {
					$scope.login.errorMsg = "请重试！";
				}
				pullCard(this, card);
				$scope.$apply();
				return ;
			}
		}
		
		if(card) {
			var _this = this;
			$scope.login.errorMsg = "";
			var cardid = card.getCardId();
			getAccount(cardid);
		    pullCard(_this, card);
		}

	});
};
setTimeout(loginPage, 200);
$scope.loginPage = loginPage;
  
function getAccount(cardId){
	    GetAccount(cardId, function(data){
	    $scope.key.cardId = cardId;
	    data =JSON.parse(data);
    	if(data && data.errCode){
			console.log(data.message);
			$scope.login.errorMsg = $sce.trustAsHtml(data.message);
			if(data.errCode == "invalid_sn" 
				|| data.errCode == "cert_freeze"
				|| data.errCode == "cert_not_exists"
				|| data.errCode == "cert_revoke"
				|| data.errCode == "card_sn_not_relation")
			{
				$scope.key.status = "nomal";
				$scope.login.errorMsg = $sce.trustAsHtml("安全芯片证书不可用!<br/>请咨询客服：400-888-7801");
			} else if(data.errCode == "account_is_not_exist")
			{
				$scope.key.status = "s4";
			}
			else{
				$scope.key.status = "nomal";
			}
		}
    	if(data && data.account)
		{
			console.log("检测成功！");
			$scope.key.status = 'success';
			$scope.login.account = data.account;
			$rootScope.account = data.account;
		}
		$scope.$apply();
	}, function(e){
		$scope.key.status = "nomalerror";
		$scope.$apply();
	});
}

function pullCard(plugin, card){
	safekey.oncardout =function(){		 
		showErrorStatus('s3');
		$scope.login = {account:"", password:""};
		$scope.$apply();
	}
}

$scope.loginApp = function(){
	$scope.login.errorMsg = "";
	fn();
}

$scope.clearErrorMsg = function(){
	$scope.login.errorMsg = "";
}

function fn(){
	var card = checkCard(plugin);
		if(!card) {			
			setTimeout(function(){
				$(".login-password .login-input").focus();
			}, 2000);
			return;
		}
		
		if(!checkForm()) {
			setTimeout(function(){
				$(".login-password .login-input").focus();
			}, 2000);
			return;
		}

		var ret = card.checkPin($scope.login.password);
		if(!ret.success) {
			
			if(ret.code > 0){
				isLoginLock = true;
				
				if (ret.code > 5) {
					$scope.login.errorMsg = '安全口令错误，请重试';
					
					setTimeout(function(){
						$(".login-password .login-input").focus();
					}, 2000);
				} else {
					$scope.login.errorMsg = '安全口令错误，您还有' + ret.code + '次机会' + (ret.code == 1? '，再次输错将锁死USB Key':'');
				}
				return ;
			}
			if(ret.isLock){
				$scope.key.locked = true;
				$scope.key.status = "s6";
				$scope.key.notice = true;
				return;
			
			} else if(ret.code <=0) {
				$scope.login.errorMsg = "安全口令错误";
				return ;
			}
		}
		
		var cardid = card.getCardId();
		var atp=new ATPlus();
		Login(cardid,$scope.login.password,atp, function(data){
			var data = JSON.parse(data);
			$rootScope.password = $scope.login.password;
			if(data && data.errCode){
				console.log(data.message);
				$scope.login.errorMsg = "登录失败！ " + data.message;
				if(data.errCode == "invalid_sn" 
				|| data.errCode == "cert_freeze"
				|| data.errCode == "cert_not_exists"
				|| data.errCode == "cert_revoke"
				|| data.errCode == "card_sn_not_relation")
				{
					$scope.key.status = "snerror";
					$scope.key.notice = true;
					$scope.$apply();
					return;
				}
				$scope.key.status = "error";
				$scope.key.notice = false;
				$scope.$apply();
				return;
			}
			if(data && data.ticket)
			{
				console.log("登录成功！")
				$rootScope.ticket = data.ticket;
				$state.go('main');
			}
		}, 
		function(e){
		if(e && e.code == "EHOSTUNREACH"){
			$scope.key.status = "neterror";
		}
		else{
			$scope.key.status = "error";
		}
		$scope.key.notice = true;
		$scope.$apply();
	});
}
   
function checkForm() {
	var userName = $(".login-account .login-input");
	var password = $(".login-password .login-input");
	if (userName.val() == '') {
		$scope.login.errorMsg = '安通帐号不能为空';
		return ;
	}
	
	if (password.val() == '') {
		$scope.login.errorMsg = '安全口令不能为空 ';  
		return ;
	}
	return true;
}

function checkCard(plugin){
	if(plugin.error) {
		return;
	} 
	
	var cards = plugin.readUserUSBKeyCard(); 
	
	if(cards.isException){
		$scope.key.status = "s5";
		return $scope.$apply();
	}
	
	cards.push(plugin.readUserTFCard()); 
	
	if(cards.isException){
		$scope.key.status = "s5";
		return $scope.$apply();
	}
	
	if(!cards.length){
		showErrorStatus('s3');
		return $scope.$apply();
	}

	if(cards.length > 1) {
		showErrorStatus('s7');
		return $scope.$apply();
	}

	var cardId = cards[0].getCardId();
	if(cardId == 'changeSafePin'){
		$scope.login.errorMsg ='您已修改安全口令，必须关闭浏览器的所有窗口，然后重新登录';
		return;
	}
	
	return cards[0];
}
	
	function showErrorStatus(status) {
		$scope.key.status = status;
		$scope.key.notice = false;
		if (status == 's0') {
			return;
		} else if(status == 's1') {
			return;
		} else if(status == 's3') {
			return;
		} else if(status == 's4') {
			return;
		} else if(status == 's5') {
			return;
		} else if(status == 's6') {
			$scope.key.notice = true;
			return;
		} else if(status == 's7') {
			return;
		}
	}
}]);

app.controller("mainCtr",['$rootScope', '$scope', '$modal', '$state', '$sce', 'lang', function($rootScope, $scope, $modal, $state, $sce, lang){

	if(configFile.top_menu){
		if(configFile.top_menu.hide){
			isHide = Boolean(configFile.top_menu.hide);
		}
		else{
			isHide = false;
		}
		$scope.hideSettinggMenu = isHide;
	}
	
	settingInfo.openLockDialog = function() {
		if($('[name="lockform"]')[0])return;
		win.show();
        var lockWindow = $modal.open({
            size:'notice-dialog1',
            templateUrl: './modeldialog/lockwindow.html', 
            backdrop:'static',
            keyboard:false,
            controller: function ($scope, $rootScope, $modalInstance) {
            	$scope.lock = {};
            	$scope.ok = function () {
            		checkPin();
        		}
            	$scope.cancel = function () {
            		$modalInstance.close();
                    delete $rootScope.dialogs['modifypassword-dialog'];
                };
                
                $scope.openUrlByDefaultBrowser = openUrlByDefaultBrowser;
                
                function checkPin(){
                	if($rootScope.card){
                			var ret = $rootScope.card.checkPin($scope.lock.password);
							if(!ret.success) {
								
								if(ret.code > 0){
									isLoginLock = true;
									
									if (ret.code > 5) {
										$scope.lock.errorMsg = '安全口令错误，请重试';
										
										setTimeout(function(){
											$(".login-input .change").focus();
										}, 2000);
									} else {
										$scope.lock.errorMsg = '安全口令错误，您还有' + ret.code + '次机会' + (ret.code == 1? '，再次输错将锁死USB Key':'');
									}
									return ;
								}
								if(ret.isLock){
									$scope.lock.locked = true;
									$scope.lock.url = settingInfo.lockUrl;
									return;
								
								} else if(ret.code <=0) {
									$scope.lock.errorMsg = "安全口令错误";
									return ;
								}
							}
							$modalInstance.close();	
                	}
                	else{
                		removeDialog($rootScope);
                		$state.go('login');
                	}
                }
            }
            });
            $rootScope.dialogs['lockWindow-dialog'] = lockWindow;
    }
	
	var gui = require('nw.gui');
	function initTray(data){
		console.log("dddd");
		    if(!data) return;
	        var guiTray = data;
	        if(tray){
	        	tray.remove();
	            tray = null;
	        }
	        tray = new gui.Tray({ title: guiTray.title, icon: guiTray.icon, tooltip:guiTray.tooltip});
	        var menu = new gui.Menu();
			var openAppMenuItem =  new gui.MenuItem({label: '打开PC应用框架',click: function() {
	                                    win.show();
	                                } });
			var exitAppMenuItem = new gui.MenuItem({label: '退出',click: function() {
	                            gui.App.quit();
	                            tray.remove();
	                            tray = null;
	                        } });
	                        
	        var aboutAppMenuItem = new gui.MenuItem({label: '关于',click: openAboutDialog });
	        var lockAppMenuItem = new gui.MenuItem({label: '锁定',click: settingInfo.openLockDialog});
	                        
            var item = {};
	        for(var i=0; i< guiTray.menu.length; i++)
	        {
	        	item[i] = guiTray.menu[i];
	        	if(item[i].id == '1000101')
	        	{
	        		openAppMenuItem.label = item[i].label;
	        		menu.append(openAppMenuItem);
	        		continue;
	        	}
	        	else if(item[i].id == '1000104')
	        	{
	        		exitAppMenuItem.label = item[i].label;
	        		menu.append(exitAppMenuItem);
	        		continue;
	        	} else if(item[i].id == '1000103'){
	        		aboutAppMenuItem.label = item[i].label;
	        		menu.append(aboutAppMenuItem);
	        		continue;
	        	} else if(item[i].id == '1000102'){
	        		menu.append(lockAppMenuItem);
	        		continue;
	        	}
	        	var menuItem = new gui.MenuItem({label: item[i].label, key:i, click: function(){ 
		        		if(angular.isDefined(item[this.key].click))
		        		{
		        		 	eval(item[this.key].click);
		        		}
	        		}
	        	});
	        	menu.append(menuItem);
	        }
	        tray.menu = menu;
	        tray.on('click',
	            function()
	            {
	                win.show();
	            }
	        );
		    
    		$scope.tray = tray;
	}
	initTray(configFile.tray);
	initSqlDB();
	
	var gui = require('nw.gui');
    var win = gui.Window.get();
    win.setResizable(true);
	win.setMaximumSize(screen.width, screen.height);

	var w = 1024, h = 720;
	win.resizeTo(w, h);
	win.setPosition('center'); 
	win.setMinimumSize(w, h);
	
	$scope.defaultPath = './img/button/left_Head.png';
	$scope.currentUser = {url:"./img/button/left_Head.png", name:"张三"};
	var cardid = $rootScope.card.getCardId();
	var atp = new ATPlus();
	GetAccountInfo(cardid,$rootScope.password,atp, function(data){
		var user = data;
		if(user.nickname){
			$scope.currentUser.name = user.nickname;
		}
		if(user.thumbnailDownloadUrl){
			$scope.currentUser.url = user.thumbnailDownloadUrl + "/" + user.thumbnail;
		}
		$scope.$apply();
	});
	
	function openAboutDialog(){
		win.show();
		if($rootScope.dialogs['about-dialog'])return;
   		var modalInstance = $modal.open({
	            size:'about-dialog',
	            templateUrl: './modeldialog/about.html', 
	            backdrop:'static',
	            keyboard:false,
	            controller: function ($scope, $modalInstance) {
	            	var path = process.cwd();
        	   		var file = fs.readFileSync(path +'/version.json','utf8');
        	   		var version = JSON.parse(file);
        	   		$scope.currentVersion ="版本：" + version.version;
	            	if($rootScope.configFile.about){
	            		$scope.about = $rootScope.configFile.about;
	            	}
	            	$scope.cancel = function () {
	                    $modalInstance.dismiss('cancel');
	                    delete $rootScope.dialogs['about-dialog'];
	                };
	            }
	      });
	      
	    $rootScope.dialogs['about-dialog'] = modalInstance;
   }
	
	$scope.openLockDialog = settingInfo.openLockDialog;
	
	$scope.checkMenuStatu = function(menu){
		if($rootScope.installConfig && $rootScope.installConfig.installSoftware){
			var items = $rootScope.installConfig.installSoftware;
			for(var i=0; i < items.length; i++){
				if(menu.installkey == items[i]){
					return true;
				}
			}
			return false;
		}
		else{
			return true;
		}
	}
	
	var complareVersion = function(newV, oldV){
    	if(newV && oldV){
    		var v1 = newV.split('.');
    		var v2 = oldV.split('.');
    		var l1 = v1.length;
    		var l2 = v2.length;
    		var length =  l1 > l2 ? l2 : l1
    		for(var i=0; i < length; i++)
    		{
    			if(parseInt(v1[i])>parseInt(v2[i])){
    				return true;
    			}
    		}
    		if(l1>l2){
    			return true;
    		}
    	}
    	return false;
    }
	
	var isUpdate = function(){
    	var http = require('http');
		var options = {
		  path: lang.path + '/version.json',
		  method: 'GET',
		  port: lang.port,
		  host: lang.host
		};
		
		var req = http.request(options, function(res) {
		  res.setEncoding("utf-8");
		  res.on('data', function(d) {
		  	   var path = process.cwd();
        	   var file = fs.readFileSync(path +'/version.json','utf8');
        	   var version = JSON.parse(file);
			  var dd = JSON.parse(d);
			  var isUpdate = complareVersion(dd.version, version.version);
			  if(isUpdate){
			  	$rootScope.isUpdate = true;
			  	var opts = dd;
			  	opts.isAuto = true;
			  	checkUpdateDialog(opts);
			  }
		  });
		});
		req.end();
		
		req.on('error', function(e) {
		  console.error(e.message);
		});
		
    }
	
	function checkUpdateDialog(option) {
	   	var option = option;
        var modalInstance = $modal.open({
		            size:'update-dialog',
		            templateUrl: './modeldialog/checkUpdate.html', 
		            backdrop:'static',
		            keyboard:false,
		            resolve: {
			        	option: function () {
			        	    return option;
			            }
			         },
		            controller: function ($scope, $modalInstance, option) {
		            	var process = require('process');
						var path = process.cwd();
		            	var file = fs.readFileSync(path +'/version.json','utf8');
		            	var version = JSON.parse(file);
		            	
		                $scope.ok = function () {
		                    $modalInstance.close();
		                    delete $rootScope.dialogs['update-dialog'];
		                };
		
		                $scope.cancel = function () {
		                    $modalInstance.dismiss('cancel');
		                    delete $rootScope.dialogs['update-dialog'];
		                };
		                
		                var downPCAPP = function(){
		                	$scope.errcode = 0;
		                	$scope.state = 5;
		                	$scope.processMessage = "正在下载更新...(0%)";
		                	$scope.filePath = window.getUserPath().replace(/\\/g, '\/') + '/data/';
		                	var http = require('http');
							var fs = require('fs');
							var options = {
							  path: $scope.downloadInfo.path + '/' + $scope.downloadInfo.file,
							  method: 'GET',
							  port: $scope.downloadInfo.port,
							  host: $scope.downloadInfo.host
							};
							var size = 0;
							var downCount = 0;
							console.log(options);
							var req = http.request(options, function(res) {
								  size = res.headers["content-length"];
								  if(res.statusCode == 200)
									{
										var file = fs.createWriteStream($scope.filePath + $scope.downloadInfo.file);
										 res.on('data', function(data) {
										 	downCount = res.req.connection.bytesRead;
										 	if(size !=0){
										 		var percentage = downCount / size * 100;
										 		if(percentage > 100){
										 			percentage = 100;
										 		}
										 		$scope.processMessage = "正在下载更新...("+ percentage.toFixed(2) +"%)";
								            	$scope.$apply();
										 	}
								            file.write(data);
								        }).on('end', function() {
								            file.end();
								            console.log($scope.downloadInfo.file + ' downloaded to ' + $scope.filePath);
								        	$scope.state = 6;
								        	$rootScope.isUpdate = false;
								        	$scope.$apply();
								        });
									}
							});
							req.end();
							
							req.on('error', function(e) {
							  console.error(e.message);
							  $scope.errcode = -1;
							  $scope.state = -27
							  $scope.errmsg = "链接服务器出错！";
							  $scope.retryAction = downPCAPP;
							  $scope.$apply();
							});
		                }
		                
		                $scope.install = function(){
		                	window.RunUpdPackage($scope.filePath, $scope.downloadInfo.file);
		                	$modalInstance.close();
		                    delete $rootScope.dialogs['update-dialog'];
		                }
		                
		                $scope.updateVersion = downPCAPP;
		                
		                var checkVersion = function(){
					    	$scope.state = -1;
					    	$scope.processMessage = "正在为您检测最新版本...";
					    	var http = require('http');
							var options = {
							  path: lang.path + '/version.json',
							  method: 'GET',
							  port: lang.port,
							  host: lang.host
							};
							
							var req = http.request(options, function(res) {
							  console.log("statusCode: ", res.statusCode);
							  console.log("headers: ", res.headers);
							  res.setEncoding("utf-8");
							  res.on('data', function(d) {
								  var dd = JSON.parse(d);
								  var isUpdate = complareVersion(dd.version, version.version);
								  if(isUpdate){
								  	  $rootScope.isUpdate = true;
									  $scope.state = 0;
									  $scope.errcode = 0;
								  	  $scope.newVersion = dd.version;
								  	  $scope.downloadInfo = dd.downloadInfo;
								  	  $scope.updateDescription = dd.updateDescription;
								  }
								  else
								  {
									  $scope.state = 1;
									  $scope.errcode = 0;
									  $scope.version = dd.version;
								  }
								  $scope.$apply();
							  });
							});
							req.end();
							
							req.on('error', function(e) {
							  $scope.errcode = -1;
							  $scope.state = -27
							  $scope.errmsg = "链接服务器出错！";
							  $scope.retryAction = checkVersion;
							  $scope.$apply();
							  console.log(e.message);
							});
							
					    }
						if(option && option.isAuto == true){
							$scope.state = 0;
							$scope.errcode = 0;
						  	$scope.newVersion = option.version;
						  	$scope.downloadInfo = option.downloadInfo;
						  	$scope.updateDescription = option.updateDescription;
						  	$scope.$apply();
						}
						else {
		                	checkVersion();
		                }
		            }
		        });
		        
		$rootScope.dialogs['update-dialog'] = modalInstance;
	   }
	
	function initSqlDB(){
		var folderName = window.getUserPath()+"\\data\\" + $rootScope.account;
		if(angular.isDefined(folderName)){
			var flag = mkdirsSync(folderName, 0777);
			if(flag){
				var sqliteDB = require('sqlite3').verbose();
				var dbPath = folderName.replace(/\\/g, '\/') +'/'+ "sqlite3.db";
				$rootScope.dbpath = dbPath;
				console.log($rootScope.dbpath);
				var db = new sqliteDB.Database($rootScope.dbpath);
				db.all("Select ID, Start, ISUpdate, Sort, Voice, DesktopNotice, Locked from setting where ID="+ $rootScope.account, function(err, rows){
							if(err){	
								console.log(err);
								if($rootScope.installConfig && $rootScope.installConfig.ExperienceProgram)
								{
									if(parseInt($rootScope.installConfig.ExperienceProgram) == 1){
										var menus = configFile.top_menu.menu;
										for(var i=0; i < menus.length; i++){
											if(menus[i].id == "10004"){
												if(menus[i].method){
										        		eval(menus[i].method);
										        }
												break;
											}
										}
									}
								}
								db.run("Create table if not exists setting(ID CHAR(10) PRIMARY KEY NOT NULL, Start BOOLEAN, ISUpdate BOOLEAN, Sort INT, Voice BOOLEAN, DesktopNotice BOOLEAN, Locked INT)", function(error){
									console.log(error);
									if(error)return;
									var turnOn = 0;
									var autoUpdate = 0;
									var sort = 1;
									var noticeSong = 0;
									var desktopNotice = 0;
									var lockTime = 10;
									if($rootScope.configFile.setting){
										var settings = $rootScope.configFile.setting;
										if(settings["systemsetting"]){
											var data = settings["systemsetting"];
											if($rootScope.installConfig){
												if($rootScope.installConfig.AutoStartUp)
												{
													turnOn = parseInt($rootScope.installConfig.AutoStartUp);
													settingInfo.auto = Boolean(turnOn);
												}
											}
											if(turnOn != 1 && data.auto){
												turnOn = Boolean(data.auto.auto) ? 1 : 0;
												settingInfo.auto = Boolean(turnOn);
											}
											if(data.update){
												autoUpdate = Boolean(data.update.update) ? 1 : 0;
												settingInfo.update = Boolean(autoUpdate);
												    console.log(settingInfo.update);
													if(settingInfo.update){
														isUpdate();
													}
											}
											if(data.notice){
												sort = parseInt(data.notice.noticesort) == 2 ? 2 : 1;
												settingInfo.sort = sort;
												noticeSong = Boolean(data.notice.voice) ? 1 : 0;
												settingInfo.voicenotice = Boolean(noticeSong);
												desktopNotice = Boolean(data.notice.desktopnotice) ? 1 : 0;
												settingInfo.desktopnotice = Boolean(desktopNotice);
											}
											if(data.lock && data.lock.locktime){
												lockTime = parseInt(data.lock.locktime);
												settingInfo.locktime = lockTime;
												interval = 1000 * settingInfo.locktime;
											}
										}
									}
									
									db.run("INSERT INTO setting(ID, Start, ISUpdate, Sort, Voice, DesktopNotice, Locked) "+
		                             "VALUES("+ $rootScope.account +","+ turnOn +","+ autoUpdate +","+ sort +","+ noticeSong +","+ desktopNotice +","+ lockTime +")", function(err){
		                             	if(err){
		                             		console.log(err);
		                             		return;
		                             	}
		                             	
		                             	var falg = window.SetAutoStartRun(turnOn,"nw");
		                             	console.log(falg);
		                             });
								});
								return;
							}
							if(rows && rows.length > 0)
							{
								rows.forEach(function(row){
									initSettingInfo(row);
								});
							}
					  });
				db.all("Select ID, OrderNum from ordering order by OrderNum asc", function(err, rows){
							if(err){	
								console.log(err);
								db.run("Create table if not exists ordering(ID CHAR(10) PRIMARY KEY NOT NULL, OrderNum INT)", function(error){
									console.log(error);
									if(error)return;
									if($rootScope.configFile.left_menu){
										var menus = $rootScope.configFile.left_menu.menu;
										var i=0;
										angular.forEach(menus, function(item){
											db.run("INSERT INTO ordering(ID, OrderNum) "+
				                             "VALUES("+ item.id +","+ i +")", function(err){
				                             	if(err){
				                             		console.log(err);
				                             		return;
				                             	}
				                             });
				                             i++;
										});
										initLeftMenu(configFile.left_menu);
		                            }
								});
								return;
							}
							if(rows && rows.length > 0)
							{
								if($rootScope.configFile.left_menu){
									var left_menu = $rootScope.configFile.left_menu;
									var menus = left_menu.menu;
									var arr1 = [];
									var arr2 = [];
									rows.forEach(function(row){
										for(var i=0; i< menus.length; i++){
											if(row.ID == menus[i].id){
												arr1.push(menus[i]);
												break;
											}
											arr2.push(menus[i]);
										}
									});
									arr1.concat(arr2);
									left_menu.menu = arr1;
									initLeftMenu(left_menu);
								}
							}
					  });
					  
				db.close();
			}
		}
	}
		
	function initSettingInfo(row){
		settingInfo.auto = Boolean(row.Start);
		settingInfo.update = Boolean(row.ISUpdate);
		if(settingInfo.update){
			isUpdate();
		}
		settingInfo.sort = parseInt(row.Sort);
		settingInfo.voicenotice = Boolean(row.Voice);
		settingInfo.desktopnotice = Boolean(row.DesktopNotice);
		settingInfo.locktime = parseInt(row.Locked);
	    interval = 1000 * settingInfo.locktime;
	}
	
	function initLeftMenu(menu){
		if(!menu)return; 
		$scope.LeftMenu = {};
		if(menu.hide){
			$scope.LeftMenu.hide = Boolean(search.hide);
		}
		else{
			$scope.LeftMenu.hide = false;
			$scope.LeftMenu.menus = menu.menu;
		}
		
		$scope.clickMenu = function(url){
			$scope.isNotice = false;
			$scope.iframe.url = $sce.trustAs($sce.RESOURCE_URL, url);
		}
		
		$scope.$apply();
	}
	
	InitNoticePage(configFile.notice);
	
	function InitNoticePage(notice){
		if(!notice)return;
		$scope.appnotice = {selectedIndex:0};
		if(notice.hide){
			$scope.appnotice.hide = Boolean(notice.hide);
		}
		else{
			$scope.appnotice.hide = false;
			$scope.appnotice.items = notice.items;
		}
		
		if(configFile.notice && configFile.notice.noticeUrl){
			$scope.appnotice.url = configFile.notice.noticeUrl;
		}
	}
	
	$scope.saveSort = function(data){
		var sqliteDB = require('sqlite3').verbose();
		var db = new sqliteDB.Database($rootScope.dbpath);
		for(var i=0; i < data.length; i++){
			db.run("Update ordering set OrderNum=" + data[i].order+ " where ID=" + data[i].id, function(err){
	             	if(err){
	             		console.log(err);
	             	}
	        });
        }
		db.close();
	}
	
	$scope.parseBool = function(str){
		return Boolean(str);
	}
	
	$scope.openNoticePage = function(){
		$scope.isNotice = true;
		console.log("isNotice");
		if($scope.isSingleApp){
			$scope.iframe.url = $sce.trustAs($sce.RESOURCE_URL, $scope.appnotice.url);
		}
	}
	
	$scope.menu = {};
	var chlidwindow = null;
	$scope.openMenu = function(e){
		var topMenu = configFile.top_menu.menu;
		var length = topMenu.length;
	    angular.forEach(topMenu, function(item)
		{
			if(item.hide || item.isSeperator)length = length -1;
		});
	    var height = length * 23 + 15;
		if(chlidwindow)chlidwindow.close();
		var gui = require('nw.gui');
		chlidwindow = openWindow({
			url:'mainmenu.html',
			x:e.screenX,
			y:e.screenY - e.pageY + 25,
		    width:144,
		    height:height,
		    toolbar:false,
		    frame:false,
		    focus: true,
		    resizable:false,
		    show_in_taskbar:false,
		    alwaysOnTop:true,
		    args:{
		    	isUpdate:$rootScope.isUpdate,
		    	openNoticeDialog:function clickMe(method) {
		    			$scope.submitM = method;
			            var modalInstance = $modal.open({
			            size:'notice-dialog',
			            keyboard:false,
			            templateUrl: './modeldialog/notice.html', 
			            backdrop:'static',
			            controller: function ($scope, $modalInstance) {
			            	$scope.notice = {step1:true};
			                $scope.ok = function () {
			                    $modalInstance.close({data:$scope.notice.text});
			                    delete $rootScope.dialogs['notice-dialog'];
			                };
			
			                $scope.cancel = function () {
			                    $modalInstance.dismiss('cancel');
			                    delete $rootScope.dialogs['notice-dialog'];
			                };
			            }
			        });
			        modalInstance.result.then(function (value) {
			        	if(value){
			        		var data = value;
				        	eval($scope.submitM);
			        		var childInstance = $modal.open({
						            size:'notice-dialog1',
						            templateUrl: './modeldialog/notice.html', 
						            backdrop:'static',
						            keyboard:false,
						            controller: function ($scope, $modalInstance) {
						            	$scope.notice = {step1:false};
						                $scope.ok = function () {
						                    $modalInstance.close();
						                    delete $rootScope.dialogs['notice-dialog1'];
						                };
						
						                $scope.cancel = function () {
						                    $modalInstance.dismiss('cancel');
						                    delete $rootScope.dialogs['notice-dialog1'];
						                };
						            }
						    });
						    $rootScope.dialogs['notice-dialog1'] = childInstance
			        	}
			        })
			        $rootScope.dialogs['notice-dialog'] = modalInstance;
			   },
			   
			   openUserExperienceDialog:function clickMe(option) {
			   	var option = option;
	            var modalInstance = $modal.open({
				            size:'notice-dialog1',
				            templateUrl: './modeldialog/userexperience.html', 
				            backdrop:'static',
				            keyboard:false,
				            resolve: {
					        	option: function () {
					        	    return option;
					            }
					         },
				            controller: function ($scope, $modalInstance, option) {
				            	$scope.experience = {'comment':option.comment, 'signature': option.signature};
				                $scope.ok = function () {
				                    $modalInstance.close();
				                    delete $rootScope.dialogs['experience-dialog'];
				                };
				
				                $scope.cancel = function () {
				                    $modalInstance.dismiss('cancel');
				                    delete $rootScope.dialogs['experience-dialog'];
				                };
				            }
				        });
				
				modalInstance.result.then(function () {
						if(option.method){
			        		eval(option.method);
			        	}
			        })
				$rootScope.dialogs['experience-dialog'] = modalInstance;
			   },
			   
			   openSettingDialog:function clickMe() {
	            var modalInstance = $modal.open({
				            size:'setting-dialog',
				            templateUrl: './modeldialog/setting.html', 
				            backdrop:'static',
				            keyboard:false,
				            controller: function ($scope, $modalInstance) {
				            	var db;
				            	playSong();
				            	$scope.selectedIndex = "system";
				            	$scope.auto = false;
				            	$scope.update = false;
				            	$scope.sort = 1;
				            	$scope.locktime = 10;
				            	$scope.voicenotice = false;
				            	$scope.desktopnotice = false;
				            	$scope.parseBool = function(str){
				            		return Boolean(str);
				            	}
				            	$scope.clickothertab = function(value){
				            		$scope.selectedIndex = parseInt(value);
				            	}
				            	if($rootScope.configFile.setting)
				            	{
				            		var settings = $rootScope.configFile.setting;
				            		if(settings["systemsetting"]){
				            			$scope.systemsetting = settings["systemsetting"];
				            		}
				            		if(settings["appsetting"]){
				            			$scope.appsetting = settings["appsetting"];
				            		}
				            		if(settings["othersetting"]){
				            			$scope.othersetting = settings["othersetting"];
				            		}
				            	}
				            	$scope.autofun = function(){
				            		$scope.auto = !$scope.auto;
				            		var start = 0;
				            		if($scope.auto)
				            		{
				            			start = 1;
				            		}
				            		
			            			var falg = window.SetAutoStartRun(start,"nw");
		                            console.log(falg);
		                            
				            		db.run("Update setting set Start=" + start+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             	}
				                        });
				            	}
				            	$scope.updatefun = function(){
				            		$scope.update = !$scope.update;
				            		var update = 0;
				            		if($scope.update)
				            		{
				            			update = 1;
				            		}
				            		db.run("Update setting set ISUpdate=" + update+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             	}
				                        });
				            	}
				            	$scope.sortByTimeOrWord = function(value){
				            		$scope.sort = value;
				            		db.run("Update setting set Sort=" + $scope.sort+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             	}
				                        });
				            	}
				            	$scope.lockByTime = function(value){
				            		$scope.locktime = value;
				            		interval = 1000 * $scope.locktime;
				            		db.run("Update setting set Locked=" + $scope.locktime+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             	}
				                        });
				            	}
				            	
				            	$scope.voicefun = function(){
				            		$scope.voicenotice = !$scope.voicenotice;
				            		settingInfo.voicenotice = $scope.voicenotice;
				            		playSong();
				            		var voicenotice = 0;
				            		if($scope.voicenotice)
				            		{
				            			voicenotice = 1;
				            		}
				            		db.run("Update setting set Voice=" + voicenotice+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             		return;
				                             	}
				                        });
				            	}
				            	$scope.desktopNoticefun = function(){
				            		$scope.desktopnotice = !$scope.desktopnotice;
				            		settingInfo.desktopnotice = $scope.desktopnotice;
				            		var msgs = [{title:"系统消息", content:"你的好友XX给你点了一个赞"},{title:"安通＋", content:"明天9:00开会。"},{title:"系统消息", content:"你的一条个人发布有评论"},{title:"系统消息", content:"2016年03月15日，消费投诉，错过等一年"}];
				            		openMessage(msgs);
				            		var desktopnotice = 0;
				            		if($scope.desktopnotice)
				            		{
				            			desktopnotice = 1;
				            		}
				            		db.run("Update setting set DesktopNotice=" + desktopnotice+ " where ID=" + $rootScope.account, function(err){
				                             	if(err){
				                             		console.log(err);
				                             	}
				                        });
				            	}
				            	
				            	if($rootScope.dbpath){
					            	var sqliteDB = require('sqlite3').verbose();
									db = new sqliteDB.Database($rootScope.dbpath);
									console.log(db);
									db.all("Select ID, Start, ISUpdate, Sort, Voice, DesktopNotice, Locked from setting where ID="+ $rootScope.account, function(err, rows){
										if(err){	
											console.log(err);
											return;
										}
										if(rows && rows.length > 0){
											rows.forEach(function(row){
												console.log("ID: "+row.ID +" Start: "+row.Start +" ISUpdate: "+row.ISUpdate+" Sort: "+row.Sort+ " Voice: "+ row.Voice +" DesktopNotice: "+ row.DesktopNotice + " Locked: "+row.Locked);
												$scope.auto = Boolean(row.Start);
												$scope.update = Boolean(row.ISUpdate);
												$scope.sort = parseInt(row.Sort);
												$scope.voicenotice = Boolean(row.Voice);
												$scope.desktopnotice = Boolean(row.DesktopNotice);
												$scope.locktime = parseInt(row.Locked);
												interval = 1000 * $scope.locktime;
												$scope.$apply();
											})
										}
									});
								}
				            	
				                $scope.modifypassword = function () {
				                    $(".setting-dialog").hide();
				                    var modifyPassword = $modal.open({
							            size:'notice-dialog1',
							            templateUrl: './modeldialog/changepassword.html', 
							            backdrop:'static',
							            keyboard:false,
							            controller: function ($scope, $rootScope, $modalInstance) {
							            	$scope.change = {success:false};
							            	$scope.ok = function () {
							            		UpdatePin();
				                    		}
							            	$scope.cancel = function () {
							            		$modalInstance.close();
							                    $(".setting-dialog").show();
							                    delete $rootScope.dialogs['modifypassword-dialog'];
							                };
							                
							                $scope.clearErrorMsg = function(){
							                	$scope.change.errorMsg = "";
							                }
							                
							                function UpdatePin(){
							                	if($rootScope.card){
							                			$rootScope.card.safeChangePinEx($scope.change.oldpassword, $scope.change.newpassword, 0X11, function(data){
							                				if(data.success){
							                					$scope.change.success = true;
							                				}
							                				else if( data.message ){
							                					$scope.change.errorMsg = data.message;
							                				}
							                				else {
							                					$scope.change.errorMsg = "安全口令修改失败，请重试！";
							                				}
							                			console.log(data);
							                		})
							                	}
							                	else{
							                		
							                	}
							                }
							            }
							            });
							            $rootScope.dialogs['modifypassword-dialog'] = modifyPassword;
				                };
				
				                $scope.cancel = function () {
				                    $modalInstance.dismiss('cancel');
				                    delete $rootScope.dialogs['setting-dialog'];
				                };
				            }
				        });
				
				modalInstance.result.then(function () {
						if(option.method){
			        		eval(option.method);
			        	}
			       });
			    $rootScope.dialogs['setting-dialog'] = modalInstance;
			   },
			   
			   openAboutDialog: openAboutDialog,
			   
			   checkUpdateDialog:checkUpdateDialog,
		    
			    exitApp: function(){
			    	removeDialog($rootScope)
			    	$state.go('login');
			    }
		    }
		  });
	}
	
	safekey.oncardout=function(){
		removeDialog($rootScope);
		win.show();
		var modalInstance = $modal.open({
            size:'notice-dialog1',
            templateUrl: './modeldialog/checkconfirm.html', 
            backdrop:'static',
            keyboard:false,
            controller: function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                    delete $rootScope.dialogs['confirm-dialog'];
                    setTimeout(function(){$state.go('login');},500);
                };

                $scope.cancel = function () {
                	$modalInstance.close();
                	delete $rootScope.dialogs['confirm-dialog'];
                    setTimeout(function(){$state.go('login');},500);
                };
            }
        });
        $rootScope.dialogs['confirm-dialog'] = modalInstance;
	}
	
}]);