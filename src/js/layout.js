//layout.js
//以iphone6 为基础进行缩放。
//缩放的公式为 (document.clientWidth/750)*100
//使用 orientationchange 事件来检测手机尺寸变化
!function(e,i){
	var t = e.documentElement;
	//检测浏览器是否支持orientationchange事件，不支持使用resize
	var m = "orientationchange" in window ? "orientationchange": "resize";
	//事件处理函数
	var s = function(){
		var e = t.clientWidth;
		//给html 根节点添加fontSize属性
		t.style.fontSize = (e/750)*100 + "px";
	};
	//第一次打开页面自动执行事件处理函数
	s();
	//给document或window对象添加自定义检测事件
	e.addEventListener && i.addEventListener(m,s,false);
}(document,window);
