var url = location.href;
if (url.indexOf("personal") > -1) {
    type = "personal";
} else if (url.indexOf("project") > -1) {
    type = "project";
} else {
    type = "youth";
}

var lists = null;
var datasConfig = null;
var currentPage = 0;
var paramsFinal = {};
// 未审核
var status = 0;
// 已阅
var haveRead = "已阅";
getConfig();
// 默认查询第一页，一页显示20条
getListsByCond();
// 注册助手
registerHelper();
// 去掉自动提示功能
$("input").attr("autocomplete", "off");
// 获取用户量统计
getUserCount();

function getUserCount() {
    $.ajax({
        url: "/vwp/sys/getUserCount.do",
        type: "get",
        timeout: 5000,
        cache: false,
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                var userCount = data.value;
                $("#userCount").text(userCount);
            } else {
                console.log(data);
            }
        },
        error: function(data) {
            console.log("获取用户量统计：网络异常！");
        }
    });
}

var _eventHandler = {
    showSelectLists: function(e) {
        showSelectLists.call(this);
        e.stopPropagation();
    },
    selectOne: function(e) {
        closeList();
        selectOne.call(this);
        e.stopPropagation();
    },
    allSelect: function(e) {
        closeList();
        allSelect.call(this);
        e.stopPropagation();
    },
    showDetail: function(e) {
        closeList();
        showDetail.call(this);
        e.stopPropagation();
    },
    changePage: function(e) {
        closeList();
        changePage.call(this);
        e.stopPropagation();
    },
    selectOneList: function(e) {
        selectOneList.call(this);
        e.stopPropagation();
    },
    exportTable: function(e) {
        closeList();
        exportTable.call(this);
        e.stopPropagation();
    }
};

function closeList() {
    // 关闭所有下拉列表
    $(".wrapper.list .select").addClass("hide");
}

$("body").click(function() {
    // 关闭所有下拉列表
    $(".wrapper.list .select").addClass("hide");
});

function bindEvent() {
    $(".wrapper.list").find("[data-handler]").map(function(e) {
        $(this).off($(this).data("event")).on($(this).data("event"), _eventHandler[$(this).data("handler")]);
    });
}
// 上一页、下一页隐藏还是显示
function showOrHideChangePage(data) {
    if ($("#previous").data("page-num") !== data.value.currentPage) {
        $("#previous").removeClass("hide");
    } else {
        $("#previous").addClass("hide");
    }
    if ($("#next").data("page-num") !== data.value.currentPage) {
        $("#next").removeClass("hide");
    } else {
        $("#next").addClass("hide");
    }
}
// 上一页、下一页
function changePage() {
    var pageNum = $(this).data("page-num");
    getListsByCond({
        currentPage: pageNum,
    });
}

// 获取配置文件
function getConfig() {
    $.ajax({
        url: "/manger/config/config.json",
        cache: false,
        type: 'GET',
        timeout: 2000,
        async:false,
        success: function(data) {
            datasConfig = data;
        },
        error: function(data) {
            new Toast({ context: $('body'), message: '网络异常!', time: 2000, top: 500 }).show();
            return;
        }
    });
}

// 注册助手
function registerHelper() {
    //手机、邮箱默认隐藏删除按钮
    Handlebars.registerHelper('status', function(status) {
        if (status === 1) {
            return "have-read";
        }
    });
}
// 获取列表
function getLists(params) {
    var typeTemp = type;
    if (type === "youth") {
        typeTemp = "entrepreneurial";
    }
    $.ajax({
        url: "/vwp/" + typeTemp + "/search.do",
        type: "get",
        cache: false,
        timeout: 5000,
        data: params,
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                lists = data.value.dataList;
                for (var i = 0; i < lists.length; i++) {
                    var list = lists[i];
                    for (var key in datasConfig) {
                        // 获取约定字段的编号
                        var num = list[key];
                        // 从配置文件中读取编号对应的值
                        list[key] = datasConfig[key][num];
                    }
                }
                loadTable();
                setFooter(data);
                $("img.all-select").removeClass("selected");
                $("#hasSelected").text(0);
                bindEvent();
            } else {
                new Toast({
                    context: $('body'),
                    message: data.errValue,
                    time: 2000,
                    top: 500,
                    callback: function() {
                        window.location.href = "/manger/html/login.html";
                    }
                }).show();
            }

        },
        error: function(data) {
            new Toast({ context: $('body'), message: '网络异常!', time: 2000, top: 500 }).show();
            return;
        }
    });
}
// 设置底部
function setFooter(data) {
    $("#total").text(data.value.totalRecord);
    $("#currentPage").text(data.value.currentPage);
    $("#totalPage").text(data.value.totalPage);
    $("#previous").data("page-num", data.value.previous);
    $("#next").data("page-num", data.value.next);
    showOrHideChangePage(data);
    if (data.value.totalPage === 0) {
        $("#currentPage").text(0);
        $("#next").addClass("hide");
    }

}

