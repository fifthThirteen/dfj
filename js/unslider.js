/** 
 *   Unslider by @idiot and @damirfoy 
 *   Contributors: 
 *   - @ShamoX 
 * 
 */  
  
(function($, f) {  
    var Unslider = function() {  
        //  克隆对象  
        var _ = this;  
  
        //  设置一些默认参数  
        _.o = {  
            speed: 500,     // 动画过渡的速度(毫秒),如果不需要过渡效果就设置为false  
            delay: 3000,    // 每张幻灯片的间隔时间(毫秒), 如果不是自动播放就设置为false  
            init: 0,        // 初始化延迟时间(毫秒),如果不需要延迟就设置为false  
            pause: !f,      // 当鼠标指针浮动在当前区域内时是否暂停自动播放  
            loop: !f,       // 是否无尽循环播放  
            keys: f,        // 是否开启键盘导航  
            dots: f,        // 是否显示导航点  
            arrows: f,      // 是否显示向前和向后的箭头  
            prev: '←',     // 向前按钮中的显示文字(或html片段)  
            next: '→',     // 向后......  
            fluid: f,       // 是否宽度自适应  
            starting: f,    // 在每个动画前调用的函数  
            complete: f,    // 在每个动画之后调用的函数  
            items: '>ul',   // 幻灯片的容器选择器  
            item: '>li',    // 需要滚动的选择器  
            easing: 'swing',// 动画的缓动函数(easing function)  
            autoplay: true  // 是否允许自动播放  
        };  
  
        _.init = function(el, o) {  
            //  将我们在外部调用时设置的参数覆盖掉默认参数  
            _.o = $.extend(_.o, o);  
  
            _.el = el;  
            _.ul = el.find(_.o.items);//返回ul元素集合  
            _.max = [el.outerWidth() | 0, el.outerHeight() | 0];//保存一下幻灯片div容器的宽和高  
            _.li = _.ul.find(_.o.item).each(function(index) {  
                var me = $(this),  
                    width = me.outerWidth(),  
                    height = me.outerHeight();  
  
                //  记录最大幻灯片的宽高  
                if (width > _.max[0]) _.max[0] = width;  
                if (height > _.max[1]) _.max[1] = height;  
            });  
  
  
            //  申请一些临时变量  
            var o = _.o,  
                ul = _.ul,  
                li = _.li,  
                len = li.length;//li元素个数  
  
            //  当前索引，或者叫页码更容易理解吧，源代码中写了“Current indeed”，应该是“index”吧  
            _.i = 0;  
  
            //  设置幻灯片div容器的样式，高度初始化为第一个li的高度  
            el.css({width: _.max[0], height: li.first().outerHeight(), overflow: 'hidden'});  
  
            //  设置ul元素的位置和宽度，宽度的公式是(li元素的个数乘以100)%，我的例子中就是300%  
            ul.css({position: 'relative', left: 0, width: (len * 100) + '%'});  
            if(o.fluid) {  
                li.css({'float': 'left', width: (100 / len) + '%'});//自适应宽度时，li元素的宽度就是把ul的宽度平均分成len份  
            } else {  
                li.css({'float': 'left', width: (_.max[0]) + 'px'});//不是自适应时，li元素的宽度是最大的幻灯片的宽度  
            }  
  
            //  在init毫秒后开启自动播放  
            o.autoplay && setTimeout(function() {  
                if (o.delay | 0) {  
                    _.play();  
  
                    if (o.pause) {  
                        el.on('mouseover mouseout', function(e) {  
                            _.stop();//鼠标经过时暂停  
                            e.type == 'mouseout' && _.play();//鼠标离开时播放  
                        });  
                    };  
                };  
            }, o.init | 0);  
  
            //  键盘事件处理  
            if (o.keys) {  
                $(document).keydown(function(e) {  
                    var key = e.which;  
  
                    if (key == 37)  
                        _.prev(); // 左箭头按键  
                    else if (key == 39)  
                        _.next(); // 右箭头按键  
                    else if (key == 27)  
                        _.stop(); // Esc  
                });  
            };  
  
            //  显示导航点  
            o.dots && nav('dot');  
  
            //  显示箭头  
            o.arrows && nav('arrow');  
  
            //  使幻灯片div容器宽度自适应  
            if (o.fluid) {  
                $(window).resize(function() {  
                    _.r && clearTimeout(_.r);  
  
                    _.r = setTimeout(function() {  
                        var styl = {height: li.eq(_.i).outerHeight()},  
                            width = el.outerWidth();  
  
                        ul.css(styl);  
                        //这一串真是绕，其实就是计算div占父窗口的宽度原始比例，然后记录到styl中  
                        styl['width'] = Math.min(Math.round((width / el.parent().width()) * 100), 100) + '%';  
                        el.css(styl);//重新设置幻灯片div容器的宽度为比例而不是像素值，这样就能达到自适应的目的了  
                        li.css({ width: width + 'px' });//设置li的绝对宽度，以防因div被自适应了而挤压或拉伸了li造成内容扭曲（如有误请大神指教）  
                    }, 50);//每次父窗口改变大小时，幻灯片div容器延迟50毫秒后再跟着自适应大小，请大神告诉我这样做的目的仅仅是为了效果更自然么  
                }).resize();//强制执行resize事件，使得自适应特性在最开始时就被设置好了  
            };  
  
            //  自定义move事件，这一段不太懂，求大神指点  
            if ($.event.special['move'] || $.Event('move')) {  
                //  为幻灯片div元素绑定movestart、move、moveend事件  
                el.on('movestart', function(e) {  
                    if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {  
                        e.preventDefault();//鼠标位置不在当前区域时取消事件的默认动作（我猜的，关键是不知道distX这几个的准确含义）  
                    }else{  
                        el.data("left", _.ul.offset().left / el.width() * 100);  
                    }  
                }).on('move', function(e) {  
                        var left = 100 * e.distX / el.width();  
                        var leftDelta = 100 * e.deltaX / el.width();  
                        _.ul[0].style.left = parseInt(_.ul[0].style.left.replace("%", ""))+leftDelta+"%";  
  
                        _.ul.data("left", left);  
                    }).on('moveend', function(e) {  
                        var left = _.ul.data("left");//  
                        if (Math.abs(left) > 30){  
                            var i = left > 0 ? _.i-1 : _.i+1;  
                            if (i < 0 || i >= len) i = _.i;  
                            _.to(i);  
                        }else{  
                            _.to(_.i);  
                        }  
                    });  
            };  
  
            return _;  
        };  
  
        //  播放指定索引的幻灯片  
        _.to = function(index, callback) {  
            if (_.t) {  
                _.stop();  
                _.play();  
            }  
            var o = _.o,  
                el = _.el,  
                ul = _.ul,  
                li = _.li,  
                current = _.i,  
                target = li.eq(index);  
            //在动画之前执行的函数，我的例子里都没有，可以忽略它们  
            $.isFunction(o.starting) && !callback && o.starting(el, li.eq(current));  
  
            //  如果(一张幻灯片也没有或者索引无效)，并且不是循环播放，就啥也不做，我觉得这样不好，因为to这个函数就只能在循环播放状态下工作了  
            if ((!target.length || index < 0) && o.loop == f) return;  
  
            //  检查索引是否有效，超出时设置为0，即第一张幻灯片  
            if (!target.length) index = 0;  
            if (index < 0) index = li.length - 1;//索引负数时设置为最后一张幻灯片  
            target = li.eq(index);//获取目标元素  
  
            var speed = callback ? 5 : o.speed | 0,//执行回调函数后返回的是真则speed设为5，如果没有回调函数或返回假则设置为o.speed  
                easing = o.easing,  
                obj = {height: target.outerHeight()};  
  
            if (!ul.queue('fx').length) {//确保没有为ul元素添加函数队列，应该是为了防止上一次动作还没有完成吧  
                //  设置对应导航点的高亮  
                el.find('.dot').eq(index).addClass('active').siblings().removeClass('active');  
                //  改变幻灯片div容器的高度为目标元素的高度，并把ul的位置向左移动(index*100%)，使目标元素正好在幻灯片div容器区域  
                el.animate(obj, speed, easing) && ul.animate($.extend({left: '-' + index + '00%'}, obj), speed, easing, function(data) {  
                    _.i = index;//移动结束之后更新一下当前索引  
                    //动画结束之后执行的函数，我的例子中也没有，忽略它们  
                    $.isFunction(o.complete) && !callback && o.complete(el, target);  
                });  
            };  
        };  
  
        //  每隔delay毫秒自动播放  
        _.play = function() {  
            _.t = setInterval(function() {  
                _.to(_.i + 1);//这里就加了1个索引号，具体的处理都封装在了to方法中  
            }, _.o.delay | 0);  
        };  
  
        //  停止自动播放  
        _.stop = function() {  
            _.t = clearInterval(_.t);  
            return _;  
        };  
  
        //  向后翻一张  
        _.next = function() {  
            return _.stop().to(_.i + 1);  
        };  
        //  向前翻一张  
        _.prev = function() {  
            return _.stop().to(_.i - 1);  
        };  
  
        //  创建导航点和箭头  
        function nav(name, html) {  
            if (name == 'dot') {  
                html = '<ol class="dots">';  
                $.each(_.li, function(index) {  
                    html += '<li class="' + (index == _.i ? name + ' active' : name) + '">' + ++index + '</li>';  
                });  
                html += '</ol>';  
                /*整理一下，在我的例子中就是这副摸样 
                  <ol class="dots">            
                  <li class="dot active">0</li> 
                  <li class="dot">1</li> 
                  <li class="dot">2</li> 
                  </ol> 
                */  
            } else {  
                html = '<div class="';  
                html = html + name + 's">' + html + name + ' prev">' + _.o.prev + '</div>' + html + name + ' next">' + _.o.next + '</div></div>';  
                /*也整理一下 
                  <div class="arrows"> 
                    <div class="arrow prev">←</div> 
                    <div class="arrow next">→</div> 
                  </div> 
                */  
            };  
            //先给幻灯片div容器元素加上has-dots或arrows的class，再把上面组织好的元素追加为子元素，并给该子元素添加click事件处理函数  
            _.el.addClass('has-' + name + 's').append(html).find('.' + name).click(function() {  
                var me = $(this);  
                me.hasClass('dot') ? _.stop().to(me.index()) : me.hasClass('prev') ? _.prev() : _.next();  
            });  
        };  
    };  
  
    //  将unslider方法扩展到jQuery对象，使任意jQuery对象都能够直接访问该方法，就像上面那样：$('.banner').unslider();  
    $.fn.unslider = function(o) {  
        var len = this.length;  
  
        //  遍历li元素集  
        return this.each(function(index) {  
            var me = $(this),  
                key = 'unslider' + (len > 1 ? '-' + ++index : ''),  
                instance = (new Unslider).init(me, o);  
  
            //  给div元素添加数据  
            me.data(key, instance).data('key', key);  
        });  
    };  
  
    Unslider.version = "1.0.0";  
})(jQuery, false);  