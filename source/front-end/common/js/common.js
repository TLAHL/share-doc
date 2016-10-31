// 获取配置文件
getConfig();
// 获取站点
getStation();
// 返回顶部
var _isIE = false;
if  ((navigator.userAgent.indexOf('MSIE')  >=  0)      &&  (navigator.userAgent.indexOf('Opera')  <  0)) {    
    _isIE = true;
}


if (_isIE) {
    document.attchEvent('onmouseScroll', scrollFunc, false);
} else {
    document.addEventListener('mouseScroll', scrollFunc, false);
}
window.onmousewheel = document.onmousewheel = scrollFunc;

$(".back-to-up").bind('click', function() {
    setTimeout(function() {
        scrollFunc();
    }, 50);
});
// 获取配置文件
function getConfig() {
    $.ajax({
        url: "/front/common/config/config.json",
        cache: false,
        type: 'GET',
        async: false,
        success: function(data) {
            datasConfig = data;
        },
        error: function(data) {
            alert("网络异常！");
        }
    });
}
// 获取站点
function getStation() {
    $.ajax({
        url: "/vwp/site/get.do",
        cache: false,
        type: 'get',
        async: false,
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                school = data.value;
            } else {
                registerStation(datasConfig[defaultSchool]);
            }
        },
        error: function(data) {
            alert("网络异常！");
        }
    });
}
// 注册站点
function registerStation(school) {
    $.ajax({
        url: "/vwp/site/register.do",
        cache: false,
        type: 'post',
        async: false,
        data: {
            school: school
        },
        success: function(data) {
            console.log("注册站点成功！");
        },
        error: function(data) {
            alert("网络异常！");
        }
    });
}

// 滚轮事件回调方法
function scrollFunc() {
    $(".back-to-up").removeClass("hide");
    if (_isIE) {
        if (screenY === 0) {
            $(".back-to-up").addClass("hide");
        }
    } else {
        if (scrollY === 0) {
            $(".back-to-up").addClass("hide");
        }
    }
}

// 展示QQ信息
function showQQInfo() {
    $(".header .qq-div .name").text(datasConfig.school[school] + "官方QQ群：");
    $(".header .qq-div .num").text(datasConfig.qqInfo[school]);
    $(".header .qq-div").removeClass("hide");
    $(".header .contact img.qq").attr('src', '/front/common/img/qq2.png');
}
// 隐藏QQ信息
function hideQQInfo() {
    $(".header .qq-div").addClass("hide");
    $(".header .contact img.qq").attr('src', '/front/common/img/qq1.png');
}

// 展示邮箱信息
function showEmailInfo() {
    $(".header .email-div .name").text(datasConfig.school[school] + "虚拟职场邮箱：");
    $(".header .email-div .num").text(datasConfig.emailInfo[school]);
    $(".header .email-div").removeClass("hide");
    $(".header .contact img.email").attr('src', '/front/common/img/youxiang2.png');
}
// 隐藏邮箱信息
function hideEmailInfo() {
    $(".header .email-div").addClass("hide");
    $(".header .contact img.email").attr('src', '/front/common/img/youxiang1.png');
}