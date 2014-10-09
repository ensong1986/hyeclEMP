;
(function($){
	
	var WfEditor = window.WfEditor = clazz.create();
	
	$.extend(WfEditor.prototype,{
		init:function(div,conf){
			conf = this.conf = $.extend(conf || {},{});
			
			div = this.div = $(div);
		},
		
		loadXml:function(uri,callback){
			var t = this ;
			
			$.get(uri,null,function(ret){
				if(callback)
					callback(ret);
			});
		},
		
		parse:function(str){
			var doc ;
			
			if(window.DOMParser){ 
				var p = new DOMParser(); 
				doc = p.parseFromString( str, "text/xml" ); 
			}else if( window.ActiveXObject ){
				doc = new ActiveXObject( "Msxml2.DOMDocument" ); 
				doc.loadXML(str);
			}else{
			}
			
			return doc ;
		},
		
		build:function(str){
			this.steps = [];
			
			this.div.empty();
			
			this.div.append("<a id=\"wf-pot\" href=\"javascript:void(0);\" ></a>");
			var pot = this.pot = this.div.find("#wf-pot");
			pot.hide();
			
			
			var doc = this.doc = this.parse(str);
			
			if(!doc)
				alert("解析错误");
			
			var wf = doc.documentElement ;
			
			var n ;
			var ns = wf.childNodes ;
			
			if(ns && ns.length > 0 ){
				var i ,len = ns.length ;
				for(i  = 0; i < len ; i ++){
					n = ns[i];
					if(n.nodeName == "step" && n.nodeType == 1)
						break ;
				}
			}
			
			if(n){
				this.steps = this.children(n);
				
				var i , len = this.steps.length ;
			
				for(i = 0; i < len ; i ++){
					var step = this.steps[i];
					if(step){
						this.add(step);
					}
				}
			}
			
			// this.point();
			
			var w = this.maxW() + 200 ;
			
			var bw = $(document.body).width();
			if(w < bw)
				w = bw;
			
			this.div.css("width",w);
		},
		
		point:function(stepId){
			var el ;
			if(stepId ){
				el = this.div.find("#step-" + stepId);
			}else{
				el = this.div.find("a.step-main-actived");
			}
			
			var p = $(el).position();
			
			this.pot.css({"left":p.left + el.outerWidth()/2 - this.pot.width() / 2,"top":p.top - this.pot.height()});
			this.pot.show();
		},
		
		add:function(step){
			var el = $(document.createElement("a"));
			el.attr("href","javascript:void(0);");
			el.attr("title",step.name);
			
			this.div.append(el);
			
			el.addClass("step");
			el.addClass("pop-tip");
			
			if(!step.parentId){
				el.addClass("step-start");
			}else{
				el.addClass("step-" + step.type + "-" + step.state);
			}
			
			el.attr("id","step-" + step.id);
			el.attr("name",step.name);
			el.attr("type",step.type);
			el.attr("state",step.state);
			el.attr("actorName",step.actorName);
			el.attr("actorType",step.actorType);
			
			var pos = this.pos(step,el.width(),el.height(),50,15);
			el.css({"left":pos.left,"top":pos.top});
			
			if(step.parentId){
				this.div.append("<span id=\"pot-" + step.id + "\" class=\"pot-" + step.type +"\"></span>");
				
				var pot = this.div.find("#pot-" + step.id);
				
				var p ;
				if(step.type == "main"){
					p = {"left":pos.left - pot.width() + 3,"top":pos.top + (el.height() - pot.height()) / 2} ;
				}else{
					p = {"left":pos.left - pot.width() + 1,"top":pos.top - el.height() + 10} ;
				}
				
				pot.css(p);
			}
			
			el.html(step.name + " [" + pos.left + "-" + pos.top + "]");
		},
		
		pos:function(step,w,h,vs,hs){
			var x = this.parents(step).length || 0 ;
			var y = step.type == "read" ? this.previous(step).length || 0 : 0 ;
			
			var left = x * w + vs * (x ) + 5 ;
			var top = y * h + hs * (y + 1) - 10;
			
			if(step.type == "read"){
				left = left - 50 - 12 ;
			}
			
			return {"left":left,"top":top} ;
		},
		
		/* 递归查找所有的父 */
		parents:function(step){
			var r = [];
			
			if(!step.parentId){
				return r;
			}else{
				var p = this.get(step.parentId);
				if(p){
					r.push(p);
					
					var pp = this.parents(p);
					if(pp){
						var i ,len = pp.length ;
						for(i = 0;i < len ; i ++){
							pp[i] ? r.push(pp[i]) : void(0);
						}
					}
				}
			}
			
			return r ;
		},
		
		previous:function(step){
			var ary ;
			if(!step.parentId ){
				return 0 ;
			}else{
				ary = this.childAll(this.get(step.parentId));
			}
			
			var r = [];
			
			var i , len = (ary || []).length ;
			for(i =0; i < len ; i ++){
				var it = ary[i];
				//it.id == step.id ? void(0) : r.push(it);
				if(it.id != step.id )
					r.push(it);
				else
					break ;
			}
			
			return r;
		},
		
		fir:function(){
			var i , len = this.steps.length ;
			
			for(i = 0; i < len ; i ++){
				var s = this.steps[i];
				if(s && !s.parentId)
					return s ;
			}
		},
		
		maxW:function(){
			var w = 0;
			
			var i ,len = this.steps.length ;
			for(i  = 0 ;i < len ; i ++){
				var el = $("#step-" + this.steps[i].id);
				
				var p = el.position();
				
				if(p && p.left ){
					w = w < p.left ? p.left : w ;
				}
				
				if(i == len - 1)
					w = w + el.outerWidth();
			}
			
			return w ;
		},
		
		childAll:function(step){
			return this.child(step);
		},
		
		childM:function(step){
			return this.child(step,true);
		},
		
		childR:function(step){
			return this.child(step,false);
		},
		
		child:function(step,b){ // b is main
			var parentId = typeof(step) == "string" ? step : step.id;
			
			var r ;
			
			if(typeof(b) == 'undefined' || typeof(b) == 'null'){
				r = [];
				
				var i , len = this.steps.length ;
				for(i = 0; i < len ; i ++){
					var s = this.steps[i];
					if(s && s["parentId"] == parentId){
						r.push(s);
					}
				}
			}else{
				if(b){
					var i , len = this.steps.length ;
					for(i = 0; i < len ; i ++){
						var s = this.steps[i];
						if(s && s["parentId"] == parentId && s.type == "main"){
							r = s ;
							break ;
						}
					}
				}else{
					r = [];
					
					var i , len = this.steps.length ;
					for(i = 0; i < len ; i ++){
						var s = this.steps[i];
						if(s && s["parentId"] == parentId && s.type == "read"){
							r.push(s);
						}
					}
				}
			}
			
			return r ;
		},
		
		get:function(stepId){
			var r ;
			
			var i ,len = this.steps.length ;
			
			for(i = 0; i < len ; i ++){
				var step = this.steps[i];
				if(step && step.id == stepId){
					r = step ;
					break ;
				}
			}
			
			return r ;
		},
		
		children:function(el){
			var r = [];
			
			var parentId ;
			
			if(el.parentNode && el.parentNode.nodeName == "step"){
				parentId = el.parentNode.getAttribute("id");
			}
			
			if(el.nodeType == 1){
				var obj = this.obj(el,parentId);
				r.push(obj);
				
				var nds = el.childNodes || [];
				
				var i ,len = nds.length ;
				for(i = 0; i < len ; i ++){
					var ary = this.children(nds[i]) || [];
					
					var x,y = ary.length ;
					for(x = 0 ; x < y ; x ++)
						r.push(ary[x]);
				}
			}
			
			return r ;
		},
		
		/*
		<step id="6" name="存档" type="main"
					actorType="keng.core.app.sys.DeptInfo" state="waitting"
					actorName="档案室" />
		*/
		obj:function(el,parentId){
			var o = {};
			
			parentId ? o["parentId"] = parentId : void(0);
			
			o.name = el.getAttribute("name");
			o.id = el.getAttribute("id");
			o.type = el.getAttribute("type");
			o.actorType = el.getAttribute("actorType");
			o.state = el.getAttribute("state");
			o.actorName = el.getAttribute("actorName");
			
			return o ;
		}
	});
	
})($);








$(function(){
	var wfEditor = window.wfEditor = new WfEditor($("#wf-ui"),null);
	
	window.parent.window.onWfUiBuilded(wfEditor);
	
	/*
	$("#wf-source").buildWfUi();
	
	wfEditor.loadXml("wf.xml");

	window.setTimeout(function(){
		wfEditor.build();
		wfEditor.point(31);

		wfEditor.div.find(".pop-tip").popTip({
			loaded:function(ctl,el){
				return "<b>" + el.attr("name") + "</b><hr />"
					+ "actorName:" + el.attr("actorName") + "<br />"
					+ "actorType:" + el.attr("actorType") + "<br />";
					+ "";
			}
		});
	},1000);
	*/
});