# uploadfile
基于plupload封装的上传文件插件
需要调用jQuery和plupload
支持H5的浏览器相对比较完美，IE89采用silverlight方式上传，会报插件提示，做了对象重新实例化处理，忽略插件提示即可！
![image](http://cdn.attach.qdfuns.com/notes/pics/201706/29/141154j9ifzlfnguf77luc.png)

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
