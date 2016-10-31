// 获取公共部分模板
getCommonTemplate({
    // 导航条
    nav: true,
    // 当前选中
    nowSelect: "workplace",
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
});

var projects = [{
    "name": "信息安全项目",
    "lists": [{
        "name": "双系统项目",
        "summary": "如今随着安卓智能机的应用场景越来越多，在支付、金融、隐私等方面的安全隐患也就越来越多，人们对其安全性能的要求也就越来越高。与此同时酷派已经将双系统安全技术应用到旗舰机型-锋尚MAX上，由此可见双系统有强劲需求也是未来手机发展的一个方向。基于这些原因我们公司也开始了自己双系统的研发工作，我们对于安全的要求更高，所以双系统的实现也会选择更底层一些。我们通过Linux NameSpace、Cgroup等技术实现了一套双Android系统解决方案。",
        "members": "产品经理2人；研发3-5人",
        "teacher": "Gary、Jacky、Jason.hou、Andy、Chalise、Nick",
        "knowledge": ["OS：Linux、Android","开发语言：C、C++","技术框架：Android 服务、Socket 通信、Linux 驱动、Linux NameSpace、Cgroup、WIFI、Camera"]
    }]
}, {
    "name": "应用软件项目",
    "lists": [{
        "name": "音视频项目",
        "summary": "音视频直播平台是一款类似YY语音、嘟嘟等音视频直播软件，它可以完成音视频的一对多直播等功能，具体包括：（基本功能）音视频点播、一对多直播；（扩展功能）音视频一对一P2P的Voip电话。",
        "members": "产品设计及推广2人、客户端2人、后台2人、客户端测试1人、后台测试1人",
        "teacher": "Gary、Jacky、Jason.hou、Andy、Chalise、Nick",
        "knowledge": ["OS：Android、Windows、linux、ios"," 开发语言：C、Java、JavaScript","  客户端技术框架：WebRtc（可基于Chromium来实现，也可基于WebRtc独立开源项目实现","  服务器技术框架：FreeSwitch、WebRtc特有服务器；"]
    },{
        "name": "社交平台",
        "summary": "社交平台是一款类似微信的社交软件，它可以完成文字（语音）聊天、群组、好友圈、摇一摇、附近的人、虚拟抢红包等功能，并可基于此社交平台来实现其他附加与学生自己生活相关的功能；具体包括：基本功能、扩展功能、其他扩展功能。基本功能：即时通讯（文本、语音段、视频段的收发）、好友圈、虚拟抢红包；扩展功能：基于地理信息位置的服务，例如：查找附近的人，类似微信的摇一摇交友等；其他扩展功能：可基于上述基本功能和基本扩展功能完成，具体功能可由同学们自己来定义、设计和开发，例如：可以和学校课表系统结合来查询空闲教室等等；",
        "members": "产品设计及推广2人、客户端2人、后台3人、客户端测试1人、后台测试1人",
        "teacher": "Gary、Jacky、Jason.hou、Andy、Chalise、Nick",
        "knowledge": ["OS：Android、Windows、linux、ios（可选）"," 开发语言：C、Java、linux Shell、Python","  使用数据库：MySQL"," 其他技术：高并发处理、微服务开发。"]
    }]
}, {
//  "name": "智能硬件项目",
//  "lists": []
}];

if (location.href.indexOf("parentIndex") > -1) {
    showDetail();
} else {
    // 添加简介
    var simpleTemplate = Handlebars.compile($("#jianjie-template").html());
    $('#workplace-home-div').append(simpleTemplate());
    // 添加列表
    var listTemplate = Handlebars.compile($("#list-template").html());
    $('#list-div').prepend(listTemplate(projects));
    if (location.href.indexOf("workplace-title") > -1) {
        $("#workplace-title")[0].scrollIntoView();
    }
    // 为列表绑定事件
    $(".title.list").each(function(index, element) {
        var index = $(element).data("index");
        var parentIndex = $(element).parent().find(".title").data("index");
        var hrefTemp = "/c/workplace.html" + "?parentIndex=" + parentIndex + "&index=" + index;
        $(element).find("a").attr("href", hrefTemp);
    });
}

function showDetail() {
    var url = location.href;
    var params = url.split("?")[1].split("&");
    parentIndex = params[0].split("=")[1];
    index = params[1].split("=")[1];

    var project = projects[parentIndex].lists[index];
    project.type = projects[parentIndex].name;
    project.parentIndex = parentIndex;
    project.index = index;

    var detailTemplate = Handlebars.compile($("#detail-template").html());
    $('#detail-div').empty().prepend(detailTemplate(project));
    $("#workplace-content")[0].scrollIntoView();
}