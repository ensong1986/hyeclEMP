;
(function($){
	
	$.btn = $.btn || {} ;
	
	$.widget("btn.toggleBtn",{
		init:function(conf){
			conf = this.conf = $.extend({},conf,$.btn.toggleBtn.conf);
			
			var el = this.el = this.element ;
			//el.hide();
			
			var btnclass = this.btnclass = conf.btnclass || el.attr("btnclass");
			var btnactiveclass = this.btnactiveclass = conf.btnactiveclass || el.attr("btnactiveclass");
			
			el.wrap("<span></span>");
			var span = this.span = el.parent();
			
			var attrs = this.attrs = {};
			for(var i in conf.attr){
				var attr = conf.attr[i];
				var val = el.attr(attr);
				if(val)
					attrs[attr] = {"val":val,text:el.attr(attr + "text")};
			}
			
			for(var k in attrs){
				var o = attrs[k];
				
				var spl = "";
				if(k != "fir" )
					spl = "&nbsp;/&nbsp;";
				
				span.append(spl + "<a href=\"javascript:void(0);\" class=\"" + btnclass + "\" val=\"" + o.val + "\">" + o.text + "</a> ");
			}
			
			var t = this ;
			
			var btns = this.btns = span.find("a");
			btns.click(function(){
				var el = $(this);
				t.sel(el.attr("val"),el.text());
			});
			
			btns.focus(function(){
				$(this).blur();;
			});
			
			var val = el.val();
			if(val){
				this.sel(val);
			}
		},
		
		sel:function(val,text){
			var t = this ;
				
			this.btns.each(function(i){
				var el = $(this);
				if(val == el.attr("val")){
					el.addClass(t.btnactiveclass);
				}else{
					el.removeClass(t.btnactiveclass);
				}
			});
			
			this.el.val(val);
			this.el.attr("text",text);
			
			(this.conf.callback || function(){})(val);
		}
	});
	
	$.btn.toggleBtn.conf = {
		attr:["fir","sec","thir","for"],
		btnclass:"link-btn-b",
		btnactiveclass:"toggle-btnactive"
	};
})(jQuery);