// 添加表格
function loadTable() {
    var listTemplate = Handlebars.compile($("#list-template").html());
    $('table').empty().append(listTemplate(lists));
}
// 全选
function allSelect() {
    $("img.all-select").toggleClass("selected");
    if ($("img.all-select").hasClass("selected")) {
        $("img.all-select").attr("src", "/manger/img/select.png");
        $("table .select img.one-select").addClass("selected");
        $("table .select img.one-select").attr("src", "/manger/img/select.png");
    } else {
        $("img.all-select").attr("src", "/manger/img/un_select.png");
        $("table .select img.one-select").removeClass("selected");
        $("table .select img.one-select").attr("src", "/manger/img/un_select.png");
    }
    $("#hasSelected").text($("table .select img.one-select.selected").length);
}
// 选择一个
function selectOne() {
    // 控制一个样式
    $(this).find("img").toggleClass("selected");
    if ($(this).find("img").hasClass("selected")) {
        $(this).find("img").attr("src", "/manger/img/select.png");
    } else {
        $(this).find("img").attr("src", "/manger/img/un_select.png");
    }
    // 控制全选样式
    var totalLen = $("table .select img.one-select").length;
    var selectLen = $("table .select img.one-select.selected").length;
    if (totalLen !== 0 && (totalLen === selectLen)) {
        $("img.all-select").addClass("selected");
        $("img.all-select").attr("src", "/manger/img/select.png");
    } else {
        $("img.all-select").removeClass("selected");
        $("img.all-select").attr("src", "/manger/img/un_select.png");
    }
    // 控制总数
    $("#hasSelected").text($("table .select img.one-select.selected").length);
}
// 根据条件筛选列表
function getListsByCond(paramsTemp) {
    var name = $.trim($("#search").val()).indexOf("学校") > -1 ? "" : $.trim($("#search").val());
    params = {
        name: name,
        // 报名开始时间
        startTime: $("#startTime").val() === "请选择起始时间" ? "" : $("#startTime").val(),
        // 报名结束时间
        endTime: $("#endTime").val() === "请选择终止时间" ? "" : $("#endTime").val(),
        // 性别
        sex: $("#sex").length > 0 ? parseInt($("#sex").parent().find(".selected").attr("value")) : -1,
        // 年级
        education: $("#education").length > 0 ? parseInt($("#education").parent().find(".selected").attr("value")) : -1,
        // 分页大小
        pageSize: $("#pageSize").length > 0 ? parseInt($("#pageSize").parent().find(".selected").text()) : -1,
        // 当前第几页
        currentPage: 1
    };
    if (paramsTemp && params.currentPage) {
        // 当前第几页
        params.currentPage = paramsTemp.currentPage;
    }
    for (var key in params) {
        if (params[key] === undefined || params[key] === -1 || params[key] === "") {
            delete params[key];
        }
    }
    getLists(params);
}

// 导出报名表
function exportTable() {
    var typeTemp = type;
    if (type === "youth") {
        typeTemp = "entrepreneurial";
    }
    var idStr = "";
    var $container = $("table .select img.one-select.selected");
    if ($container.length === 0) {
        new Toast({ context: $('body'), message: '至少选择一条信息!', time: 2000, top: 500 }).show();
        return;
    } else {
        $container.each(function(index, element) {
            var id = $(element).data("id");
            idStr = idStr + id;
            if (index !== $container.length - 1) {
                idStr = idStr + ",";
            }
        });
        window.open("/vwp/" + typeTemp + "/zipDownload.do?downloadIds=" + idStr);
    }
}

