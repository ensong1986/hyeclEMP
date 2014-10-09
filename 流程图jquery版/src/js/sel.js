;
(function($){
	
	$.btn = $.btn || {} ;
	
	$.widget("btn.sel",{
		init:function(conf){
			conf = this.conf = $.extend({},conf,$.btn.sel.conf);
			
			var id = this.id = this.element ;
			var text = this.text = $("[name=" + id.attr("name") + "-text]");
			
			var ctlId = this.selId = new Date().getTime();;
			text.wrap("<span class=\"ctl-sel\" id=\"ctl-sel-" + ctlId + "\"></span>");
			
			var wrap = this.wrap = $("span#ctl-sel-" + ctlId);
			
			wrap.append("<a id=\"ctl-sel-btn-" + ctlId + "\" class=\"ico ico-sel\" href=\"javascript:void(0);\" title=\"选择\">选择</a>");
			
			var btn = this.btn = $("a#ctl-sel-btn-" + ctlId);
			btn.css("position","absolute");
			
			text.css({"width":text.width() - 20,"padding-right":20});
			
			var p = text.position();
			btn.css({"left":p.left + text.outerWidth() - 20 ,"top":p.top + 4});
			
			wrap.append("<div class=\"ctl-sel-lst\"></div>");
			
			var lst = this.lst = wrap.find("div.ctl-sel-lst");
			lst.css({"width":text.width(),"left":p.left,"top":p.top + text.outerHeight() - 1});
			lst.hide();
			
			var t = this ;
			
			btn.click(function(){
				if(lst.css("display") == "none")
					t.show();
				else
					lst.hide();
			});
			
			text.blur(function(){
				/*
				t.tId = window.setTimeout(function(){
					lst.hide();
				},8000);
				
				
				lst.hover(function(){
					if(t.Id)
						window.clearInterval(tId);
					},function(){
						t.tId = window.setTimeout(function(){
						lst.hide();
					},8000);
				});
				* */
			});
			
			text.focus(function(){
				t.show();
				
				lst.hover(function(){},function(){});
			});
			
			id.attr("disabled",true);
			text.attr("disabled",true);
			
			id.change(function(){
				if(conf.change)
					conf.change(t.items());
			});
			
			id.trigger("change");
		},
		
		show:function(){
			var t = this ;
			
			this.lst.show();
			this.lst.empty();
			
			var its = this.items() || [];
			
			var i ,len = its.length ;
			for(i = 0; i < len ; i ++){
				var it = its[i];
				this.lst.append("<span style=\"color:1px solid #909090;margin-right:3px;margin-bottom:1px;float:left;\">" + it.text + "&nbsp;<a val=\"" + it.id + "\" class=\"item ico ico-del\" href=\"javascript:void(0);\" >×</a></span>");
			}
			
			this.lst.find("a.item").click(function(){
				var id = $(this).attr("val");
				t.del(id);
			});
		},
		
		del:function(rId){	
			var its = this.items();
			
			var ary = [];
			
			var i , len = its.length ;
			for(i = 0; i < len ; i ++){
				var it = its[i];
				if(it.id != rId)
					ary.push(it);
			}
			
			its = ary ;
			
			this.id.val("");
			this.text.val("");
			
			var idstr = "",textstr = "";
			
			var i , len = its.length ;		
			for(i = 0; i < len ; i++){
				var it = its[i];
				idstr = idstr + ((i != 0 ) ? "," : "") + it.id ;
				textstr = textstr + ((i != 0 ) ? "," : "") + it.text ;
			}
			
			this.id.val(idstr);
			this.text.val(textstr);
			
			this.show();
			
			this.id.trigger("change");
		},
		
		items:function(){
			var r = [];
			
			var ids = (this.id.val() || "").split(",");
			var texts = (this.text.val() || "").split(",");;
			var i , len = ids.length ;
			
			for(i = 0 ; i < len ; i ++){
				var id = ids[i];
				if(id){
					r.push({"id":id,"text":texts[i] || ""});
				}
			}
			
			return r;
		}
	});
	
	$.btn.sel.conf = {};
})(jQuery);