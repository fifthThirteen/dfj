window.onload = function(){
	var img_banner = document.getElementById("img_banner");
	var img_list = document.getElementById("img_list");
	var buttons = document.getElementById("buttons").getElementsByTagName('li');
	var prev = document.getElementById("prev");
	var next = document.getElementById("next");
	var index = 1;
	var length = 4;
    // var animated = false;
    var timer;
    var interval = 3000;

	function animate(offset) {
        if (offset == 0) {
            return;
        }
  //       animated = true;
		// var time = 300; //位移总时间
		// var interval = 10; //位移间隔时间
		// var speed = offset/(time/interval); //每次位移量
		var newLeft = parseInt(img_list.style.left) + offset;
		// function go() {
		// 	if ( (speed < 0 && parseInt(img_list.style.left) > newLeft) || (speed > 0 && parseInt(img_list.style.left) < newLeft)) {
		// 		img_list.style.left = parseInt(img_list.style.left) + speed + 'px';
		// 		setTimeout(go,interval);
		// 	} else {
				img_list.style.left = newLeft + 'px';
				if (newLeft < -(1920*(length-1))) {
					img_list.style.left = 0 + 'px';
				}
				if (newLeft > 0) {
					img_list.style.left = -(1920*(length-1)) + 'px';
				}
  //       		animated = false;
		// 	}
		// }
		// go();
	}


	function showButtons() {
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].className == "on") {
				buttons[i].className = "";
				break;
			}
		}
		buttons[index-1].className = "on";
	}

	function play() {
		timer = setInterval(function(){
            next.onclick();
		},interval);
	}

	function stop() {
		clearTimeout(timer);
	}

	prev.onclick = function(){
        // if (animated) {
        //     return;
        // }
		if (index == 1) {
			index = 4;
		} else {
			index -= 1;
		}
		animate(1920);
		showButtons();
	}

	next.onclick = function(){
        // if (animated) {
        //     return;
        // }
		if (index == 4) {
			index = 1;
		} else {
			index += 1;
		}
		animate(-1920);
		showButtons();
	}

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].onclick = function(){
	        // if (animated) {
	        //     return;
	        // }
			if (this.className == "on") {
				return;
			}
			var myIndex = parseInt(this.getAttribute("index"));
			var offset = -1920 * (myIndex - index);
			animate(offset);
			index = myIndex;
			showButtons();
			// debugger;
		}
	}

	img_banner.onmouseover = stop;
	img_banner.onmouseout = play;
	play();
}