// 获取公共部分模板
getCommonTemplate({
    // 导航条
    nav: true,
    // 当前选中
    nowSelect: "home",
    // 版权
    copyRight: false,
    // 悬浮球
    suspendedBall: {
        // 公告
        notice: true,
        // 官网
        official: true,
        // 微信扫一扫
        sweep: true,
        // 置顶
        top: false
    }
}, callback);

function callback(){
	noticeNewOrNot();
}

var obj = [{
    h1: "提前步入职场，“打怪升级”拿Offer"
        //	h2: "Step into your profession, and get your offer as easy as playing a monster fighting"
}, {
    h1: "加入我们"
        //	h2: "Join US"
}];


//function isObjectValueEqual(a, b) {
//  // Of course, we can do it use for in
//  // Create arrays of property names
//  var aProps = Object.getOwnPropertyNames(a);
//  var bProps = Object.getOwnPropertyNames(b);
// 
//  // If number of properties is different,
//  // objects are not equivalent
//  if (aProps.length != bProps.length) {
//      return false;
//  }
// 
//  for (var i = 0; i < aProps.length; i++) {
//      var propName = aProps[i];
// 
//      // If values of same property are not equal,
//      // objects are not equivalent
//      if (a[propName] !== b[propName]) {
//          return false;
//      }
//  }
// 
//  // If we made it this far, objects
//  // are considered equivalent
//  return true;
//} 
//比较数组是否相同
var modeler = new Object();
modeler.compArray = function(array1, array2) {
    if ((array1 && typeof array1 === "object" && array1.constructor === Array) && (array2 && typeof array2 === "object" && array2.constructor === Array)) {
        if (array1.length == array2.length) {
            for (var i = 0; i < array1.length; i++) {
                var ggg = modeler.compObj(array1[i], array2[i]);
                if (!ggg) {
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        throw new Error("argunment is  error ;");
    }
    return true;
};
modeler.compObj = function(obj1, obj2) { //比较两个对象是否相等，不包含原形上的属性计较
    if ((obj1 && typeof obj1 === "object") && ((obj2 && typeof obj2 === "object"))) {
        var count1 = modeler.propertyLength(obj1);
        var count2 = modeler.propertyLength(obj2);
        if (count1 == count2) {
            for (var ob in obj1) {
                if (obj1.hasOwnProperty(ob) && obj2.hasOwnProperty(ob)) {

                    if (obj1[ob].constructor == Array && obj2[ob].constructor == Array) //如果属性是数组
                    {
                        if (!modeler.compArray(obj1[ob], obj2[ob])) {
                            return false;
                        };
                    } else if (typeof obj1[ob] === "string" && typeof obj2[ob] === "string") //纯属性
                    {
                        if (obj1[ob] !== obj2[ob]) {
                            return false;
                        }
                    } else if (typeof obj1[ob] === "object" && typeof obj2[ob] === "object") //属性是对象
                    {
                        if (!modeler.compObj(obj1[ob], obj2[ob])) {
                            return false;
                        };
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    return true;
};
modeler.propertyLength = function(obj) { //获得对象上的属性个数，不包含对象原形上的属性
    var count = 0;
    if (obj && typeof obj === "object") {
        for (var ooo in obj) {
            if (obj.hasOwnProperty(ooo)) {
                count++;
            }
        }
        return count;
    } else {
        throw new Error("argunment can not be null;");
    }
};


//var jjj = modeler.compArray(data01, data02);
/*
 * 将对象存储进localStorage中，以便在整个页面周期内使用；
 * 刷新页面不重新对localStorage赋值；
 * 每次刷新会将重新取到的noticeObj 赋值为旧，避免影响界面状态；
 */
if (localStorage.noticeObj == null) {
    localStorage.noticeObj = JSON.stringify(noticeObj);
}
var newNoticeObjTemp = [];
for (var i = 0; i < noticeObj.length;i++) {
    var notice = {};
    for (var key in noticeObj[i]) {
        if (key !== "newMsg") {
            notice[key] = noticeObj[i][key];
        }
    }
    newNoticeObjTemp.push(notice);
}
var oldNoticeObjTemp = [];
var oldNoticeObj = JSON.parse(localStorage.noticeObj);
for (var i = 0; i < oldNoticeObj.length;i++) {
    var notice = {};
    for (var key in oldNoticeObj[i]) {
        if (key !== "newMsg") {
            notice[key] = oldNoticeObj[i][key];
        }
    }
    oldNoticeObjTemp.push(notice);
}
var nowNoticeObjStr = JSON.stringify(newNoticeObjTemp);
var oldNoticeObjStr = JSON.stringify(oldNoticeObjTemp);
if (nowNoticeObjStr !== oldNoticeObjStr) {
    localStorage.noticeObj = JSON.stringify(noticeObj);
}
  

function closeNoticeDia() {
    $(document).unmask();
    $(".notice1").hide();
    $(".notice-detail").hide();
    autoJump();
    noticeNewOrNot();
}

function closeNoticeDetailDia() {
    $(".notice1").show();
    $(".notice-detail").hide();
}

//进入提示详情
function goNoticeDetailDia(dom) {
    for (var i = 0; i < JSON.parse(localStorage.noticeObj).length; i++) {
        if ($(dom).find(".announce").text() == JSON.parse(localStorage.noticeObj)[i].head || $(dom).find(".announce-new").text() == JSON.parse(localStorage.noticeObj)[i].head) {
            var noticeObjItem = JSON.parse(localStorage.noticeObj)[i];
            $(".notice-detail").remove(); //刷新模板数据
            var noticeDetailTemplate = Handlebars.compile($("#noticeDetail-template").html());
            $("body").prepend(noticeDetailTemplate(noticeObjItem));
            noticeObj[i].newMsg = false;
            localStorage.noticeObj = JSON.stringify(noticeObj); //更新localStorage
            break;
        }
    }
    $(".notice1").remove();
    $("body").prepend(noticeTemplate(JSON.parse(localStorage.noticeObj))); //刷新模板数据
    $(".notice1").hide();
    $(".notice-detail").show();
}

//公告新消息提示
function noticeNewOrNot() {
    for (var i = 0; i < JSON.parse(localStorage.noticeObj).length; i++) {
        if (JSON.parse(localStorage.noticeObj)[i].newMsg == true) {
            $("#noticeImg").css("background-image", "url('/youth/img/notice_new.png')");
            break;
        }
        $("#noticeImg").css("background-image", "url('/youth/img/notice.png')");
    }
}

// 注册助手
function registerHelper() {
    //是否显示
    Handlebars.registerHelper('isShow', function(index) {
        if (index === 0) {
            return "show";
        }
    });
}


// 注册助手
registerHelper();
// 加载2个页面，显示一个，隐藏1个
var itemTemplate = Handlebars.compile($("#item-template").html());
$('#home-content').prepend(itemTemplate(obj));

var noticeTemplate = Handlebars.compile($("#notice-template").html());
$("body").prepend(noticeTemplate(JSON.parse(localStorage.noticeObj)));

// 跳转定时器
var jumpTime = 3500;
var fadeTime = 200;
var timeoutTime = 100;
var timer = null;
var indexCurrent = 0;

setTimeout(function() {
    noticeNewOrNot();
    $("#home-content").fadeIn(800);
    $("#home-content").animate({ left: '10%' }, 800);
}, timeoutTime);


// 鼠标滚轮事件
$(".home-wrapper").bind('mousewheel DOMMouseScroll', function(e) {
    var deltaY = e.originalEvent.deltaY;
    // 向下
    if (deltaY > 0) {
        indexCurrent += 1;
        if (indexCurrent === 2) {
            indexCurrent = 0
        }
    } else {
        indexCurrent -= 1;
        if (indexCurrent === -1) {
            indexCurrent = 1
        }
    }
    jump();
    //$("#home-content").addClass("show");
});

autoJump();
// 自动跳转
function autoJump() {
    timer = setInterval(function() {
        indexCurrent++;
        if (indexCurrent === 2) {
            indexCurrent = 0
        }
        // 淡出成功后，延时淡入
        $("#home-content").css("left", "-100%");
        $("#home-content").fadeOut(fadeTime, fadeOutCallback);
    }, jumpTime);
}

function fadeOutCallback() {
    jump(indexCurrent);

    // 延时显示
    setTimeout(function() {
        $("#home-content").fadeIn(200);
        $("#home-content").animate({ left: '10%' }, 800);
    }, timeoutTime);

}

function jump(index) {
    clearInterval(timer);
    if (index !== undefined) {
        indexCurrent = index;
    }
    if (indexCurrent == 0) {
        indexCurrentNext = 1;
    } else if (indexCurrent = 1) {
        indexCurrentNext = 0;
    }
    var url = "/youth/img/bj" + indexCurrent + ".jpg";
    var urlNext = "/youth/img/bj" + indexCurrentNext + ".jpg";
    $(".home-wrapper1").css({
        "background": "url(" + urlNext + ")",
        "top": "0",
        "background-size": "100% 100%"
    }).stop().animate({
        top: '-100%'
    });
    $(".home-wrapper2").css({
        "background": "url(" + url + ")",
        "top": "100%",
        "background-size": "100% 100%"
    }).stop().animate({
        top: '0'
    });

    // 隐藏所有
    $("#home-content .item").removeClass("show");
    // 显示需要显示的
    $("#home-content").find(".item[data-index=" + indexCurrent + "]").addClass("show");
    // 控制radio样式
    $(".list div").removeClass("now");
    $(".list div:eq(" + indexCurrent + ")").addClass("now");
    clearInterval(timer);
    autoJump();
}

// 更多信息
function moreInfo() {
    var index = $(this).parent().find(".item.show").data("index");
    switch (index) {
        case 0:
            window.location.href = "/c/workplace.html#background";
            break;
            // 创建单位背景
        case 1:
            window.location.href = "/d/join.html";
            break;
            // 平台支持
        case 2:
            window.location.href = "/youth/root/workplace/workplace.html#support";
            break;
        case 3:
            window.location.href = "/youth/root/join/join.html";
            break;
        default:
            break;
    }
}