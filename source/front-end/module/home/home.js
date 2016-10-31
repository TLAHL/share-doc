var obj = [{
    h1: "虚拟职场",
    h2: "VIRTUAL WORKPLACE",
    h3: "IT青年创新·创业帮",
    dh2: "创新 · 变革 · 共赢",
    p: ["帮助有志青年在IT领域进行项目实践；助力IT青年技术创新和创业梦想实现"],
    first: true,
}, {
    h1: "移动信息安全高新企业",
    h2: "MOBILE INFORMATION SECURITY TECH ENTERPRISES",
    h3: "移动引领 · 安全筑基",
    p: ["信大捷安是一家专业从事移动信息安全产品研究与开发、移动电子政务/商务安全接入及应用系统集成的高新技术企业。", "信大捷安作为核心成员单位参与发起成立了中国可信计算联盟；参与制订了公安信息移动接入技术规范和国家电网移动安全接入规范等5项行业规范；是郑州国家信息安全产品研发生产基地骨干企业。", "2015年9月3日国庆70周年大阅兵，公司与38军合作，获得了“抗战胜利70周年阅兵移动通信安全保障优秀单位”称号。"]
}, {
    h1: "西安地区第一个最大最完善的",
    h2: "XI'AN FIRST LARGEST AND MOST PERFECT",
    h3: "虚拟职场平台",
    p: ["我们拥有资深信息安全技术专家及产品开发运营团队。我们对虚拟职场提供资金、专业环境、技术指导、市场资源、人力资源和后勤保障等大力支持。", "吸纳优秀人才投身信息安全行业，打造本土信息安全生态圈；培养大学生实践能力和职业素质。"]
}, {
    h1: "加入我们",
    h2: "JONIN US",
    h3: "在线报名",
    p: ["线下开展地点：西安邮电大学长安校区", "时间：2016年4月25号"]
}];
// 注册助手
function registerHelper() {
    //是否显示
    Handlebars.registerHelper('isShow', function(index) {
        if (index === 0) {
            return "show"
        }
    });
}
// 注册助手
registerHelper();
// 加载4个页面，显示一个，隐藏三个
var itemTemplate = Handlebars.compile($("#item-template").html());
$('#home-content').prepend(itemTemplate(obj));
$('#home-content').find(".item[data-index=3]").addClass("join");
$('#home-content').find(".item[data-index=3]").find("h3").bind('click', function() {
    window.location.href = "/front/module/join/personal.html";
});


// 跳转定时器
var jumpTime = 2000;
var fadeTime = 200;
var timeoutTime = 100;
var timer = null;
var indexCurrent = 0;

setTimeout(function() {
    $("#home-content").fadeIn(fadeTime);
}, timeoutTime);
autoJump();

// 鼠标滚轮事件
$(".wrapper.home").bind('mousewheel', function(e) {
    var deltaY = e.originalEvent.deltaY;
    // 向下
    if (deltaY > 0) {
        indexCurrent++;
        if (indexCurrent === 4) {
            indexCurrent = 0
        }
    } else {
        indexCurrent--;
        if (indexCurrent === -1) {
            indexCurrent = 3
        }
    }
    jump();
    $("#home-content").addClass("show");
});


// 自动跳转
function autoJump() {
    timer = setInterval(function() {
        indexCurrent++;
        if (indexCurrent === 4) {
            indexCurrent = 0
        }
        // 淡出成功后，延时淡入
        $("#home-content").fadeOut(fadeTime, fadeOutCallback);
    }, jumpTime);
}

function fadeOutCallback() {
    jump(indexCurrent);
    // 延时显示
    setTimeout(function() {
        $("#home-content").fadeIn(fadeTime);
    }, timeoutTime);
}

function jump(index) {
    clearInterval(timer);
    if (index !== undefined) {
        indexCurrent = index;
    }
    var url = "/front/common/img/bj" + indexCurrent + ".png";
    $(".wrapper").css({ "background": "url(" + url + ")", "background-size": "100% 100%" });
    // 隐藏所有
    $("#home-content .item").removeClass("show");
    // 显示需要显示的
    $("#home-content").find(".item[data-index=" + indexCurrent + "]").addClass("show");
    // 控制radio样式
    $(".list div").removeClass("now");
    $(".list div:eq(" + indexCurrent + ")").addClass("now");
    autoJump();
}

// 更多信息
function moreInfo() {
    var index = $(this).parent().find(".item.show").data("index");
    switch (index) {
        case 0:
            window.location.href = "/front/module/workplace/workplace.html";
            break;
            // 创建单位背景
        case 1:
            window.location.href = "/front/module/workplace/workplace.html#background";
            break;
            // 平台支持
        case 2:
            window.location.href = "/front/module/workplace/workplace.html#support";
            break;
        case 3:
            window.location.href = "/front/module/join/join.html";
            break;
        default:
            break;
    }
}