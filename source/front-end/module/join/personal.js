// 设置日期
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
var date = now.getDate();
$("#sendTime").val(year + '年' + month + '月' + date + '日');
var today = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
$("#admissionTime").val("2013-09-01");

var schoolName = datasConfig.school[school];
$("#school").val(schoolName);


// 非法输入标志
var regFlagObj = {};
var datas = {};
// 必填项
var requiredContent = ['name', 'cardId', 'school', 'education', 'major', 'phone', 'email', 'computerSkills', 'evaluation'];
// 必填项标志
var requiredFlag = true;
// 身份证校验标志
var cardIdFlag = true;
// 身份证校验提示
var cardIdTip = "";

// 身份证校验
function VerifyCardId() {
    var cardId = $("#cardId").val();
    $.ajax({
        url: "/vwp/personal/checkCardId.do",
        type: "post",
        data: {
            cardId: cardId
        },
        dataType: "json",
        success: function(data) {
            if (data.errValue) {
                new Toast({ context: $('body'), message: data.errValue, time: 2000, top: 500 }).show();
                cardIdFlag = false;
                cardIdTip = data.errValue;
            } else {
                cardIdFlag = true;
            }
        },
        error: function(data) {
            new Toast({ context: $('body'), message: "网络异常，请稍后重试！", time: 2000, top: 500 }).show();
        }
    });
}
// 输入非法性验证
function regVal(type) {
    var reg = null;
    switch (type) {
        case 'cardId':
            // 1、15位或18位，如果是15位，必需全是数字。
            // 2、如果是18位，最后一位可以是数字或字母Xx，其余必需是数字。
            reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            break;
        case 'phone':
            reg = /^[\+\-\,\(\)0-9\ ]+$/;
            break;
        case 'email':
            reg = /^([a-zA-Z0-9]-*\.*)+@([a-zA-Z0-9]-?)+(\.\w{2,})+$/;
            break;
        case 'name':
            reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
            break;
        case 'major':
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
}
// 提交报名表
function submit() {
    requiredFlag = true;
    VerifyCardId();
    // 身份证校验是否通过
    if (cardIdFlag === false) {
        // 身份证校验不通过使用toast提示
        new Toast({ context: $('body'), message: cardIdTip, time: 2000, top: 500 }).show();
        return;
    }
    for (var key in regFlagObj) {
        // 是否有非法输入
        if (regFlagObj[key] === false) {
            // 非法输入使用toast提示
            new Toast({ context: $('body'), message: '请核对输入信息!', time: 2000, top: 500 }).show();
            return;
        }
    }

    getPersonalInfo();
    // 必填项验证
    requiredDealOn();
    if (requiredFlag === false) {
        // 有未完成项，使用toast提示
        new Toast({ context: $('body'), message: '您有未完成项，请核查！', time: 2000, top: 500 }).show();
        return;
    }
    $("#submit").off("click");
    // 发送请求，保存个人报名表
    savePersonalTable();
}

function savePersonalTable() {
    $.ajax({
        url: "/vwp/personal/save.do",
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
    jQuery.get("/front/module/join/personal-detail.html", function(html) {
        var template = Handlebars.compile(html);
        $('.detail').append(template());
        for (var key in datas) {
            if (key === "id") {
                $('#detail').data("id", datas[key]);
            }
            if (key === "school" || key === "education" || key === "sex") {
                var temp = datas[key];
                var value = datasConfig[key][temp];
                datas[key] = value;
            }
            if (key === "sendTime") {
                var temp = datas[key];
                datas[key] = "报名日期：" + temp;
            }
            $(".detail #" + key).text(datas[key]);
        }
    });
}

function closeDetail() {
    $(".detail").empty();
    $(".detail").removeClass("show");
    $(".mask").removeClass("show");
    window.location.href = "/front/module/join/personal.html"
}
// 必填项验证
function requiredDealOn() {
    for (var i = 0; i < requiredContent.length; i++) {
        var key = requiredContent[i];
        if (datas[key] === null || datas[key] === undefined || datas[key] === "" || datas[key] === -1) {
            requiredFlag = false;
            return;
        }
    }
}
// 获取个人信息
function getPersonalInfo() {
    datas = {
        // 报名时间
        sendTime: today,
        // 学校
        school: school,
        // 姓名
        name: $("#name").val(),
        // 性别
        sex: $("#sex").get(0).selectedIndex - 1,
        // 身份证号
        cardId: $("#cardId").val(),
        // 入学时间
        admissionTime: $("#admissionTime").val(),
        // 院系
        // department: $("#department").val(),
        // 专业
        major: $("#major").val(),
        // 年级
        education: $("#education").get(0).selectedIndex - 1,
        // 电话
        phone: $("#phone").val(),
        // 邮箱
        email: $("#email").val(),
        // 奖励
        reward: $("#reward").val(),
        // 成绩排名
        ranking: $("#ranking").val(),
        // 培训经历
        experience: $("#experience").val(),
        // 计算机技能
        computerSkills: $("#computerSkills").val(),
        // 自我评价
        evaluation: $("#evaluation").val()
    };
    for (var key in datas) {
        if (datas[key] === -1 || datas[key] === "") {
            delete datas[key];
        }
    }
}