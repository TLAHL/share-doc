// 去掉自动提示功能
$("input").attr("autocomplete", "off");

function login() {
    var userName = $("#userName").val(),
        passWord = $("#passWord").val();
    $.ajax({
        url: "/vwp/manage/login.do",
        type: "post",
        timeout: 5000,
        contentType: "application/json",
        data: JSON.stringify({
            "userName": userName,
            "passWord": passWord
        }),
        dataType: "json",
        success: function(data) {
            if (data.result === "error") {
                $(".error").addClass("show");
            } else {
                window.location.href = "youth-list.html";
            }
        },
        error: function(data) {
            new Toast({ context: $('body'), message: '网络异常!', time: 2000, top: 500 }).show();
            return;
        }
    });
}

function hideErrorTip() {
    $(".error").removeClass("show");
}

$("body").bind("keyup", function(e) {
    if (e.keyCode === 13) {
        login();
    }
});
