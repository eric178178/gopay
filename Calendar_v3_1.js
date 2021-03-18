/**
 * Calendar
 * @param   beginYear           1990
 * @param   endYear             2010
 * @param   language            0(zh_cn)|1(en_us)|2(en_en)|3(zh_tw)
 * @param   patternDelimiter    "-"
 * @param   date2StringPattern  "yyyy-MM-dd"
 * @param   string2DatePattern  "ymd"
 * @version 1.0 build 2006-04-01
 * @version 1.1 build 2006-12-17
 * @author  KimSoft (jinqinghua [at] gmail.com)
 * NOTE!    you can use it free, but keep the copyright please
 * IMPORTANT:you must include this script file inner html body elment
 */


function Calendar(beginYear, endYear, language, patternDelimiter, date2StringPattern, string2DatePattern) {
	this.beginYear = beginYear || 2010;
	this.endYear   = endYear   || 2030;
	this.language  = language  || 0;
	this.patternDelimiter = patternDelimiter     || "-";
	this.date2StringPattern = date2StringPattern || Calendar.language["date2StringPattern"][this.language].replace(/\-/g, this.patternDelimiter);
	this.string2DatePattern = string2DatePattern || Calendar.language["string2DatePattern"][this.language];

	this.dateControl = null;
	this.panel  = this.getElementById("__calendarPanel");
	this.iframe = window.frames["__calendarIframe"];
	this.form   = null;

	this.date = new Date();
	this.year = this.date.getFullYear();
	this.month = this.date.getMonth();

	this.colors = {"bg_cur_day":"#483afb","bg_over":"#EFEFEF","bg_out":"#483afb"}
};

