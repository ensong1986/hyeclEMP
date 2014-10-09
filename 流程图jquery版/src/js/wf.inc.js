;
(function($){
	
	var WfEditor = window.WfEditor = clazz.create();
	
	$.extend(WfEditor.prototype,{
		init:function(div,src,conf){
			conf = this.conf = $.extend(conf || {},{});
			
			div = this.div = $(div);
		},
		
		load:function(uri,callback){
			var t = this ;
			
			cb = function(v){
				t.val(v);
				
				(callback || function(){})(v);
			};
			
			$.get(uri,null,function(ret){
				cb(ret);
			});
		},
		
		parse:function(str){
			var doc ;
			
			if(window.DOMParser){ 
				var p = new DOMParser(); 
				doc = p.parseFromString( str, "text/xml" ); 
			}else if( window.ActiveXObject ){
				doc = this.xmlDom() ; 
				doc.loadXML(str);
			}
			
			return doc ;
		},
		
		xmlDom:function(){
			var axs = ["MSXML2.DOMDocument.5.0",
				"MSXML2.DOMDocument.4.0",     
				"MSXML2.DOMDocument.3.0",     
				"MSXML2.DOMDocument",
				"Microsoft.XMLDOM",
				"MSXML.DOMDocument"] ;
			for(var   i=0;i<axs.length;i++){
				try{
					return new ActiveXObject(axs[i]);
				}catch(e){}
			}
			return null;
		},
		
		build:function(str){			
			str = str || this.val();			
			
			this.steps = [];
			
			this.div.empty();
			
			this.div.append("<a id=\"wf-pot\" href=\"javascript:void(0);\" ></a>");
			var pot = this.pot = this.div.find("#wf-pot");
			pot.hide();
			
			
			var doc = this.doc = this.parse(str);
			
			if(!doc)
				alert("解析错误");
			
			var wf = this.wf = doc.documentElement ;
			
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
			
			this.pot.css({"top":p.top - this.pot.height()});
			this.pot.show();
			this.pot.animate({"left":p.left + el.outerWidth()/2 - this.pot.width() / 2,"top":p.top - this.pot.height()});
		},
		
		asXml:function(n,d){
			d = d || 0 ;
			n = n || this.wf ;
			
			var prefix = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n" ;
			
			if(n.xml)
				return prefix + n.xml ;
			
			var r ="";
			
			var pre = "";
			
			for(x = 0 ; x < d ; x ++){
				pre = pre + "\t";
			}
			
			if(n.nodeType == 1){
				r = r + pre + "<" + n.nodeName ;
				
				var atts = n.attributes || [];
				for(var i in atts){
					var att = atts[i];
					
					if(typeof(att) == "object"){
						r = r + " " + att.name + "=\"" + att.value + "\"";
					}
				}
				
				var nds = n.childNodes || [];
				var i , len = nds.length ;
				
				if(len > 0 ){
					r = r + ">";
				}else{
					r = r + " />";
				}
				
				for(i = 0; i < len ; i ++){
					var nd = nds[i];
					if(nd.nodeType == 1 ){
						r = r + this.asXml(nd,d + 1);
					}
				}
				
				if(len > 0 )
					r = r + "\r\n" + pre + "</" + n.nodeName + ">";
			}
			
			return r ;
		},
		
		el:function(id,nd){
			nd = nd || this.wf ;
			
			var  nds = nd.childNodes || [];
			var i , len = nds.length ;
			for(i = 0 ;i < len ; i ++){
				var it = nds[i];
				
				if(it){
					if(it.nodeType == 1 && it.getAttribute("id") == id){
						return it ;
					}else{
						var r = this.el(id,it);
						if(r){
							return r ;
						}
					}
				}
			}
			
			return false ;
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
				this.div.append("<a href=\"javascript:void(0);\" id=\"pot-" + step.id + "\" class=\"pot-" + step.type +"\"></a>");
				
				var pot = this.div.find("#pot-" + step.id);
				
				var p ;
				if(step.type == "main"){
					p = {"left":pos.left - pot.width() + 3,"top":pos.top + (el.height() - pot.height()) / 2} ;
				}else{
					p = {"left":pos.left - pot.width() + 1,"top":pos.top - el.height() + 10} ;
				}
				
				pot.css(p);
			}
			
			el.html(step.name);
			
			var t = this ;
			
			el.click(function(){
				t.dialog(step);
			});
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
			return new WfStep(el,parentId);
		},
		
		/* ----------------------------------------------- */
		addNode:function(p){
			
		},
		
		removeNode:function(id){
			var d = this.doc ;
			
			var el = this.el(id);
			
			var p = el.parentNode ;
			if(p){
				p.removeChild(el);
			}
			
			this.val(this.asXml());
			
			this.build();
		},
		
		rplNode:function(id){
			
		},
		
		clear:function(){
			
		},
		
		dialog:function(step){
			window.parent.wfUi.dialog(step);
		}
	});
	
	var WfStep = window.WfStep = clazz.create();
	
	$.extend(WfStep.prototype,{
		init:function(el,parentId){
			this.el = el ;
			
			this.parentId = parentId ;
			
			this.name = el.getAttribute("name");
			this.id = el.getAttribute("id");
			this.type = el.getAttribute("type");
			this.actorType = el.getAttribute("actorType");
			this.state = el.getAttribute("state");
			this.actorName = el.getAttribute("actorName");
		}
	});
	
})($);

$(function(){
	var editor = window.editor = new WfEditor($("#wf-ui"),null);
	window.parent.window.wfUi.onWfUiBuilded(editor);
});