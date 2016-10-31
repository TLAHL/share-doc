var nowSelect = null;
var copyRight = null;
// 获取公共部分模板
function getCommonTemplate(obj, callback) {
    nowSelect = obj.nowSelect;
    // 版权需要插在最后
    copyRight = obj.copyRight;
    obj.copyRight = false;
    $.ajax({
        url: "/youth/common/common.html",
        type: "get",
        dataType: "html",
        cache: false,
        complete: function(e) {
            var html = e.responseText;
            $("body").append(html);
            var commonTemplate = Handlebars.compile($("#common-template").html());
            // 先加载公共部分的其他模板
            $('.common-wrapper').prepend(commonTemplate(obj));
            setNow();
            // 再加载版权模板
            $("body").append(commonTemplate({
                copyRight: copyRight
            }));
            // 增加用户量统计
            if (document.cookie.indexOf("userCount")===-1) {
                addUserCount();
            }
            if (callback) {
                callback();
            }
        },
        error: function(e) {
            alert("失败");
        }
    })
}
// 增加用户统计
function addUserCount() {
    $.ajax({
        url: "/vwp/sys/increaseUserCount.do",
        type: "post",
        timeout: 5000,
        cache:false,
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                document.cookie = "userCount=true";
            } else {
                console.log(data);
            }
        },
        error: function(data) {
            console.log("增加用户量统计：网络异常！");
        }
    });
}


// 设置当前选中标签
function setNow() {
    $(".common-wrapper .nav li." + nowSelect).addClass("now");
}

// 展示QQ信息
function showQQInfo() {
    $(".common-wrapper .nav .qq-div").removeClass("hide");
    $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq2.png');
}
// 隐藏QQ信息
function hideQQInfo() {
    $(".common-wrapper .nav .qq-div").addClass("hide");
    if (location.href.indexOf("-") > -1) {
        $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq3.png');
    } else {
        $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq1.png');
    }
}

// 展示邮箱信息
function showEmailInfo() {
    $(".common-wrapper .nav .email-div").removeClass("hide");
    $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang2.png');
}
// 隐藏邮箱信息
function hideEmailInfo() {
    $(".common-wrapper .nav .email-div").addClass("hide");
    if (location.href.indexOf("-") > -1) {
        $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang3.png');
    } else {
        $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang1.png');
    }
}
// 返回顶部
function backToTop() {
    $('body,html').animate({ scrollTop: 0 }, 500);
};
// 显示公告入口
function showNoticeEnter() {
    $(".common-wrapper .suspended-ball .notice").addClass("hide");
    $(".common-wrapper .suspended-ball .notice-enter").removeClass("hide");
}
// 隐藏公告入口
function hideNoticeEnter() {
    $(".common-wrapper .suspended-ball .notice").removeClass("hide");
    $(".common-wrapper .suspended-ball .notice-enter").addClass("hide");
}
// 显示官网入口
function showOfficialEnter() {
    $(".common-wrapper .suspended-ball .official").addClass("hide");
    $(".common-wrapper .suspended-ball .official-enter").removeClass("hide");
}
// 隐藏官网入口
function hideOfficialEnter() {
    $(".common-wrapper .suspended-ball .official").removeClass("hide");
    $(".common-wrapper .suspended-ball .official-enter").addClass("hide");
}
// 显示二维码
function showSweepQrCode() {
    $(".common-wrapper .suspended-ball .sweep-qr-code-kuang").removeClass("hide");
}
// 隐藏二维码
function hideSweepQrCode() {
    $(".common-wrapper .suspended-ball .sweep-qr-code-kuang").addClass("hide");
}
// 打开官网
function openOffical() {
    window.open("http://www.xdja.com/pluto/portal");
}
// 返回首页
function showHome() {
    location.href = "/a/home.html"
}