Calendar.language = {
	"year"   : ["\u5e74", "", "", "\u5e74"],
	"months" : [["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],
                    ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
                    ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
                    ["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"]
                   ],
	"weeks"  : [["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],
                    ["Sun","Mon","Tur","Wed","Thu","Fri","Sat"],
                    ["Sun","Mon","Tur","Wed","Thu","Fri","Sat"],
                    ["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"]
		   ],
	"clear"  : ["\u6e05\u7a7a", "Clear", "Clear", "\u6e05\u7a7a"],
	"today"  : ["\u4eca\u5929", "Today", "Today", "\u4eca\u5929"],
	"close"  : ["\u5173\u95ed", "Close", "Close", "\u95dc\u9589"],
	"date2StringPattern" : ["yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd"],
	"string2DatePattern" : ["ymd","ymd", "ymd", "ymd"]
};

Calendar.prototype.draw = function() {
	calendar = this;

	var _cs = [];
	_cs[_cs.length] = '<form id="__calendarForm" name="__calendarForm" method="post">';
	_cs[_cs.length] = '<table id="__calendarTable" width="100%" border="0" cellpadding="3" cellspacing="1" align="center">';
	_cs[_cs.length] = ' <tr>';
	_cs[_cs.length] = '  <th><input class="l" name="goPrevMonthButton" type="button" id="goPrevMonthButton" value="&lt;" \/><\/th>';
	_cs[_cs.length] = '  <th colspan="5"><select class="year" name="yearSelect" id="yearSelect"><\/select><select class="month" name="monthSelect" id="monthSelect"><\/select><\/th>';
	_cs[_cs.length] = '  <th><input class="r" name="goNextMonthButton" type="button" id="goNextMonthButton" value="&gt;" \/><\/th>';
	_cs[_cs.length] = ' <\/tr>';
	_cs[_cs.length] = ' <tr>';
	for(var i = 0; i < 7; i++) {
		_cs[_cs.length] = '<th class="theader">';
		_cs[_cs.length] = Calendar.language["weeks"][this.language][i];
		_cs[_cs.length] = '<\/th>';
	}
	_cs[_cs.length] = '<\/tr>';
	for(var i = 0; i < 6; i++){
		_cs[_cs.length] = '<tr align="center">';
		for(var j = 0; j < 7; j++) {
			switch (j) {
				case 0: _cs[_cs.length] = '<td class="sun">&nbsp;<\/td>'; break;
				case 6: _cs[_cs.length] = '<td class="sat">&nbsp;<\/td>'; break;
				default:_cs[_cs.length] = '<td class="normal">&nbsp;<\/td>'; break;
			}
		}
		_cs[_cs.length] = '<\/tr>';
	}
	_cs[_cs.length] = ' <tr>';
	_cs[_cs.length] = '  <th colspan="3"><input type="button" class="b" name="selectTodayButton" id="selectTodayButton" \/><\/th>';
	_cs[_cs.length] = '  <th colspan="4"><input type="button" class="b" name="closeButton" id="closeButton" \/><\/th>';
	_cs[_cs.length] = ' <\/tr>';
	_cs[_cs.length] = '<\/table>';
	_cs[_cs.length] = '<\/form>';

	this.iframe.document.body.innerHTML = _cs.join("");
	this.form = this.iframe.document.forms["__calendarForm"];

	//this.form.clearButton.value = Calendar.language["clear"][this.language];
	this.form.selectTodayButton.value = Calendar.language["today"][this.language];
	this.form.closeButton.value = Calendar.language["close"][this.language];

	this.form.goPrevMonthButton.onclick = function () {calendar.goPrevMonth(this);}
	this.form.goNextMonthButton.onclick = function () {calendar.goNextMonth(this);}
	this.form.yearSelect.onchange = function () {calendar.update(this);}
	this.form.monthSelect.onchange = function () {calendar.update(this);}

	//this.form.clearButton.onclick = function () {calendar.dateControl.value = "";calendar.hide();}
	this.form.closeButton.onclick = function () {calendar.hide();}
	this.form.selectTodayButton.onclick = function () {
		var today = new Date();
		calendar.date = today;
		calendar.year = today.getFullYear();
		calendar.month = today.getMonth();
		calendar.dateControl.value = today.format(calendar.date2StringPattern);
		calendar.hide();
	}
};

Calendar.prototype.bindYear = function() {
	var ys = this.form.yearSelect;
	ys.length = 0;
	for (var i = this.beginYear; i <= this.endYear; i++){
		ys.options[ys.length] = new Option(i + Calendar.language["year"][this.language], i);
	}
};

Calendar.prototype.bindMonth = function() {
	var ms = this.form.monthSelect;
	ms.length = 0;
	for (var i = 0; i < 12; i++){
		ms.options[ms.length] = new Option(Calendar.language["months"][this.language][i], i);
	}
};

Calendar.prototype.goPrevMonth = function(e){
	if (this.year == this.beginYear && this.month == 0){return;}
	this.month--;
	if (this.month == -1) {
		this.year--;
		this.month = 11;
	}
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.goNextMonth = function(e){
	if (this.year == this.endYear && this.month == 11){return;}
	this.month++;
	if (this.month == 12) {
		this.year++;
		this.month = 0;
	}
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.changeSelect = function() {
	var ys = this.form.yearSelect;
	var ms = this.form.monthSelect;
	for (var i= 0; i < ys.length; i++){
		if (ys.options[i].value == this.date.getFullYear()){
			ys[i].selected = true;
			break;
		}
	}
	for (var i= 0; i < ms.length; i++){
		if (ms.options[i].value == this.date.getMonth()){
			ms[i].selected = true;
			break;
		}
	}
};

Calendar.prototype.update = function (e){
	this.year  = e.form.yearSelect.options[e.form.yearSelect.selectedIndex].value;
	this.month = e.form.monthSelect.options[e.form.monthSelect.selectedIndex].value;
	this.date = new Date(this.year, this.month, 1);
	this.changeSelect();
	this.bindData();
};

Calendar.prototype.bindData = function () {
  var calendar = this;
  var dateArray = this.getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth());
  var tds = this.getElementsByTagName("td", this.getElementById("__calendarTable", this.iframe.document));
  for(var i = 0; i < tds.length; i++) {
    tds[i].style.backgroundColor = calendar.colors["bg_over"];
    tds[i].style.color = "#000";
    tds[i].onclick = null;
    tds[i].onmouseover = null;
    tds[i].onmouseout = null;
    tds[i].innerHTML = dateArray[i] || "&nbsp;";
    if (i > dateArray.length - 1) continue;
    if (dateArray[i]){
      tds[i].onclick = function () {
        if (calendar.dateControl){
          calendar.dateControl.value = new Date(calendar.date.getFullYear(),calendar.date.getMonth(),this.innerHTML).format(calendar.date2StringPattern);
        }
        calendar.hide();
      }
      tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];this.style.color = '#fff';}
      tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_over"];this.style.color = '#000';}
      var today = new Date();
      if (today.getFullYear() == calendar.date.getFullYear()) {
        if (today.getMonth() == calendar.date.getMonth()) {
          if (today.getDate() == dateArray[i]) {
            tds[i].style.backgroundColor = calendar.colors["bg_cur_day"];
            tds[i].style.color = '#fff';
            tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];}
            tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_cur_day"];}
          }
        }
      }
    }//end if
  }//end for
};

