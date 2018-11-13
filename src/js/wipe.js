var canvas = document.getElementById('cas');
var context = canvas.getContext("2d");
var _w = cas.width,_h = cas.height;
var raduis = 20;	//涂抹的半径
var moveX;
var moveY;
var isMouseDown = false;//表示鼠标的状态，是否按下，默认为按下false，按下true
//device保存设备类型，如果是移动端则为true，PC端为false
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(navigator.userAgent);
console.log(device);
var clickEvtName = device? "touchstart" : "mousedown";
var moveEvtName = device? "touchmove" : "mousemove";
var endEvtName = device? "touchend" : "mouseup";

//生成画布上的遮罩，默认颜色#666
function drawMask(context){
	context.fillStyle = "rgba(122,122,122,1)";
	//画一个矩形区域，前两个参数为坐标，后两个参数为宽高
	context.fillRect(0,0,375,667);
	context.globalCompositeOperation ="destination-out";
}
//在画布上
function drawPoint(context,left,top){
	// console.log("传递的实参个数"+arguments.length);
	context.save();
	context.beginPath();
	context.arc(left,top,raduis,0,2*Math.PI);
	context.strokeStyle = "red";
	context.fill();
	context.restore();
}
// 划线
function drawLine(context,moveX,moveY,x2,y2){
	// console.log("传递的实参个数"+arguments.length);
	context.save();
	context.beginPath();
	context.lineWidth = raduis*2;
	context.moveTo(moveX,moveY);
	context.lineTo(x2,y2);
	context.stroke();
	context.restore();
}
cas.addEventListener(clickEvtName,function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标咋视口的坐标，传递参数打drawPoint
	moveX = device ? event.touches[0].clientX : event.clientX;
	moveY = device ? event.touches[0].clientY : event.clientY;
	drawPoint(context,moveX,moveY);
},false)
cas.addEventListener(moveEvtName,function(evt){
	//判断，当isMouseDown为true时，才执行下面的操作
	if (!isMouseDown) {
		return false;
	}else{
		var event = evt || window.event;
		event.preventDefault();
		x2 = device ? event.touches[0].clientX:event.clientX;
		y2 = device ? event.touches[0].clientY:event.clientY;
		drawLine(context,moveX,moveY,x2,y2);
		//每一次的结束点变成下一次划线的开始点
		moveX = x2;
		moveY = y2;
	}
},false)
//为画布添加手势操作--手指点击响应
// cas.addEventListener("touchstart",function(evt){
// 	isMouseDown = true;
// 	var event = evt||window.event;
// 	//获取手指在视口的坐标，传递参数到drawPoint
// 	moveX = event.touches[0].clientX;
// 	moveY = event.touches[0].clientY;
// 	drawPoint(context,moveX,moveY);
// },false)
//手指移动
// cas.addEventListener("touchmove",function(evt){
// 	//判断，当isMouseDown为true时，才执行下面的操作
// 	if (!isMouseDown) {
// 		return false;
// 	}else{
// 		var event = evt || window.event;
// 		event.preventDefault();
// 		var x2 = event.touches[0].clientX;
// 		var y2 = event.touches[0].clientY;
// 		drawLine(context,moveX,moveY,x2,y2);
// 		//每一次的结束点变成下一次划线的开始点
// 		moveX = x2;
// 		moveY = y2;
// 	}
// },false)
//在canvas画布上监听在自定义事件"mousedown",调用drawPoint函数
// cas.addEventListener("mousedown",function(evt){
// 	isMouseDown = true;
// 	var event = evt || window.event;
// 	//获取鼠标在视口的坐标，传递参数到drawPoint
// 	moveX = event.clientX;
// 	moveY = event.clientY;
// 	drawPoint(context,moveX,moveY);
// },false);
//增加监听"mousemove",调用draePoint函数
// cas.addEventListener("mousemove",function(evt){
// 	if (isMouseDown) {
// 		var event = evt || window.event;
// 		//获取鼠标在视口的坐标，传递参数到drawPoint
// 		x2 = event.clientX;
// 		y2 = event.clientY;
// 		drawLine(context,moveX,moveY,x2,y2);
// 		moveX = x2;
// 		moveY = y2;
// 	}
// },false);
cas.addEventListener(endEvtName,function(evt){
	getTransparencyPercent(context);
},false);
// cas.addEventListener("mouseup",function(evt){
// 	getTransparencyPercent(context);
// },false);
function getTransparencyPercent(context){
	var num = 0;
	var imgData = context.getImageData(0,0,_w,_h);
	for(var i = 0;i < _h; i++){
		for(var j = 0;j < _w;j++){
			var a = ( (_w * i) + j) * 4+3;
			if (imgData.data[a] == 0) {
				num++;
			}
		}
	}
	isMouseDown = false;
	var tmb = num/(_w*_h)*100;
	console.log((num/(_w*_h)*100).toFixed(2) + "%");
	if (tmb > 50) {
		clearRect(context);
	}	
}
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
window.onload = function(){
	drawMask(context);
};