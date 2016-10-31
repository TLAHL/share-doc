for (var i = 0; i < 4; i++) {
    var listTemplate = Handlebars.compile($("#table-template").html());
    $('#team-table tbody').append(listTemplate(i));
}

// 设置报名日期
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
var date = now.getDate();
$("#sendTime").val(year + '年' + month + '月' + date + '日');
var today = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);

var schoolName = datasConfig.school[school];
$(".school").each(function(index, element) {
    $(element).val(schoolName);
})


// 从项目等你进入
var href = window.location.href;
if (href.indexOf("?") > -1) {
    var paramsString = href.split("?")[1];
    var params = paramsString.split(",");
    if (params.length === 2) {
        // 设置项目类型
        var projectType = params[0].split("=")[1];
        $("#type input:eq(" + projectType + ")").attr("checked", true);
        // 设置项目名
        var projectName = decodeURI(params[1].split("=")[1]);
        $("#name").val(projectName);
    }
}

// 非法输入标志
var regFlagObj = {};
var datas = null;
// 必填项
var requiredContent = ['name', 'type', 'target', 'stage', 'contact', 'phone', 'email', 'school', 'email', 'overview', 'members'];
// 必填项标志
var requiredFlag = true;

// 输入非法性验证
function regVal(type) {
    var reg = null;
    switch (type) {
        case 'phone':
            reg = /^[\+\-\,\(\)0-9\ ]+$/;
            break;
        case 'email':
            reg = /^([a-zA-Z0-9]-*\.*)+@([a-zA-Z0-9]-?)+(\.\w{2,})+$/;
            break;
        case 'contact':
            reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
            break;
        case 'major':
            reg = /^([\u4E00-\u9FA5])+$/;
            break;
        case 'membername':
            reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
            break;
        case 'membermajor':
            reg = /^([\u4E00-\u9FA5])+$/;
            break;
        default:
            break;
    }
    var flag = reg.test(this.value);
    if (flag === false) {
        $(this).next().addClass("red");
        regFlagObj[type] = false;
    } else {
        $(this).next().removeClass("red");
        regFlagObj[type] = true;
    }

    if (type === "membername" || type === "membermajor") {
        var $star = $(this).parents("table").find("span.star."+type);
        if (flag === false) {
            $star.addClass("red");
            regFlagObj[type] = false;
        } else {
            $star.removeClass("red");
            regFlagObj[type] = true;
        }
    }
}

// 提交报名表
function submit() {
    requiredFlag = true;
    for (var key in regFlagObj) {
        // 是否有非法输入
        if (regFlagObj[key] === false) {
            // 非法输入使用toast提示
            new Toast({ context: $('body'), message: '请核对输入信息!', time: 2000, top: 500 }).show();
            return;
        }
    }
    getProjectInfo();
    // 必填项验证
    requiredDealOn();
    if (requiredFlag === false) {
        // 有未完成项，使用toast提示
        new Toast({ context: $('body'), message: '您有未完成项，请核查！', time: 2000, top: 500 }).show();
        return;
    }
    // 发送请求，保存个人报名表
    saveProjectTable();
}

function saveProjectTable() {
    $.ajax({
        url: "/vwp/project/save.do",
        type: "post",
        data: {
            datas: JSON.stringify(datas)
        },
        dataType: "json",
        success: function(data) {
            showDetail();
        },
        error: function(data) {
            new Toast({ context: $('body'), message: "网络异常，请稍后重试！", time: 2000, top: 500 }).show();
        }
    });
}

// 显示详情页
function showDetail() {
    $(".mask").addClass("show");
    $(".detail").addClass("show");
    $("body").addClass("stop-scroll");
    jQuery.get("/front/module/join/project-detail.html", function(html) {
        var template = Handlebars.compile(html);
        $('.detail').append(template());
        for (var key in datas) {
            if (key === "id") {
                $('#detail').data("id", datas[key]);
                $(".detail #" + key).text(datas[key]);
            }
            if (key === "school" || key === "education" || key === "sex" || key === "type") {
                var temp = datas[key];
                var value = datasConfig[key][temp];
                datas[key] = value;
                $(".detail #" + key).eq(0).text(datas[key]);
            }
            if (key === "sendTime") {
                var temp = datas[key];
                datas[key] = "报名日期：" + temp;
                $(".detail #" + key).text(datas[key]);
            }
            if (key === "members") {
                setMembers(datas);
            } else {
                $(".detail #" + key).text(datas[key]);
            }

        }
    });
}
// 设置成员值
function setMembers(datas) {
    var members = datas.members;
    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        for (var j in member) {
            if (j === "school" || j === "education" || j === "sex") {
                var temp = member[j];
                var value = datasConfig[j][temp];
                member[j] = value;
            }
            $(".detail .members tr").find("#" + j + i).text(member[j]);
        }
    }
}

function closeDetail() {
    $(".detail").empty();
    $(".detail").removeClass("show");
    $(".mask").removeClass("show");
    window.location.href = "/front/module/join/project.html"
}
// 必填项验证
function requiredDealOn() {
    for (var i = 0; i < requiredContent.length; i++) {
        var key = requiredContent[i];
        if (datas[key] instanceof Array) {
            if (datas[key].length === 0) {
                requiredFlag = false;
                return;
            }

        }
        if (datas[key] === null || datas[key] === undefined) {
            requiredFlag = false;
            return;
        }
    }
}
// 获取项目信息
function getProjectInfo() {
    var members = [];
    var member = {};
    $("table tr").each(function(index, element) {
        if (index === 0) {

        } else {
            member = {
                // 姓名
                name: $(element).find(".membername").val(),
                // 性别
                sex: $(element).find("#sex").get(0).selectedIndex - 1,
                // 学校
                school: 0,
                // 专业
                major: $(element).find(".membermajor").val(),
                // 年级/学历
                education: $(element).find("#education").get(0).selectedIndex - 1,
                // 角色
                role: $(element).find(".role").val()
            };
            var falgTemp = true;
            for (var key in member) {
                if (key === "role") {
                    continue;
                } else {
                    if (member[key] === undefined || member[key] === null || member[key] === -1 || member[key] === "") {
                        falgTemp = false;
                    }
                }
            }
            if (falgTemp) {
                members.push(member);
            }
        }
    })
    datas = {
        // 报名时间
        'sendTime': today,
        // 项目名称
        'name': $("#name").val(),
        // 目标
        'target': $("#target input:checked").next().text(),
        // 项目阶段
        'stage': $("#stage input:checked").next().text(),
        // 项目类型
        'type': $("#type input:checked").val(),
        // 联系人
        'contact': $("#contact").val(),
        // 学校
        'school': 0,
        // 院系
        // 'department': $("#department").val(),
        // 专业
        'major': $("#major").val(),
        // 年级
        'education': $("#education").get(0).selectedIndex - 1,
        // 电话
        'phone': $("#phone").val(),
        // 邮箱
        'email': $("#email").val(),
        // 项目概述
        'overview': $("#overview textarea").val(),
        // 成员
        'members': members
    }
    for (var key in datas) {
        if (datas[key] === -1 || datas[key] === "") {
            delete datas[key];
        }
    }
}