var $station = $(".stations").find("li[data-index="+school+"]");
$(".stations li").removeClass("active");
$(".stations li .rect-title").addClass("hidden");
$station.addClass("active");
$station.find(".rect-title").removeClass("hidden");


function showInfo() {
    $(this).find(".trangle-up").removeClass("hide");
    $(this).find("p").removeClass("hide");
}

function hideInfo() {
    $(this).find(".trangle-up").addClass("hide");
    $(this).find("p").addClass("hide");
}

function selectStation() {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
    $(this).siblings().find(".rect-title").addClass("hidden");
    $(this).find(".rect-title").removeClass("hidden");
    var index = $(this).data("index");
    registerStation(index);
}

function baoming(url) {
    window.location.href ="/front/module/join/personal.html";
}
function registerStation(school) {
    $.ajax({
        url: "/vwp/site/register.do",
        cache: false,
        type: 'post',
        data:{
            school:school
        },
        success: function(data) {
            console.log("注册站点成功！");
        },
        error: function(data) {
            alert("网络异常！");
        }
    });
}