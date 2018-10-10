/**
 * 第一种：
 * ajax异步请求下载文件
 * 使用方法
downloadBlob({
	idName: "excel", // 下载样式
	servceUrl : "/innocraft-rest/manage/order/exportExcelOrder", // 接口
	data : $excelForm.serialize(), // 参数
	fileName : "华夏匠人--订单管理统计表.xls" // 文件名
});
*/


// 下载
function downloadPic(dataURL,fileName){
	var link = document.createElement('a');
	link.addEventListener('click', function() {
	    link.href = dataURL;
	    link.download = fileName; // 名称修改
	}, false);
	
	document.body.appendChild(link);
	link.click();
    document.body.removeChild(link);
};
	   
//直接读成blob文件对象
function downloadBlob(options) {
	if(!options){
		console.error("请传入参数");
		return false;
	}
	
	// 判断按钮状态
	var $loadingButtons;
	if(options.idName){
		$loadingButtons = document.getElementById(options.idName);
		if ($loadingButtons.classList.contains("loading-button")) {
			return;
		}
		$loadingButtons.classList.add("loading-button");
	}
	
	var xmlhttp;
	if(window.XMLHttpRequest){
	  	xmlhttp=new XMLHttpRequest();// code for IE7+, Firefox, Chrome, Opera, Safari
	}else{
	  	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");// code for IE6, IE5
	}
	xmlhttp.open('POST', options.servceUrl, true);
	
	//监听进度事件
	xmlhttp.addEventListener("progress", function (evt) {
		if (evt.lengthComputable) {
			var percentComplete = evt.loaded / evt.total;
			console.log(percentComplete);
			//$("#progressing").html((percentComplete * 100) + "%");
		}
	}, false);
            
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");// form表单请求
	xmlhttp.responseType = 'blob'; // 二进制数据
	xmlhttp.onload = function () {
		if (this.status == 200) {
			var content = this.response;

			// 下载方法
			dataURL = URL.createObjectURL(content);//从 blob 创建一个新的 URL 对象。
			//downloadPic(dataURL,options.fileName);

			if(typeof window.navigator.msSaveBlob !== 'undefined') {

			// IE version
			var blob = new Blob([content], { type: 'application/force-download' });
			window.navigator.msSaveBlob(blob, options.fileName);
		    }else{

			downloadPic(dataURL,options.fileName);
		    }

		}
     	
     	// 去掉加载样式
   		if(options.idName){
   			$loadingButtons.classList.remove("loading-button");
   		}
	};
	
	xmlhttp.send(options.data);
};

/**
 * 第二种：
 * form表单文件下载
 *
 * excel下载
 * param {object} postData 数据  例如：{name: "haha",age:5}
 * param {object} action 发送接口
 */
function excelDownload(postData, action){
	var $excelForm = null;
	if(!$excelForm){
		$excelForm = $("<form method='post' style="display:none" ></form>");
		$("body").append($excelForm);
	}else{
		$excelForm.empty(); // 清空
	}
	// 需进行登录验证的action地址
	var  html = "";
	$excelForm.attr("action", action);
	for(var keyName in postData){
		html = html + "<input type='hidden' name='"+ keyName +"' value='"+ postData[keyName] +"'/>";
	};
	$excelForm.append(html);
    $excelForm.submit();
};