function showDetail() {
    $(".mask").addClass("show");
    $(".detail").addClass("show");
    $("body").addClass("stop-scroll");
    var datas = null;
    var id = $(this).data("id");
    var typeTemp = type;
    if (type === "youth") {
        typeTemp = "entrepreneurial";
    }
    $.ajax({
        url: "/vwp/" + typeTemp + "/load.do",
        type: "get",
        timeout: 5000,
        cache: false,
        data: {
            id: id
        },
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                datas = data.value;
                jQuery.get("/manger/html/" + type + "-detail.html", function(html) {
                    var template = Handlebars.compile(html);
                    $('.detail').append(template());
                    for (var key in datas) {
                        if (datas[key] === null) {
                            continue;
                        } else if (key === "id") {
                            $('#detail').data("id", datas[key]);
                            $(".detail #" + key).text(datas[key]);
                        } else if (key === "education" || key === "sex" || key === "type") {
                            var temp = datas[key];
                            var value = datasConfig[key][temp];
                            datas[key] = value;
                            $(".detail #" + key).eq(0).text(datas[key]);
                        } else if (key === "sendTime") {
                            var temp = datas[key];
                            datas[key] = "报名日期：" + temp;
                            $(".detail #" + key).text(datas[key]);
                        } else if (key === "members") {
                            setMembers(datas);
                        } else if (key === "status") {
                            status = datas[key];
                            setState(id);
                        } else if (key === "overview" || key === "reward" || key === "ranking" || key === "experience" || key === "computerSkills" || key === "evaluation") {
                            var dataTemp = datas[key].replace(/\n/g, "<br>");
                            $(".detail #" + key)[0].innerHTML = dataTemp;
                        } else {
                            $(".detail #" + key).text(datas[key]);
                        }
                    }
                });
            } else {
                new Toast({ context: $('body'), message: data.errValue, time: 2000, top: 500 }).show();
                window.location.href = "/manger/html/login.html";
            }

        },
        error: function(data) {
            new Toast({ context: $('body'), message: '网络异常!', time: 2000, top: 500 }).show();
            return;
        }
    });

}
// 设置成员值
function setMembers(datas) {
    var members = datas.members;
    for (var i = 0; i < members.length; i++) {
        var member = members[i];
        for (var j in member) {
            if (j === "education" || j === "sex") {
                var temp = member[j];
                var value = datasConfig[j][temp];
                member[j] = value;
            }
            $(".members tr").find("#" + j + i).text(member[j]);
        }
    }
}

function closeDetail() {
    $(".detail").empty();
    $(".detail").removeClass("show");
    $(".mask").removeClass("show");
    $("body").removeClass("stop-scroll");
}

function setState(id) {
    if (status == 1) {
        haveRead = "已阅读";
        $("#detail .status").removeClass("have-read");
        $("table").find("tr[data-id=" + id + "]").addClass("have-read");
    } else if (status == 0) {
        haveRead = "已阅";
        $("#detail .status").addClass("have-read");
        $("table").find("tr[data-id=" + id + "]").removeClass("have-read");
    }
    $("#detail .status").text(haveRead);
}

function changeState() {
    var id = $("#detail").data("id");
    if (status == 0) {
        status = 1;
    } else if (status == 1) {
        status = 0;
    }
    var typeTemp = type;
    if (type === "youth") {
        typeTemp = "entrepreneurial";
    }
    $.ajax({
        url: "/vwp/" + typeTemp + "/modifyExamineState.do",
        type: "post",
        timeout: 5000,
        cache: false,
        data: {
            id: id,
            state: Number(status)
        },
        dataType: "json",
        success: function(data) {
            if (data.result === "success") {
                setState(id);
            } else {
                new Toast({ context: $('body'), message: data.errValue, time: 2000, top: 500 }).show();
                return;
            }
        },
        error: function(data) {
            new Toast({ context: $('body'), message: '网络异常!', time: 2000, top: 500 }).show();
            return;
        }
    });
}

// 显示下拉列表
function showSelectLists() {
    $(".wrapper.list ul.select").addClass("hide");
    $(this).next().removeClass("hide");
    var next = $(this).next();
    if (next.hasClass("page-number")) {
        next[0].scrollIntoView();
    }
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
    getListsByCond();
}