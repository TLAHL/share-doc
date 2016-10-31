function notice() {
	//	jumpTime = 8640000000;
	clearInterval(timer);
	$(".notice1").show();
	$(".notice-detail").show();
	$(document).mask();
}


//function enterDetail() {
//	//window.location.href="/youth/common/noticeDetail.html";
//	$(".noticeFirst").remove();
//	var maskDiv2 = $(strDiaDetail);
//	maskDiv2.appendTo($(document.body));
//}

(function() {
	$.extend($.fn, {
		mask: function(msg, maskDivClass) {
			this.unmask();
			// 参数
			var op = {
				opacity: 0.5,
				z: 1000,
				bgcolor: '#000'
			};
			var original = $(document.body);
			var position = {
				top: 0,
				left: 0
			};
			if (this[0] && this[0] !== window.document) {
				original = this;
				position = original.position();
			}
			// 创建一个 Mask 层，追加到对象中
			var maskDiv = $('<div class="maskdivgen">&nbsp;</div>');
			maskDiv.appendTo(original);


			//
			//			var strDia = "<div  class='noticeFirst' style='position:relative;height:439px;width:883px;background:#fff;margin:12.5% auto;opacity:1;z-index:999999'>" +
			//				"<div class='notice-header'>" + "<img class='notice-logo' src='/youth/img/notice_logo.png' />" +
			//				"<h1>通知公告</h1>" + "<img onclick='$(document).unmask();' class='notice-close' src='/youth/img/close.png' />" + "</div>" +
			//				"<div class='notice-content'>" + "<ul id='ulMes' style='line-height:30px;height:30px;padding-left: 0px;'>" + "</div>" +
			//				"</div>";
			//			


			//			<div class="noticeFirst" style="position:relative;height:439px;width:883px;background:#fff;margin:12.5% auto;opacity:1;z-index:999999">
			//			< div class = "noticedetail-header" >
			//				<h1>西安最近的空气质量很不错，希望同志们继续保持</h1>
			//				<img class="noticedetail-close" src="/youth/img/close.png" />
			//			</div>
			//			<div class="noticedetail-content">
			//				<h2>这真的是一个空气非常好的地方！</h2>
			//				<p>数量的房间爱上了对方就俺俩的房间里阿里加分的拉升阶段法拉克是绝对法拉时刻记得发来看送到房间爱上了对方就拉屎咖啡加拉斯看见对方拉屎咖啡就爱上的发生纠纷多拉卡设计福利卡时间得分 </p>
			//				<span>2016.05.27</span>
			//				
			//			</div>
			//		</div>






			//		    strDiaDetail = "<div class='noticeFirst' style='position:relative;height:439px;width:883px;background:#fff;margin:12.5% auto;opacity:1;z-index:999999'>"
			//			                   + "< div class = 'noticedetail-header' >"  + "<h1>西安最近的空气质量很不错，希望同志们继续保持</h1>" + "<img class='noticedetail-close' onclick='$(document).unmask();' src='/youth/img/close.png' />" +
			//			                   "</div>" + "<div class='noticedetail-content'>" + "<h2>这真的是一个空气非常好的地方！</h2>" + "<p>数量的房间爱上了对方就俺俩的房间里阿里加分的拉升阶段法拉克是绝对法拉时刻记得发来看送到房间爱上了对方就拉屎咖啡加拉斯看见对方拉屎咖啡就爱上的发生纠纷多拉卡设计福利卡时间得分 </p>"
			//			                   + "<span>2016.05.27</span>" + "</div>" + "</div>";

			//			var maskDiv1 = $(strDia);
			//			maskDiv1.appendTo($(document.body));
			//
			//			for (var i = 0; i < noticeObj.noticeMsg.length; i++) {
			//				//$("#ulMes").append("<li type = \"none\" onclick=\"window.location.href='/youth/common/noticeDetail.html'\">" +
			//				$("#ulMes").append("<li type = 'none' onclick='$(document).enterDetail()'>" +
			//					"<img class='notice-logo' src='/youth/img/gonggao2.png' />" + "<span class='announce'>" + noticeObj.noticeMsg[i].message + "</span>" + "<span class='date'>" + noticeObj.noticeMsg[i].datetime + "</span>" +
			//					"</li>");
			//			}

			var maskWidth = "100%";
			if (!maskWidth) {
				maskWidth = "100%";
			}
			var maskHeight = "100%";
			if (!maskHeight) {
				maskHeight = "100%";
			}
			maskDiv.css({
				position: 'fixed',
				top: position.top,
				left: position.left,
				'z-index': op.z,
				width: maskWidth,
				height: maskHeight,
				'background-color': op.bgcolor,
				opacity: 0
			});
			if (maskDivClass) {
				maskDiv.addClass(maskDivClass);
			}
			if (msg) {
				var msgDiv = $('<div style="position:absolute;border:#6593cf 1px solid; padding:2px;background:#ccca"><div style="line-height:24px;border:#a3bad9 1px solid;background:white;padding:2px 10px 2px 10px">' + msg + '</div></div>');
				msgDiv.appendTo(maskDiv);
				var widthspace = (maskDiv.width() - msgDiv.width());
				var heightspace = (maskDiv.height() - msgDiv.height());
				msgDiv.css({
					cursor: 'wait',
					top: (heightspace / 2 - 2),
					left: (widthspace / 2 - 2)
				});
			}
			maskDiv.fadeIn('fast', function() {
				// 淡入淡出效果
				$(this).fadeTo('slow', op.opacity);
			})
			return maskDiv;
		},
		unmask: function() {
			var original = $(document.body);
			if (this[0] && this[0] !== window.document) {
				original = $(this[0]);
			}
			original.find("> div.maskdivgen").fadeOut('fast', 0, function() {
				$(this).remove();
				$(".noticeFirst").remove();
			});
		},
		enterDetail: function() {
			$(".noticeFirst").remove();
			var maskDiv2 = $(strDiaDetail);
			maskDiv2.appendTo($(document.body));
		}
	});
})();