var canvas = document.getElementById('cas');
var context = canvas.getContext("2d");
var _w = cas.width,_h = cas.height;
var raduis = 20;	//涂抹的半径
var moveX;
var moveY;
var isMouseDown = false;//表示鼠标的状态，是否按下，默认为按下false，按下true

//生成画布上的遮罩，默认颜色#666
function drawMask(context){
	context.fillStyle = "rgba(122,122,122,1)";
	//画一个矩形区域，前两个参数为坐标，后两个参数为宽高
	context.fillRect(0,0,375,667);
	context.globalCompositeOperation ="destination-out";
}
function drawPoint(context,left,top){
	context.save();
	context.beginPath();
	context.arc(left,top,raduis,0,2*Math.PI);
	context.strokeStyle = "red";
	context.fill();
	context.restore();
}
function drawLine(context,moveX,moveY,x2,y2){
	context.save();
	context.beginPath();
	context.lineWidth = raduis*2;
	context.moveTo(moveX,moveY);
	context.lineTo(x2,y2);
	context.stroke();
	context.restore();
}
//在canvas画布上监听在自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标，传递参数到drawPoint
	moveX = event.clientX;
	moveY = event.clientY;
	drawPoint(context,moveX,moveY);
},false);
//增加监听"mousemove",调用draePoint函数
cas.addEventListener("mousemove",fn1,false);
function fn1(evt){
	if (isMouseDown) {
		var event = evt || window.event;
		//获取鼠标在视口的坐标，传递参数到drawPoint
		x2 = event.clientX;
		y2 = event.clientY;
		drawLine(context,moveX,moveY,x2,y2);
		moveX = x2;
		moveY = y2;
	}
}
cas.addEventListener("mouseup",function(){
	getTransparencyPercent(context);
	},false);
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