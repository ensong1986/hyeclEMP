;
(function($){
	
	$.fn.popTip = function(conf){
		conf.event = conf.event || "hover";
		
		var id = "ctl-tip-" + new Date().getTime();
		
		var doc = document ;
		
		$(doc.body).append("<div id=\"" + id + "\" class=\"ctl-tip\" ></div>");
		
		var ctl = $("div#" + id);
		
		var tId ;
		
		this.each(function(){
			var el = $(this);
			
			function over(){
				if(tId){
					window.clearTimeout(tId);
				}
				
				window.setTimeout(function(){
					show();
				},300);
			}
			
			function out(){
				if(tId)
					window.clearTimeout(tId);
					
				tId = window.setTimeout(function(){
					hide();
				},1000);
			}
			
			if(conf.event == "click"){
				el.click(function(){
					if(ctl.css("display") == "none"){
						if(tId){
							window.clearTimeout(tId);
						}
						
						show();
					}else{
						hide();
					}
				});
				
				ctl.hover(function(){
					if(tId){
						window.clearTimeout(tId);
					}
				},out);
				
			}else{
				el.hover(over,out);
				
				ctl.hover(function(){
					if(tId){
						window.clearTimeout(tId);
					}
				},out);
			}
			
			
			function move(){
				var pos = el.position();
				ctl.css({"left":pos.left + el.outerWidth() + 5 ,"top":pos.top});
			}
			
			function show(){
				if(!conf.loaded){
					ctl.html("<div class=\"ctl-tip-content\">" + ( el.attr("tip") || el.attr("title") ) + "</div>");
				}else{
					ctl.html("<div class=\"ctl-tip-content\">" + ( conf.loaded(ctl,el) || "" ) + "</div>");
				}
				
				
				move();
				
				if(ctl.css("display") == "none")
					ctl.show();
			}
			
			function hide(){
				ctl.hide();
			}
		});
	};
})($);















