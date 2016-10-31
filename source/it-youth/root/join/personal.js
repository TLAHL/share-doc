(function() {
    var e = Personal = function(map) {
        this.CLASS_NAME = 'personal';
        // 非法输入标志
        this.regFlagObj = {};
        this.datas = {};
        // 必填项
        this.requiredContent = ['name', 'cardId', 'school', 'education', 'major', 'phone', 'email', 'computerSkills', 'evaluation'];
        // 必填项标志
        this.requiredFlag = true;
    };
    // 输入非法性验证
    e.prototype.regVal = function(type) {
        var reg = null;
        switch (type) {
            case 'cardId':
                // 1、15位或18位，如果是15位，必需全是数字。
                // 2、如果是18位，最后一位可以是数字或字母Xx，其余必需是数字。
                reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
                break;
                // 手机是+、-、数字
            case 'phone':
                reg = /^[\+\-\,\(\)0-9\ ]+$/;
                break;
                // 邮箱是字母、数字、@、.
            case 'email':
                reg = /^([a-zA-Z0-9]-*\.*)+@([a-zA-Z0-9]-?)+(\.\w{2,})+$/;
                break;
                // 姓名是字母+汉字
            case 'name':
                reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
                break;
                // 专业必须是汉字
            case 'major':
                reg = /^([\u4E00-\u9FA5])+$/;
                break;
                // 学校必须是汉字
            case 'school':
                reg = /^([\u4E00-\u9FA5])+$/;
                break;
            default:
                break;
        }
        var value = $.trim(this.value);
        var flag = reg.test(value);
        if (flag === false) {
            $(".star." + type).addClass("red");
            personal.regFlagObj[type] = false;
        } else {
            $(".star." + type).removeClass("red");
            personal.regFlagObj[type] = true;
        }
    };
    // 提交报名表
    e.prototype.submit = function() {
        this.requiredFlag = true;
        for (var key in this.regFlagObj) {
            // 是否有非法输入
            if (this.regFlagObj[key] === false) {
                // 非法输入使用toast提示
                new Toast({
                    context: $('body'),
                    message: '请核对输入信息!',
                    time: 2000,
                    top: 500
                }).show();
                return;
            }
        }
        this._getPersonalInfo();
        // 必填项验证
        this._requiredDealOn();
        if (this.requiredFlag === false) {
            // 有未完成项，使用toast提示
            new Toast({
                context: $('body'),
                message: '您有未完成项，请核查！',
                time: 2000,
                top: 500
            }).show();
            return;
        }
        $("#submit").attr("onclick", "");
        // 发送请求，保存个人报名表
        this._savePersonalTable();
    };
    e.prototype._savePersonalTable = function() {
        $.ajax({
            url: "/vwp/personal/save.do",
            type: "post",
            timeout: 5000,
            contentType: "application/json",
            data: JSON.stringify(this.datas),
            dataType: "json",
            success: function(data) {
                if (data.result === "success") {
                    personal._showDetail();
                    $("#submit").attr("onclick", "personal.submit()");
                } else {
                    // 有未完成项，使用toast提示
                    new Toast({ context: $('body'), message: data.errValue, time: 2000, top: 500 }).show();
                    $("#submit").attr("onclick", "personal.submit()");
                    return;
                }
            },
            error: function(data) {
                new Toast({
                    context: $('body'),
                    message: "网络异常，请稍后重试！",
                    time: 2000,
                    top: 500
                }).show();
                $("#submit").attr("onclick", "personal.submit()");
            }
        });
    };
    // 显示详情页
    e.prototype._showDetail = function() {
        $(".mask").addClass("show");
        $(".detail").addClass("show");
        $("body").addClass("stop-scroll");
        jQuery.get("/youth/root/join/personal-detail.html", function(html) {
            var template = Handlebars.compile(html);
            $('.detail').append(template());
            for (var key in personal.datas) {
                if (key === "id") {
                    $('#detail').data("id", this.datas[key]);
                }
                if (key === "education" || key === "sex") {
                    var temp = personal.datas[key];
                    var value = datasConfig[key][temp];
                    personal.datas[key] = value;
                }
                if (key === "sendTime") {
                    var temp = personal.datas[key];
                    personal.datas[key] = "报名日期：" + temp;
                }
                if (key === "reward" || key === "ranking" || key === "experience" || key === "computerSkills" || key === "evaluation") {
                    var dataTemp = personal.datas[key].replace(/\n/g, "<br>");
                    $(".detail #" + key)[0].innerHTML = dataTemp;
                } else {
                    $(".detail #" + key).text(personal.datas[key]);
                }
            }
        });
    };
    // 关闭详情页
    e.prototype.closeDetail = function() {
        $(".detail").empty();
        $(".detail").removeClass("show");
        $(".mask").removeClass("show");
        window.location.reload();
        window.location.href = window.location.href;
        $("body").removeClass("stop-scroll");
    };
    // 必填项验证
    e.prototype._requiredDealOn = function() {
        for (var i = 0; i < this.requiredContent.length; i++) {
            var key = this.requiredContent[i];
            if (this.datas[key] === null || this.datas[key] === undefined || this.datas[key] === "" || this.datas[key] === -1) {
                this.requiredFlag = false;
                return;
            }
        }
    };
    // 获取个人信息
    e.prototype._getPersonalInfo = function() {
        this.datas = {};
        this.datas = {
            // 报名时间
            sendTime: today,
            // 学校
            school: $("#school").val(),
            // 姓名
            name: $("#name").val(),
            // 性别
            sex: parseInt($("#sex").next().find(".selected").attr("value")),
            // 身份证号
            cardId: $("#cardId").val(),
            // 入学时间
            admissionTime: $("#admissionTime").val(),
            // 专业
            major: $("#major").val(),
            // 年级
            education: parseInt($("#education").next().find(".selected").attr("value")),
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
        for (var key in this.datas) {
            if (this.datas[key] === -1 || this.datas[key] === "") {
                delete this.datas[key];
            } else if (key === 'sendTime' || key === "sex" || key === "admissionTime" || key === "education") {
                continue;
            } else {
                var value = $.trim(this.datas[key]);
                this.datas[key] = value;
            }
        }
    };
})();