Calendar.prototype.getMonthViewDateArray = function (y, m) {
	var dateArray = new Array(42);
	var dayOfFirstDate = new Date(y, m, 1).getDay();
	var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
	for (var i = 0; i < dateCountOfMonth; i++) {
		dateArray[i + dayOfFirstDate] = i + 1;
	}
	return dateArray;
};

Calendar.prototype.show = function (dateControl, popuControl) {
	if (this.panel.style.visibility == "visible") {
		this.panel.style.visibility = "hidden";
	}
	if (!dateControl){
		throw new Error("arguments[0] is necessary!")
	}
	this.dateControl = dateControl;
	popuControl = popuControl || dateControl;

	this.draw();
	this.bindYear();
	this.bindMonth();
	if (dateControl.value.length > 0){
		this.date  = new Date(dateControl.value.toDate(this.patternDelimiter, this.string2DatePattern));
		this.year  = this.date.getFullYear();
		this.month = this.date.getMonth();
	}
	this.changeSelect();
	this.bindData();

	var xy = this.getAbsPoint(popuControl);
	this.panel.style.left = xy.x + "px";
	this.panel.style.top = (xy.y + dateControl.offsetHeight) + "px";
	this.panel.style.display = "inline";
};

Calendar.prototype.hide = function() {
	this.panel.style.display = "none";
};

Calendar.prototype.getElementById = function(id, object){
	object = object || document;
	return document.getElementById ? object.getElementById(id) : document.all(id);
};

Calendar.prototype.getElementsByTagName = function(tagName, object){
	object = object || document;
	return document.getElementsByTagName ? object.getElementsByTagName(tagName) : document.all.tags(tagName);
};

Calendar.prototype.getAbsPoint = function (e){
	var x = e.offsetLeft + 2;
	var y = e.offsetTop;
	while(e = e.offsetParent){
		x += e.offsetLeft;
		y += e.offsetTop;
	}
	return {"x": x, "y": y};
};

/**
 * @param   d the delimiter
 * @param   p the pattern of your date
 * @author  meizz
 * @author  kimsoft add w+ pattern
 */
