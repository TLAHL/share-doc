(function() {
    var e = Youth = function(map) {
        this.CLASS_NAME = 'youth';
        // 非法输入标志
        this.regFlagObj = {};
        this.datas = {};
        // 必填项
        this.requiredContent = ['name', 'type', 'target', 'stage', 'contact', 'phone', 'email', 'school', 'major', 'email', 'city', 'overview', 'members'];
        // 必填项标志
        this.requiredFlag = true;
    };

    // 输入非法性验证
    e.prototype.regVal = function(type) {
        var reg = null;
        switch (type) {
            case 'name':
                reg = /^[^.]+$/;
                break;
            case 'contact':
                reg = /^([A-Za-z]|[\u4E00-\u9FA5])+$/;
                break;
            case 'phone':
                reg = /^[\+\-\,\(\)0-9\ ]+$/;
                break;
            case 'city':
                reg = /^([\u4E00-\u9FA5])+$/;
                break;
            case 'email':
                reg = /^([a-zA-Z0-9]-*\.*)+@([a-zA-Z0-9]-?)+(\.\w{2,})+$/;
                break;
                // 学校必须是汉字
            case 'school':
                reg = /^([\u4E00-\u9FA5])+$/;
                break;
                // 专业必须是汉字
            case 'major':
                reg = /^([\u4E00-\u9FA5])+$/;
                break;
            case 'memberschool':
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
        var value = $.trim(this.value);
        var flag = reg.test(value);
        if (flag === false) {
            $(".star." + type).addClass("red");
            youth.regFlagObj[type] = false;
        } else {
            $(".star." + type).removeClass("red");
            youth.regFlagObj[type] = true;
        }

        if (type === "memberschool" || type === "membername" || type === "membermajor") {
            youth._regValMembers.call(this, type, reg);
        }
    };
    // 验证团队成员
    e.prototype._regValMembers = function(type, reg) {
        var $star = $(this).parents("table").find("span.star." + type);
        // 获取同列元素
        var items = $("." + type);
        var notNullItems = [];
        items.each(function(index, element) {
            if (index !== 0 && $.trim(element.value)) {
                notNullItems.push(element);
            }
        });
        var memberFlag = true;
        // 不允许全空
        if (notNullItems.length === 0) {
            memberFlag = false;
        } else {
            for (var i = 0; i < notNullItems.length; i++) {
                var valueTemp = $.trim(notNullItems[i].value);
                if (reg.test(valueTemp) === false) {
                    memberFlag = false;
                }
            }
        }
        if (memberFlag === false) {
            $star.addClass("red");
            youth.regFlagObj[type] = false;
        } else {
            $star.removeClass("red");
            youth.regFlagObj[type] = true;
        }
    };

    // 提交报名表
    e.prototype.submit = function() {
        this.requiredFlag = true;
        for (var key in this.regFlagObj) {
            // 是否有非法输入
            if (this.regFlagObj[key] === false) {
                // 非法输入使用toast提示
                new Toast({ context: $('body'), message: '请核对输入信息!', time: 2000, top: 500 }).show();
                return;
            }
        }
        this._getyouthInfo();
        // 必填项验证
        this._requiredDealOn();
        if (this.requiredFlag === false) {
            // 有未完成项，使用toast提示
            new Toast({ context: $('body'), message: '您有未完成项，请核查！', time: 2000, top: 500 }).show();
            return;
        }
        $("#submit").attr("onclick", "");
        // 发送请求，保存个人报名表
        this._saveyouthTable();
    };

    e.prototype._saveyouthTable = function() {
        $.ajax({
            url: "/vwp/entrepreneurial/save.do",
            type: "post",
            timeout: 5000,
            contentType: "application/json",
            data: JSON.stringify(this.datas),
            dataType: "json",
            success: function(data) {
                if (data.result === "success") {
                    youth._showDetail();
                    $("#submit").attr("onclick", "youth.submit()");
                } else {
                    // 有未完成项，使用toast提示
                    new Toast({ context: $('body'), message: data.errValue, time: 2000, top: 500 }).show();
                    $("#submit").attr("onclick", "youth.submit()");
                    return;
                }
            },
            error: function(data) {
                new Toast({ context: $('body'), message: "网络异常，请稍后重试！", time: 2000, top: 500 }).show();
                $("#submit").attr("onclick", "youth.submit()");
            }
        });
    };
    // 显示详情页
    e.prototype._showDetail = function() {
        $(".mask").addClass("show");
        $(".detail").addClass("show");
        $("body").addClass("stop-scroll");
        jQuery.get("/youth/root/join/youth-detail.html", function(html) {
            var template = Handlebars.compile(html);
            $('.detail').append(template());
            for (var key in youth.datas) {
                if (key === "id") {
                    $('#detail').data("id", youth.datas[key]);
                    $(".detail #" + key).text(youth.datas[key]);
                } else if (key === "education" || key === "sex" || key === "type") {
                    var temp = youth.datas[key];
                    var value = datasConfig[key][temp];
                    youth.datas[key] = value;
                    $(".detail #" + key).eq(0).text(youth.datas[key]);
                } else if (key === "sendTime") {
                    var temp = youth.datas[key];
                    youth.datas[key] = "报名日期：" + temp;
                    $(".detail #" + key).text(youth.datas[key]);
                } else if (key === "members") {
                    youth._setMembers(youth.datas);
                } else if (key === "overview") {
                    var dataTemp = youth.datas.overview.replace(/\n/g, "<br>");
                    $(".detail #" + key)[0].innerHTML =dataTemp;
                } else {
                    $(".detail #" + key).text(youth.datas[key]);
                }

            }
        });
    };

    // 设置成员值
    e.prototype._setMembers = function(datas) {
        var members = this.datas.members;
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            for (var j in member) {
                if (j === "education" || j === "sex") {
                    var temp = member[j];
                    var value = datasConfig[j][temp];
                    member[j] = value;
                }
                $(".detail").find("#" + j + i).text(member[j]);
            }
        }
    };

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
            if (this.datas[key] instanceof Array) {
                if (this.datas[key].length === 0) {
                    this.requiredFlag = false;
                    return;
                }

            }
            if (this.datas[key] === null || this.datas[key] === undefined) {
                this.requiredFlag = false;
                return;
            }
        }
    };
    // 获取项目信息
    e.prototype._getyouthInfo = function() {
        var members = [];
        var member = {};
        $("table tr").each(function(index, element) {
            if (index === 0) {

            } else {
                member = {
                    // 姓名
                    name: $(element).find(".membername").val(),
                    // 性别
                    sex: parseInt($(element).find(".membersex").next().find(".selected").attr("value")),
                    // 学校
                    school: $(element).find(".memberschool").val(),
                    // 专业
                    major: $(element).find(".membermajor").val(),
                    // 年级/学历
                    education: parseInt($(element).find(".membereducation").next().find(".selected").attr("value")),
                    // 角色
                    role: $(element).find(".role").val()
                };
                var falgTemp = true;
                for (var key in member) {
                    if (key === "role") {
                        continue;
                    } else {
                        if (member[key] === undefined || member[key] === null || member[key] === -1 || member[key] === "" || member[key] === NaN) {
                            falgTemp = false;
                        }
                    }

                    if (key === 'sex' || key === "education") {
                        continue;
                    } else {
                        var value = $.trim(member[key]);
                        member[key] = value;
                    }
                }
                if (falgTemp) {
                    members.push(member);
                }
            }
        })
        this.datas = {
            // 报名时间
            'sendTime': today,
            // 项目名称
            'name': $("#name").val(),
            // 目标
            'target': $("#target .radio.select").next().text(),
            // 项目阶段
            'stage': $("#stage .radio.select").next().text(),
            // 项目类型
            'type': parseInt($("#type .radio.select").attr("value")),
            // 联系人
            'contact': $("#contact").val(),
            // 学校
            'school': $("#school").val(),
            // 专业
            'major': $("#major").val(),
            // 年级
            'education': parseInt($("#education").next().find(".selected").attr("value")),
            // 电话
            'phone': $("#phone").val(),
            // 邮箱
            'email': $("#email").val(),
            // 城市
            'city': $("#city").val(),
            // 项目概述
            'overview': $("#overview textarea").val(),
            // 成员
            'members': members
        }
        for (var key in this.datas) {
            if (this.datas[key] === -1 || this.datas[key] === "") {
                delete this.datas[key];
            } else if (key === 'sendTime' || key === "education" || key === 'type' || key === 'members') {
                continue;
            } else {
                var value = $.trim(this.datas[key]);
                this.datas[key] = value;
            }
        }
    };
    e.prototype.selectType = function() {
        $(this).addClass("select");
        $(this).siblings(".radio").removeClass("select");
    }
})();