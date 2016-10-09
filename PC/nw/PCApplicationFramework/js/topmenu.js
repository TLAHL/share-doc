var app = angular.module("TopMenu", ['ui.router', 'ui.bootstrap']);
app.controller("topMenuCtr",['$rootScope', '$scope',function($rootScope, $scope){
	window.opener.settingInfo.isShowLock = false;
	$scope.menu = window.opener.configFile.top_menu.menu;
	$scope.isUpdate = window.args.isUpdate;
	window.onblur = function(e)
	{
		window.close();
		window.opener.chlidwindow = null;
	}
	
	$scope.execute = function(item){
		
		if(item.id == '10002'){
			if(item.href){
				item.href && nw.openUrl(item.href);
			}
			closeChildWindow();
		}
		else if(item.id == '10003'){
			window.args.openNoticeDialog(item.method);
			closeChildWindow();
		}
		else if(item.id == '10004'){
			window.args.openUserExperienceDialog(item);
			closeChildWindow();
		}
		else if(item.id == '10006'){
			window.args.openSettingDialog();
			closeChildWindow();
		}
		else if(item.id == '10007'){
			window.args.openAboutDialog();
			closeChildWindow();
		}
		else if(item.id == '10008')
		{
			window.args.exitApp();
			closeChildWindow();
		} else if(item.id == '10005'){
			window.args.checkUpdateDialog();
			closeChildWindow();
		}
		else if(angular.isDefined(item.method)) {eval(item.method);closeChildWindow();}
	}
}]);