Date.prototype.format = function(style) {
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(),      //day
		"h+" : this.getHours(),     //hour
		"m+" : this.getMinutes(),   //minute
		"s+" : this.getSeconds(),   //second
		"w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
		"q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
		"S"  : this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(style)) {
		style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o){
		if (new RegExp("("+ k +")").test(style)){
			style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return style;
};

/**
 * @param d the delimiter
 * @param p the pattern of your date
 * @rebuilder kimsoft
 * @version build 2006.12.15
 */
String.prototype.toDate = function(delimiter, pattern) {
	delimiter = delimiter || "-";
	pattern = pattern || "ymd";
	var a = this.split(delimiter);
	var y = parseInt(a[pattern.indexOf("y")], 10);
	//remember to change this next century ;)
	if(y.toString().length <= 2) y += 2000;
	if(isNaN(y)) y = new Date().getFullYear();
	var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
	var d = parseInt(a[pattern.indexOf("d")], 10);
	if(isNaN(d)) d = 1;
	return new Date(y, m, d);
};

document.writeln('<div id="__calendarPanel" style="position:absolute;display:none;z-index:9999;background-color:#FFFFFF;border:1px solid #dfdfdf;width:250px;height:285px;border-radius:1px;box-shadow: 0 0 3px #1e1d1d;">');
document.writeln('<iframe name="__calendarIframe" id="__calendarIframe" width="100%" height="100%" scrolling="no" frameborder="0" style="margin:0px;"><\/iframe>');
var __ci = window.frames['__calendarIframe'];
__ci.document.writeln('<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN" "http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd">');
__ci.document.writeln('<html xmlns="http:\/\/www.w3.org\/1999\/xhtml">');
__ci.document.writeln('<head>');
__ci.document.writeln('<meta http-equiv="Content-Type" content="text\/html; charset=utf-8" \/>');
__ci.document.writeln('<title>Web Calendar(UTF-8) Written By KimSoft<\/title>');
__ci.document.writeln('<style type="text\/css">');
__ci.document.writeln('<!--');
__ci.document.writeln('body {font-size:12px;margin:0px;text-align:center;}');
__ci.document.writeln('form {margin:0px;}');
__ci.document.writeln('select {font-size:12px;background-color:#EFEFEF;}');
__ci.document.writeln('table {border:0px solid #CCCCCC;background-color:#FFFFFF}');
__ci.document.writeln('th {font-size:12px;font-weight:normal;background-color:#FFFFFF;}');
__ci.document.writeln('th.theader {font-weight:normal;background-color:#DBDBDB;color:#000;width:24px;}');
__ci.document.writeln('select.year {width:70px;margin-right: 10px;}');
__ci.document.writeln('select.month {width:60px;}');
__ci.document.writeln('td {font-size:12px;text-align:center;}');
__ci.document.writeln('td.sat {background-color:#EFEFEF;8px;}');
__ci.document.writeln('td.sun {background-color:#EFEFEF;8px;}');
__ci.document.writeln('td.normal {background-color:#EFEFEF;padding:8px;height:17px;}');
__ci.document.writeln('input.l {border: none;border-radius:3px;font-weight:700;background-color:#DBDBDB;width:30px;padding: 5px 8px;}');
__ci.document.writeln('input.r {border: none;border-radius:3px;font-weight:700;background-color:#DBDBDB;width:30px;padding: 5px 8px;}');
__ci.document.writeln('input.b {border: 1px solid #CCCCCC;background-color:#EFEFEF;width:100%;height:20px;}');
__ci.document.writeln('-->');
__ci.document.writeln('<\/style>');
__ci.document.writeln('<\/head>');
__ci.document.writeln('<body>');
__ci.document.writeln('<\/body>');
__ci.document.writeln('<\/html>');
__ci.document.close();
document.writeln('<\/div>');
var calendar = new Calendar();

/**
 * 自主封装一个时间插件
 * $dom.bind('click',function(event){timePacker($(this),event)});
 * @author shuaiwu Li
 */

function timePacker(dom,e) {
    var hours = null;//存储 "时"
    var minutes = null;//存储 "分"
    var clientY = dom.offset().top + dom.height();//获取位置
    var clientX = dom.offset().left;
    var date = new Date();
    var nowHours = date.getHours();
    var nowMinutes = date.getMinutes();
    var time_hm=/^(0\d{1}|\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/; //时间正则，防止手动输入的时间不符合规范
    var inputText = dom.is("input") ? dom.val():dom.text();
    //插件容器布局
    var html = '';
    html += '<div class="timePacker">';
        html += '<div class="timePacker-hours" style="display: block;">';
            html += '<div class="timePacker-title"><span>小时</span></div>';
            html += '<div class="timePacker-content">';
                html += '<ul>';
                    var i = 0;
                    while (i < 24)
                    {
                        var text = i < 10 ? "0" + i : i;
                        html += '<li class="hoursList">'+text+'</li>';
                        i++;
                    }
                html += '</ul>';
            html +=  '</div>';
        html += '</div>';
        html += '<div class="timePacker-minutes" style="display: none;">';
            html += '<div class="timePacker-title"><span>分钟</span><span class="timePacker-back-hours" title="返回小时选择"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDItMjFUMDA6NDI6NDcrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTAyLTIxVDAwOjQ0OjEzKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTIxVDAwOjQ0OjEzKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAwYWY2ODk4LTFkNTQtNDk3MS1hMDlhLTE4ZGUzOGZjMjVlNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMGFmNjg5OC0xZDU0LTQ5NzEtYTA5YS0xOGRlMzhmYzI1ZTQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMGFmNjg5OC0xZDU0LTQ5NzEtYTA5YS0xOGRlMzhmYzI1ZTQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAwYWY2ODk4LTFkNTQtNDk3MS1hMDlhLTE4ZGUzOGZjMjVlNCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0yMVQwMDo0Mjo0NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EsymSwAAA8dJREFUSIntl0+IHEUUh79X1d3Ts7sz7GbVBEMUMYISoiiKJ9EgCILoRQQP3jxF0CjmkKDowaioAVGiZ2/+uajgQQTx4EEERS+K0aBuJphddmc2u7M9M91d9TzMzuzs9G5mB8W9+KAbql53ffXq/fpVtagqu2FmV6i7CQ6GOz5qvrXtw95DsqrH81wTYzkz7FcFkYF2/waPHzh2ebD32ebBUMIgRMTQXPGzWUdfE8M59RvgHkBEQBTvQYBS2WAt+C1kVABH4fSmtiBkrkWaZuUs5bv17mV1A1DAWLABeAc9XxxDGHVXaiS4Wr6+H6khYIIp/lz+kaWFv74px+Vr11WRIaCqiIANpBvixmyBLtC5HYI93aU2BGS+yYXVGkkz+SoKw5sHn1NVjAmwgeA1Q3QIPsK2UbUSUcaTceHi2Q867eTuIAgHoD4JgoAw7OYe3SKkEVaIGAwREYvN36k3Ft+Mo+ojIsJgoRGRQwovO5fXEf0WzNcIY9G3AHvSvM3Kav1ksrbyVBxPsSGhPnqvy/MTAxOpC7xnLacRLuwEXFhqrynnzn9/tJ10TsXx5BbQPqx/AXs05+k81Zp6XpAd5LoAXm4sPozaM2LGUAr0haWOF9XzydjgemP+QyNhL5Lxrfvag8CXl1N5ARyW5P48zRnr2xhmC6AcaV7yp5Omp50U01UAH7jq8Od7rpx9KM2S7dK7QzpkKc94z63GFt0F8GQ0w9TUxKfWmif+6VZtDGQprzu3g4hbrBBHsxy87rZ3bIkT7XZSzLcwJ8JJ4F2En7YDi4B67s1SbhwJ7jvEMlPd92qlMv22c26zU/lDlVcQjhrLIWO5QYRTQFJYJQXvuGck2FLCEKIEXF25ib37rnkyzdL3vdPBvbY8ODDCbwjPGcN+Y+WzTfBuCT8yEryW1lhLayRpjaX0F1qdBaZnwkeDiC8KufL0BagKiC5HUfiAseYlP7AJq3L7MKdQMputuYFgFGsCKjMRqw13X7vND6Fwi4hUe0DvNmavCmmacsXs/udbrSRuNC4+G0YlUKojwTOVw8NdiMDkbEi1cumOhfm5n1VN3VjTh6mAeo+qI560dPIFsP54ENq71HGnGJZHgkMzUQArENkSPk6zUlw+2OlksP5tCt29ObAhU1MVwlhxzhFFIdbEjy0vrZ0FLSh/i4NAXgADOAyb1K09sOC9Q40jy5RO6td7weN+Rfx5RWsjweOaU0cYligFEzif0Su1nu4pphRPvhFFZv5fB6NgpHuosxowWGeNGDpp/nGea3v4Nfn/F+a/sr8B7fucV1w7VxkAAAAASUVORK5CYII="/> </span></div>';
            html += '<div class="timePacker-content">';
                html += '<ul>';
                    var m = 0;
                    while (m < 60)
                    {
                        var textM = m < 10 ? "0" + m : m;
                        html += '<li class="mList">'+textM+'</li>';
                        m++;
                    }
                html += '</ul>';
            html +=  '</div>';
        html += '</div>';
    html += '</div>';
    if($(".timePacker").length > 0){
        $(".timePacker").remove();
    }
    $("body").append(html);
    $(".timePacker").css({
        position:"absolute",
        top:clientY,
        left:clientX
    });
    var _con = $(".timePacker"); // 设置目标区域,如果当前鼠标点击非此插件区域则移除插件
    $(document).mouseup(function(e){
        if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            _con.remove();
        }
    });
    //小时选择
    $(".hoursList").bind('click',function () {
        $(this).addClass("timePackerSelect").siblings().removeClass("timePackerSelect");
        hours = $(this).text();
        var timer = setTimeout(function () {
            $(".timePacker-hours").css("display","none");
            $(".timePacker-minutes").fadeIn();
            if(minutes !== null){
                var getTime = hours + ":" + minutes;
                if(time_hm.test(getTime)){
                    dom.removeClass("errorStyle");
                }
                dom.is("input") ? dom.val(getTime):dom.text(getTime);
            }
            clearTimeout(timer);
        },100);
    });
    //返回小时选择
    $(".timePacker-back-hours").bind('click',function () {
        var timer = setTimeout(function () {
            $(".timePacker-minutes").css("display","none");
            $(".timePacker-hours").fadeIn();
            clearTimeout(timer);
        },100);
    });
    //分钟选择
    $(".mList").bind('click',function () {
        $(this).addClass("timePackerSelect").siblings().removeClass("timePackerSelect");
        minutes = $(this).text();
        var timer = setTimeout(function () {
            var getTime = hours + ":" + minutes;
            if(time_hm.test(getTime)){
                dom.removeClass("errorStyle");
            }
            dom.is("input") ? dom.val(getTime):dom.text(getTime);
            clearTimeout(timer);
            _con.remove();
        },100);
    })
}
