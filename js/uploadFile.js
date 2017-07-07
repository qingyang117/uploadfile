/**
 * 上传文件
 * 备注：需要引用jquery；上传样式存放在uploadfile.css中
 * 		绑定上传事件的对象必需是jquery对象；
 *
 * @param options配置参数，不传或传空值时取默认值：
 * @param options.path {string} 服务器端接收和处理上传文件的脚本地址
 * @param options.maxSize {string} 允许上传的最大文件，默认100MB
 * @param options.allowFileType {string} 允许上传的文件类型,各类型用,号隔开，默认"exe,zip,rar,gif,jpeg,jpg,png,avi,mp3,txt,swf,rm,3gp,mp4,wma,wav,rmvb,ram,psd," +
 	"pdf,doc,mdb,xls,ppt,docx,pptx,txt,wps,iso,wmv,flv,fla,swf"
 * @param options.allowFileNum {number}允许上传的文件数量，默认为1
 * @param fun {function} 为队列上传成功后的回调，带回的参数有filesList（本队上传队列成功的文件列表）,obj（绑定上传事件的对象）,uploader
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var uploadFile = function (options, fun, obj) {
        //插件代码
    	options = jQuery.extend({},{
		//可在组件中配置上传处理地址，以便整个项目共用
    		path : "http://***/upload",
    		maxSize: "100mb",
    		allowFileType:"exe,zip,rar,gif,jpeg,jpg,png,avi,mp3,txt,swf,rm,3gp,mp4,wma,wav,rmvb,ram,psd," +
    				"pdf,doc,mdb,xls,ppt,docx,pptx,txt,wps,iso,wmv,flv,fla,swf",
    		allowFileNum : 1
    	},options);
		//内置转化文件大小方法
    	var getSize=function(size){
    		var str;
    		if(size<1024){str=size+"byte"}
    		else if(size>1024&&size<1048576){str=(size/1024).toFixed(2)+"KB"}
    		else if(size>1048576&&size<1073741824){str=(size/1048576).toFixed(2)+"MB"}
    		else if(size>1073741824&&size<1099511627776){str=(size/1073741824).toFixed(2)+"GB"}
    		else{str="超大文件"}
    		return str;
    	};
		//内置判断低版本IE方法
		var getBrowerIE=(function(){
			var userAgent = navigator.userAgent;
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1){
				if( fIEVersion==8){
					return fIEVersion;
				}else if(fIEVersion==9){
					return fIEVersion;
				}else{
					return false;
				}
			}
		})();
		var filesList=[];
    	var uploader = new plupload.Uploader({
			runtimes : 'html5,flash,silverlight',
			browse_button : obj,
			file_data_name : "file",
			url : options.path,
			multi_selection : (options.allowFileNum==1?false:true),
			flash_swf_url : basePath+'comm/js/JCrop/js/Moxie.swf',
			silverlight_xap_url : basePath+'comm/js/JCrop/js/Moxie.xap',
			
			filters : {
				max_file_size : options.maxSize,
				mime_types: [
					{title : "uploadfiles", extensions : options.allowFileType}
				]
			},
		
			init: {
				FilesAdded: function(uploader, files) {
					if(uploader.allowFileNum===undefined){
						uploader.allowFileNum=options.allowFileNum;
					}
					if(files.length>uploader.allowFileNum){
						$.each(files,function(){
							uploader.files.pop();
						})
						alert("超过了允许上传的文件数量！");
						return false;
					}
					if($("#uploadfilepanel").length==0){
						$("body").append("<div id='uploadfilepanel'><ul class='modalpanel'></ul></div>").css("overflow","hidden");
					}
					if(getBrowerIE==8){
						$("#uploadfilepanel .modalpanel").css("margin","-200px 0 0 -300px");
					}
					//console.log(uploader.id+"下还可以上传"+uploader.allowFileNum);
					var str='',size=0,num=files.length;
					for(i=0;i<num;i++){
						str+="<li id='"+files[i].id+"' class='filelist'><span class='title'>"+files[i].name+"</span><span class='size'>"
							+getSize(files[i].size)+"</span><span class='percent'>0%</span><img class='overico' style='display:none'"
							+" src='/wukong-web/comm/images/success.png' /><div class='progress'>"+
							"<span class='complete'></span></div></li>";
					}
					uploader.start();
					$("#uploadfilepanel").find("ul").append(str);
				},
				
				UploadProgress: function(uploader, file) {
					$("#"+file.id).find(".percent").text(file.percent+"%");
					$("#"+file.id).find(".complete").css("width",file.percent+"%");
				},
				
				FileUploaded: function(uploader, file, res) {
					var info = JSON.parse(res.response);
					uploader.allowFileNum--;
					//console.log(uploader.id+"下还可以上传"+uploader.allowFileNum);
					$("#"+file.id).find(".progress").fadeOut();
					$("#"+file.id).find(".percent").hide();
					setTimeout(function(){
						$("#"+file.id).find(".overico").fadeIn();
					},200);
					info.data.filePath=options.getPath+info.data.filePath;
					info.data.file=file;
					filesList.push(info);
				},
				UploadComplete:function(uploader,files){
					setTimeout(function(){
						$("#uploadfilepanel").fadeOut();
					},500);
					setTimeout(function(){
						$("#uploadfilepanel").remove();
					},800);
					if(fun){
						fun(filesList,obj,uploader);
					}
					//为ie89重新实例化
					var allowNewNum=uploader.allowFileNum;
					if(getBrowerIE==8||getBrowerIE==9){
						uploader.destroy();
						$(obj).uploadFile(jQuery.extend({},options,{allowFileNum:allowNewNum}),
							fun
						);
					}
				},
		
				Error: function(uploader, err) {
					var failMess='';
					switch (err.code){
						case -600:
							failMess="文件太大，不能超过"+options.maxSize;
							break;
						case -601:
							failMess="文件类型不符，只能上传"+options.allowFileType+"文件";
							break;
						default:
							failMess="出错了，请稍后再试！";
					}
					var str="<li id='"+err.file.id+"' class='filelist'><span class='title'>"+err.file.name+"</span><span class='size'>"
						+getSize(err.file.size)+"</span><img class='overico' src='/wukong-web/comm/images/fail.png' /><div class='failmess'>"+
						failMess+"</div></li>";
					if($("#uploadfilepanel").length==0){
						$("body").append("<div id='uploadfilepanel'><ul class='modalpanel'></ul></div>").css("overflow","hidden");
					}
					$("#uploadfilepanel").find("ul").append(str);
					setTimeout(function(){
						if($("#uploadfilepanel").find(".progress").length==0){
							setTimeout(function(){
								$("#uploadfilepanel").fadeOut();
							},500);
							setTimeout(function(){
								$("#uploadfilepanel").remove();
							},800);
						}
					},1500)
				}
			}
		});
    	uploader.init();
    }
    jQuery.fn.uploadFile = function(options, fun){
    	$.each(this,function(i,obj){
    		return new uploadFile(options, fun, obj);
    	})
    };
}));
