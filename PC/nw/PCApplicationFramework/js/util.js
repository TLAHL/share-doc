var path = require('path');
var fs = require('fs');

function onfocusIframe(){
	window.settingInfo.isShowLock = false;
}

function lockDialog(){
	console.log(window.settingInfo.isShowLock)
	if(window.settingInfo.isShowLock == true && typeof window.settingInfo.openLockDialog == 'function'){
		window.settingInfo.openLockDialog();
	}
}

openUrlByDefaultBrowser = function(url)
{
	url && nw.openUrl(url);
}

function logout(){
	alert("注销");
}

function aboutApp(){
	alert("弹出关于窗口");
}

function systemSetting(){
	alert("弹出设置窗口");
}

function checkVersion(){
	alert("检查更新");
}

function setUserExperience(){
	alert("加入用户体验");
}

function closeChildWindow(){
	window.close();
}

function getSearchData(){
	return [{text:'aaa'},{text:'bbb'},{text:'ccc'},{text:'acd'},{text:'aer'}];
}

function submitSearch(data){
	console.log(data);
	alert(data);
}

function submitNotice(data){
	console.log(data);
	alert(data.data);
}

function submitExperience(){
	alert("加入用户体验计划成功！");
}

function playSong(customPath){
	if(!window.settingInfo.voicenotice) return;
	var process = require('process');
    var path = process.cwd();
    var defauleSongPath = path + "/PCApplicationFramework/resource/beep.wav";
    if(customPath){
    	defauleSongPath = path + "/" + customPath;
    }
	var media = nodefile.playSong();
	media.play(defauleSongPath);
}

function removeDialog(scope){
	var dialogs = scope.dialogs;
	if(dialogs){
		angular.forEach(dialogs, function(item){
			item.close();
		})
	}
}

function openMessage(msgs){
	console.log(settingInfo.desktopnotice);
	if(!settingInfo.desktopnotice){if(settingInfo.msgWindow){settingInfo.msgWindow.close();} return;}
	var callback = function(){};
	var screenWidth = window.screen.availWidth;
	var screenHeight = window.screen.availHeight;
	chlidwindow = openWindow({
			url:'./modeldialog/msg.html',
		    width: 279,
		    max_height: 582,
		    frame: false,
            resizable: false,
            show_in_taskbar: false,
            toolbar: false,
            focus: true,
            alwaysOnTop: true,
            show:false,
            args:{
            	msgs:msgs
            }
		  });

	chlidwindow.on('loaded', function(){
		chlidwindow.x = screenWidth-326-20;
		var h = chlidwindow.window.document.body.clientHeight;
		console.log('消息盒子的高度：' + h);
		chlidwindow.y = screenHeight-h + 15;
		console.log(chlidwindow.x + ":" + chlidwindow.y);
		chlidwindow.show();
	});

	chlidwindow.on('closed', function(){
		chlidwindow =  null;
	});
	settingInfo.msgWindow = chlidwindow;
}

//创建多层文件夹 同步
function mkdirsSync(dirpath, mode) { 
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true; 
}

//创建多层文件夹 异步
function mkdirs(dirpath, mode, callback) {
	console.log("dfasdfdsafdsa");
    callback = callback ||
    function() {};

    fs.exists(dirpath,
    function(exitsmain) {
        if (!exitsmain) {
            //目录不存在
            var pathtmp;
            var pathlist = dirpath.split(path.sep);
            var pathlistlength = pathlist.length;
            var pathlistlengthseed = 0;

            mkdir_auto_next(mode, pathlist, pathlist.length,
            function(callresult) {
                if (callresult) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            });

        }
        else {
            callback(true);
        }

    });
}

// 异步文件夹创建 递归方法
function mkdir_auto_next(mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
    function() {};
    if (pathlistlength > 0) {

        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }

        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {

            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }

            fs.exists(pathtmp,
            function(exists) {
                if (!exists) {
                    fs.mkdir(pathtmp, mode,
                    function(isok) {
                        if (!isok) {
                            mkdir_auto_next(mode, pathlist, pathlistlength,
                            function(callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                        }
                        else {
                            callback(false);
                        }
                    });
                }
                else {
                    mkdir_auto_next(mode, pathlist, pathlistlength,
                    function(callresult) {
                        callback(callresult);
                    },
                    pathlistlengthseed + 1, pathtmp);
                }
            });

        }

    }
    else {
        callback(true);
    }

}

function IniStruct() 
{ 
	this.Name = new String(); 
	this.Attribute = new Object(); 
	this.setName = function(Name) 
	{ 
	    Name = Name.toString(); 
	    var re = /^[^\s]+$/; 
	    if(!re.test(Name)) 
	    { 
	      return false; 
	    } 
	    else 
	    { 
	      this.Name = Name; 
	      return true; 
	    } 
	} 
	this.setAttribute = function(AttributeName,AttributeValue) 
	{ 
	    AttributeName = AttributeName.toString(); 
	    AttributeValue = AttributeValue.toString(); 
	    var reforName = /^\w+$/i; 
	    var reforValue = /^[^\s]*$/; 
	    if(!reforName.test(AttributeName) || !reforValue.test(AttributeValue)) 
	    { 
	      return false; 
	    } 
	    else 
	    { 
	      this.Attribute[AttributeName] = AttributeValue; 
	      return true; 
	    } 
	} 
	this.getAttribute = function(AttributeName) 
	{ 
	    var reforName = /^\w+$/i; 
	    if(!reforName.test(AttributeName)) 
	    { 
	      return false; 
	    } 
	    else 
	    { 
	      return this.Attribute[AttributeName]; 
	    } 
	} 
	this.toString = function() 
	{ 
	    var Str = new String(); 
	    Str += "[" + this.Name + "]\n"; 
	    for(var p in this.Attribute) 
	    { 
	      Str += p + "=" + this.Attribute[p] + "\n"; 
	    } 
	    return Str; 
	} 
	this.getArr = function() 
	{ 
	    var Arr = new Array(); 
	    Arr[0] = "[" + this.Name + "]"; 
	    var i = 1; 
	    for(var p in this.Attribute) 
	    { 
	      Arr[i++] = p + "=" + this.Attribute[p]; 
	    } 
	    return Arr; 
	} 
}
