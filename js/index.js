$(function() {
    $('.img_list_box_1,.img_list_box_2').unslider({
    	speed: 500,               //  The speed to animate each slide (in milliseconds)
		delay: 3000,              //  The delay between slide animations (in milliseconds)
		complete: function() {},  //  A function that gets called after every slide animation
		keys: true,               //  Enable keyboard (left, right) arrow shortcuts
		dots: true,               //  Display dot navigation
		fluid: true              //  Support responsive design. May break non-responsive designs
    });
	$("#changeImg").on("mouseover","img",function(){
		var src = $(this).attr('src');
		var change_src = $(this).attr('change-src');
		$(this).attr('src',change_src);
		$(this).attr('change-src',src);
	});
	$("#changeImg").on("mouseout","img",function(){
		var src = $(this).attr('src');
		var change_src = $(this).attr('change-src');
		$(this).attr('src',change_src);
		$(this).attr('change-src',src);
	});
	
	var length = $('.cooperative_content ul').find('li').length;
	var li = "";
	for (var i = 0; i < length; i++) {
		var li = $(".cooperative_content ul").find('li').eq(i).clone();
		$(".cooperative_content ul").append(li);
	}
	$('.cooperative_content').scrollLeft(1230);
	var tt = setInterval(fun1,10);
	$('.cooperative_content').on('mouseout',function(){
		tt = setInterval(fun1,10);
	});
	$('.cooperative_content').on('mouseover',function(){
		clearInterval(tt);
	});
	
	function fun1(){
		if($('.cooperative_content').scrollLeft() <= 0){
			setTimeout(function(){
				$('.cooperative_content').scrollLeft(1230);
			},6);
		}else{
			var str = parseInt($('.cooperative_content').scrollLeft());
			$('.cooperative_content').scrollLeft(str-1);
		}
	}

});
