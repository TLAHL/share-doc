function chengeContent(contentTitle,contentUrl){
	$("#layout").layout('panel','center').panel({title:contentTitle,href:contentUrl});
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function getUrlParam(url,name) {
	var search=url.substring(url.indexOf("?"));
    var reg = new RegExp("(^|&)" +  name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = search.match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function submitForm(formId){
	var $form=$("#"+formId);
	$.ajax({
		type : "POST",
		url : $form.attr("action"),
		dataType : 'json',
		data :$form.serialize(),
		success : function(data) {
			if(data.result=="success"){
				alert("保存成功");
			}else if(data.result=="error") {
				alert(data.errValue);
			}
		}
	});
}
function openDialog(id){
	$('#'+id).dialog('refresh');
	$('#'+id).dialog('open');
}
function closeDialog(id){
	$('#'+id).dialog('close');
}