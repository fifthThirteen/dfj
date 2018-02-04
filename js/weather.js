 getFutureWeather={
		 cond:function(obj){//获取天气状况
			 if(typeof obj==="object"){
				 
			 }
		 }	,
}
function showCond(str){ //天气图标
	 var cond="06"
	 switch(str){
	 case '100':
	 case '201':
		 cond='01';//晴
		 break;
	/* case '100':
		 cond='02';//夜晚晴
		 break;*/
	 case '200':
	 case '202':
	 case '203':
	 case '204':
		 cond='03';//有风
		 break;
	 case '205':
	 case '206':
	 case '207':
	 case '208':
	 case '209':
	 case '210':
	 case '211':
	 case '212':
	 case '213':
		 cond='04';//大风
		 break;
	 case '403':
	 case '406':
	 case '407':
		 cond='05';//暴雪
		 break;
	 case '101':
	 case '103':
		 cond='06';//多云
		 break;
	/* case '100':
		 cond='07';//夜晚多云
		 break;*/
	 case '502':
		 cond='08';//雾霾
		 break;
	 case '500':
	 case '501':
		 cond='09';//雾
		 break;
	 case '102':
		 cond='10';//少云
		 break;
	 case '300':
	 case '301':
		 cond='011';//阵雨
		 break;
	 case '302':
	 case '303':
	 case '304':
		 cond='012';//雷阵雨
		 break;
	 case '305':
	 case '308':
	 case '309':
		 cond='013';//小雨
		 break;
	 case '307':
		 cond='014';//大雨
		 break;
	 case '400':
	 case '404':
	 case '405':
		 cond='015';//小雪
		 break;
	 case '402':
		 cond='016';//大雪
		 break;
	 case '401':
		 cond='017';//中雪
		 break;
	 case '310':
	 case '311':
	 case '312':
	 case '313':
		 cond='018';//暴雨
		 break;
	 case '104':
		 cond='019';//阴
		 break;
	 case '306':
		 cond='020';//中雨
		 break;
		 
	 }
	 return cond;
 }	
 	function getDat(d){ //获取时间
 		var timp={};
		var strTime=d.split('-').join('/');
		var dateArr=d.split('-');
		var dd=Date.parse(strTime);
		//console.log(dd);
		var date=new Date(dd);
		var day=date.getDay();
		//console.log(typeof day);
		switch(day){
		case 0:
			day=' 周日';
		break;
		case 1:
			day=' 周一';
		break;
		case 2:
			day=' 周二';
		break;
		case 3:
			day=' 周三';
		break;
		case 4:
			day=' 周四';
		break;
		case 5:
			day=' 周五';
		break;
		case 6:
			day=' 周六';
		break;
		}
		return timp={day:day,date:dateArr[1]+'月'+dateArr[2]+'日'};
	}
function getWeather(cty){
		var cond="多云";//阴晴天
		var tempRange="23-28";//气温		
		$.ajax({
			type:'get',
			url:'/dfj/Weatherinfo/weather',
			data:{cityName:cty,lang:lang},
			async:false,
			success:function(d){
				if(d.data!=null){
					var today="";
					var tomorrow="";
					var afterTomorr="";
					var html="";
					var data=d.data;
					if(data.HeWeather5[0].status=='ok'){
						/*天气：阴天、晴天...*/
						var now=data.HeWeather5[0].now;//实时天气
						var tody=data.HeWeather5[0].daily_forecast[0];//当天天气
						//var tom=data.HeWeather5[0].daily_forecast[1];//明天天气
						//var afterTom=data.HeWeather5[0].daily_forecast[2];//后天天气
						// 导航栏天气显示
						cond=data.HeWeather5[0].daily_forecast[0].cond.txt_d;
						tempRange=data.HeWeather5[0].daily_forecast[0].tmp.min+"~"+data.HeWeather5[0].daily_forecast[0].tmp.max;
						// 导航栏显示
						sessionStorage.setItem('lng',data.HeWeather5[0].basic.lon);//经度显示
						sessionStorage.setItem('lat',data.HeWeather5[0].basic.lat);//纬度显示
						$('.daily_forecast .cond').text(cond);
						$('.daily_forecast .temp').text(tempRange+"℃");
						var todCond=showCond(now.cond.code);
						today+='<li class="today"><span class="todayIcon" style="background:url(/resources/img2/weather/icon80/'+todCond+'.png)"></span><div class="tempBox">'+
            					'<span class="temp">'+now.tmp+'</span><span class="tempText"><span class="tempIcon">℃</span>'+
            					'<span class="intime">实时</span></span></div><div class="tempValue">'+tody.tmp.min+'~'+tody.tmp.max+'℃</div>'+
            					'<div class="weather">'+now.cond.txt+'</div></li>';
						
						for(var i=1;i<data.HeWeather5[0].daily_forecast.length;i++){
							var dd=getDat(data.HeWeather5[0].daily_forecast[i].date);
							var condIcon=showCond(data.HeWeather5[0].daily_forecast[i].cond.code_d);
							html+='<li class="future tomorrow"><span class="day date1">'+dd.day+'</span><span class="day date">'+dd.date+'</span>'+
									'<span class="icon tomorrowIcon" style="background:url(/resources/img2/weather/icon50/'+condIcon+'.png)"></span>'+
									'<span class="day dayTemp">'+data.HeWeather5[0].daily_forecast[i].tmp.min+'~'+data.HeWeather5[0].daily_forecast[i].tmp.max+'℃</span>'+
									'<span class="day dayWeather">'+data.HeWeather5[0].daily_forecast[i].cond.txt_d+'</span></li>';
						}
					}
					today+=html;
					$('.threedays ul').html(today);
				}
			}
		});		
	}
	
/****获取城市天气********/		
	$('.pop_city_container ul li a').click(function(e){
			e.stopPropagation();
			var city=$(this).text();
			sessionStorage.setItem("city",city);
			$('.city_selected').text(city);
		//	console.log(city);
			/*获取城市天气*/
			getWeather(city);			
		});	
});
/*加载选择的城市天气*/
$(function(){
	if(sessionStorage.city==""||sessionStorage.city==undefined){//如果本地没有城市就调取接口获取城市
		getIpCity();		
	}else{
		/*页面填充城市*/
		$('.city_selected').text(sessionStorage.city);
		getWeather(sessionStorage.city);
	}	
	function getIpCity(){
		/*通过ip 获取城市*/
		$.ajax({
			type:'get',
			async:false,
			url:'/dfj/userIP/getUserIP',
			success:function(d){							
					$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip='+d, function(result){  
						if(remote_ip_info.ret == '1'){
							// console.log(remote_ip_info);
							sessionStorage.city=remote_ip_info.city;//将获取到的城市保存到本地
							$('.city_selected').text(remote_ip_info.city);	//页面首次填充城市名称
							getWeather(remote_ip_info.city);
						}										
					});					
			}
			
		});	
	}
});
/* 未来天气显示 */
var userAgent=BrowserType();//获取浏览器版本
$('.future_weather').mouseenter(function(){
	if(userAgent.IE=='9'||userAgent.IE=='10'){			
		$('.threedays').stop().animate({height:"190px"},500,"linear");			
	}
});
$('.future_weather').mouseleave(function(){
	if(userAgent.IE=='9'||userAgent.IE=='10'){		
		$('.threedays').stop().animate({height:"0"},500,"linear",function(){
			
		});												
	}
});
