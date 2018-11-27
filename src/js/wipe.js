/*
author: zsp885269
datta:  2018-11-16
email:  2320419845@qq.com
 */
function Wipe(obj){
	this.conID = obj.id;
	this.color = obj.color || "#666";
	this.radius = obj.radius;
	this.coverType = obj.coverType;
	this.backImgUrl = obj.backImgUrl;
	this.width = obj.width;
	this.height = obj.height;
	this.cas = document.getElementById(this.conID);
	this.context = cas.getContext("2d");
	this._w = this.width;
	this._h = this.height;
	this.raduis = this.radius;	//涂抹的半径
	this.moveX = this.moveX;
	this.moveY = this.moveY;
	this.isMouseDown = false;//表示鼠标的状态，是否按下，默认为按下false，按下true
	this.callback = obj.callback;
	this.transpercent = obj.transpercent;//用户定义的百分比
	this.wipetext = obj.wipetext;//用户自定义文字
	this.drawMask();
	this.addEvent();
}
//生成画布上的遮罩，默认为颜色#666
Wipe.prototype.drawMask=function(){
	if (this.coverType === "color") {
		this.context.fillStyle = this.color;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}else if(this.coverType === "images"){
		var img1 = new Image();
		var that = this;
		img1.src = that.backImgUrl;
		img1.onload = function(){
			that.context.drawImage(img1,0,0,img1.width,img1.height,0,0,that._w,that._h);
			that.context.globalCompositeOperation = 'destination-out';
			//自定义文字
			that.context.font = '24px "微软雅黑"';
			that.context.fillText(that.wipetext, that._w/2 - 64, that._h/2 + 4);
		};
		
	}
};
//drawT画点和画线函数
//参数：
//如果只有两个参数,函数功能画圆,moveX,moveY即是圆的中心坐标
//如果传递四个参数,函数功能画线,moveX,moveY作为开始坐标,x2,y2为结束坐标
Wipe.prototype.drawT = function(moveX,moveY,x2,y2){
	// console.log("传递的实参个数"+arguments.length);
	if(arguments.length === 2){
		//画点
		this.context.save();
		this.context.beginPath();
		this.context.arc(moveX,moveY,this.raduis,0,2*Math.PI);
		this.context.strokeStyle = "red";
		this.context.fill();
		this.context.restore();
	}else if(arguments.length === 4){
		//画线
		this.context.save();
		this.context.lineCap = "round";
		this.context.lineWidth = this.raduis*2;
		this.context.beginPath();
		this.context.moveTo(moveX,moveY);
		this.context.lineTo(x2,y2);
		this.context.stroke();
		this.context.restore();	
	}else{
		return false;
	}
};
//清除画布
Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
};
//获取透明点占整个画布的百分比
Wipe.prototype.getTransparencyPercent = function(){
	var t = 0;
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	for (var i = 0; i < imgData.data.length; i+=4) {
		var a = imgData.data[i + 3];
		if (a === 0) {
			t++;
		}
	}
	this.percent = t/(this._w * this._h) * 100;
	console.log("透明点的个数：" + t);
	console.log("占总面积" + Math.round(this.percent) + "%");
	// return ((t / (_w * _h) )*100).toFixed(2);  //截取小数点两位
	return Math.round(this.percent);
};
Wipe.prototype.addEvent = function(){
	//device保存设备类型，如果是移动端则为true，PC端为false
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	var clickEvtName = this.device ? "touchstart" : "mousedown";
	var moveEvtName = this.device ? "touchmove" : "mousemove";
	var endEvtName = this.device ? "touchend" : "mouseup";
	var that = this;

	this.cas.addEventListener(clickEvtName,function(evt){
	var sTop = document.documentElement.scrollTop || document.body.scrollTop;
	var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		// console.log("ok");
		that.isMouseDown = true;
		var event = evt || window.event;
		//获取鼠标咋视口的坐标，传递参数打drawPoint
		that.moveX = that.device ? event.touches[0].clientX-getAllLeft(this)+sLeft : event.clientX-getAllLeft(this)+sLeft;
		that.moveY = that.device ? event.touches[0].clientY-getAllTop(this)+sTop : event.clientY-getAllTop(this)+sTop;
		that.drawT(that.moveX,that.moveY);
	},false);
	this.cas.addEventListener(moveEvtName,function(evt){
	var sTop = document.documentElement.scrollTop || document.body.scrollTop;
	var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		//判断，当isMouseDown为true时，才执行下面的操作
		if (!that.isMouseDown) {
			return false;
		}else{
			var event = evt || window.event;
			event.preventDefault();
			var x2 = that.device ? event.touches[0].clientX-getAllLeft(this)+sLeft : event.clientX-getAllLeft(this)+sLeft ;
			var y2 = that.device ? event.touches[0].clientY-getAllTop(this)+sTop : event.clientY-getAllTop(this)+sTop;
			that.drawT(that.moveX,that.moveY,x2,y2);
			//每一次的结束点变成下一次划线的开始点
			that.moveX = x2;
			that.moveY = y2;
		}
	},false);
	this.cas.addEventListener(endEvtName,function(evt){
		//还原isMouseDown 为false
		that.isMouseDown = false;
		// console.log( that.transpercent );
		var percent = setTimeout(function(){that.getTransparencyPercent();},1000);
		console.log(that.getTransparencyPercent());
		//调用同名的全局函数
		that.callback.call(null,percent);
		if( that.getTransparencyPercent() > that.transpercent){
			alert("超过了"+ that.transpercent +"%的面积");
			that.clearRect();
		}	
	},false);
};
// 封装一个getAllLeft()函数,找到元素所有水平方向的偏移
function getAllLeft(element){
	var allLeft = 0;
	while(element){
		allLeft += element.offsetLeft;
		element = element.offsetParent;
	}
	return allLeft;
}
function getAllTop(element){
	var allTop = 0;
	while(element){
		allTop += element.offsetTop;
		element = element.offsetParent;
	}
	// console.log(allTop);
	return allTop;
}