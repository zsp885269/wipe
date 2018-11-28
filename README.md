## ver 0.0.1 ##
### 2018-11-12 ###
PC端实现涂抹擦效果，超过50%的涂抹面积可以查看全部，涂抹颜色和背景图片手动指定
## ver 1.0.0 ##
1. 实现了对移动端的支持
2. 对函数进行了优化
## ver 2.0.0 ##
实现了面向对象方式,增加了参数配置
## ver 3.0.0 ##
### 2018-11-19 ###
1. 浏览器在滚动距离下bug修复
2. canvsas画布在有偏移和绝对定位下bug修复
3. 增加了回调函数。让用户可以自己完成后继功能

使用步骤说明：
1. 在HTML中提娜佳指定id的canvas标签。
例如：
``` 
<canvas id="cas" width="375" height="700"></canvas> ```
2. 编辑配置文件：
属性  			取值类型  		备注 
``` 
id  			字符串  		canvas标签的id 
coverType  		字符串  		取值类型"color" 或 "image" 
color  			字符串  		十六进制颜色码，或rgba()，如果不指定默认值为#666 
imgUrl  		字符串  		前面的覆盖图片 
backImgUrl  		字符串  		背景图片 
width  			字符串  		canvas宽度，必须和canvas标签中宽度一致 
height  		字符串  		canvas高度，必须和canvas标签中高度一致 
radius  		字符串  		涂抹笔的半径 
transpercent   		数值 		透明面积占整个画布的百分比，超出此数字显示全部画布 
callback 		函数 		用户自定义的回调函数名称 
 ```
例如：
``` 
var wipeConfig = {
	id:"cas",	//canvas标签的id
	coverType:"images",		//取值类型color、image
	color:"red",	//十六进制颜色码，或rgba()，如果不指定默认值为#666
	imgUrl:"src/images/front.jpg",	//前面的覆盖图
	backImgUrl:"src/images/wipe2.jpg",	//背景图片
	width:"375",	//canvas宽度，必须和canvas标签中宽度一致
	height:"700",	//canvas高度，必须和canvas标签中高度一致
	radius:"20",		//涂抹笔的半径
	transpercent:70, 	//透明面积占整个画布的百分比，超出此数字显示全部画布
	callback:wipedCallback 	//用户自定义回调函数名称
}
 ```3. 初始化wipe插件,并将上一步的配置作为参数传入例如：``` 
new Wipe(wipeConfig); ```4. 编写回调函数。用户在涂抹完成的后继操作必须写在此回调函数中。例如：``` 
function wipedCallback(percent){	if (percent > 50) {		console.log("透明面积超过60%，查看地图");	}} ``` ## ver 3.1.0 ##### 2018-11-27 ###1.  修复bug在定位与有滚动条情况下依然何以使用例如：``` // 封装一个getAllLeft()函数,找到元素所有水平方向的偏移function getAllLeft(element){	var allLeft = 0;	while(element){		allLeft += element.offsetLeft;		element = element.offsetParent;	}	return allLeft;}function getAllTop(element){	var allTop = 0;	while(element){		allTop += element.offsetTop;		element = element.offsetParent;	}	// console.log(allTop);	return allTop;} ```2.  添加了蒙版自定义文本编辑配置文件：``` 
属性  		取值类型  		备注 wipetext  	字符串/数值  	用户自定义文字 
 ```例如：``` 
var wipeConfig = {	wipetext:"今天天气很好!"	//用户自定义文字}
 ``` ``` 
//自定义文字that.context.font = '24px "微软雅黑"';that.context.fillText(that.wipetext, that._w/2 - 64, that._h/2 + 4);
 ```3.  延时判断透明区域百分比例如：``` 
var percent = setTimeout(function(){that.getTransparencyPercent();},1000);	console.log(that.getTransparencyPercent());	//调用同名的全局函数	that.callback.call(null,percent);	if( that.getTransparencyPercent() > that.transpercent){		alert("超过了"+ that.transpercent +"%的面积");		that.clearRect();	}
 ```