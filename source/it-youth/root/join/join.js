// 获取公共部分模板
getCommonTemplate({
    // 导航条
    nav: true,
    // 当前选中
    nowSelect: "join",
    // 版权
    copyRight: true,
    // 悬浮球
    suspendedBall: {
        // 公告
        notice: false,
        // 官网
        official: true,
        // 微信扫一扫
        sweep: true,
        // 置顶
        top: true
    }
}, callback);
// 设置QQ邮箱样式
function callback() {
    if (location.href.indexOf("youth-table") > -1) {
        changeClass();
    } else if (location.href.indexOf("project-table") > -1) {
        changeClass();
    } else if (location.href.indexOf("personal-table") > -1) {
        changeClass();
    } else {
        converChangeClass();
    }
}
personal = new Personal();
project = new Project();
youth = new Youth();

getConfig();
setDate();

// 设置日期
function setDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    $("#sendTime").val(year + '年' + month + '月' + date + '日');
    window.today = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
    $("#admissionTime").val("2013-09-01");
};

var _eventHandler = {
    showSelectLists: function(e) {
        showSelectLists.call(this);
        e.stopPropagation();
    }
};

function bindEvent() {
    $(".join-wrapper").find("[data-handler]").map(function(e) {
        $(this).off($(this).data("event")).on($(this).data("event"), _eventHandler[$(this).data("handler")]);
    });
}

if (location.href.indexOf("youth-table") > -1) {
    for (var i = 0; i < 4; i++) {
        var listTemplate = Handlebars.compile($("#youth-table-template").html());
        $('#team-table tbody').append(listTemplate(i));
    }
    bindEvent();
} else if (location.href.indexOf("project-table") > -1) {
    for (var i = 0; i < 4; i++) {
        var listTemplate = Handlebars.compile($("#project-table-template").html());
        $('#team-table tbody').append(listTemplate(i));
    }
    bindEvent();
} else if (location.href.indexOf("personal-table") > -1) {
    bindEvent();
}

// 切换样式
function changeClass() {
    $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq3.png');
    $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang3.png');
}
// 反切换样式
function converChangeClass() {
    $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq1.png');
    $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang1.png');
}
$("body").click(function() {
    // 关闭所有下拉列表
    $(".join-wrapper ul.select").addClass("hide");
});

// 获取配置文件
function getConfig() {
    $.ajax({
        url: "/youth/config/config.json",
        cache: false,
        timeout: 2000,
        type: 'GET',
        async:false,
        success: function(data) {
            datasConfig = data;
        },
        error: function(data) {
            new Toast({
                context: $('body'),
                message: "网络异常，请稍后重试！",
                time: 2000,
                top: 500
            }).show();
        }
    });
}



$("input").attr("autocomplete", "off");

function isMaxlength(len) {
    this.value = this.value.substring(0, len);
};
$("#admissionTime").click(function() {
    // 点击入学时间，关闭所有下拉列表
    $(".join-wrapper ul.select").addClass("hide");
});


// 切换样式
function changeClass() {
    $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq3.png');
    $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang3.png');
}
// 反切换样式
function converChangeClass() {
    $(".common-wrapper .nav .contact img.qq").attr('src', '/youth/img/qq1.png');
    $(".common-wrapper .nav .contact img.email").attr('src', '/youth/img/youxiang1.png');
}

// 显示下拉列表
function showSelectLists() {
    $(".join-wrapper ul.select").addClass("hide");
    $(this).next().removeClass("hide");
}
// 选择一个下拉项
function selectOneList() {
    // 切换样式
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected");
    $(this).parent().addClass("hide");
    // 设置数值
    var text = $(this).text();
    $(this).parent().prev().text(text);
}

function showInfo() {
    $(this).find(".trangle-up").removeClass("hide");
    $(this).find("p").removeClass("hide");
}

function hideInfo() {
    $(this).find(".trangle-up").addClass("hide");
    $(this).find("p").addClass("hide");
}