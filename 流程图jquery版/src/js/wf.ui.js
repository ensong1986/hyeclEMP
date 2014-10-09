;
(function($){
	window.wfUi = window.wfUi || {};
	
	$.fn.buildWfUi = function(conf){
		return this.each(function(){
			var el = source = $(this);
			el.wrap("<div id=\"wf-editor-wrap\" ></div>");
			var div = $("#wf-editor-wrap");
			
			div.append("<iframe borderspace=\"0\" frameborder=\"0\" id=\"wf-editor\">"
				+ ""
				+ "</iframe>");
			
			var e = document.getElementById("wf-editor");
			
			window.wfUi.loaded = conf.loaded || function(){};
			
			var doc = e.contentWindow.document;
			
			doc.open();
			
			doc.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\"><html>"
				+ "<head></head>" 
				+ "<link rel=\"stylesheet\" href=\"css/dotx.css\" type=\"text/css\" >"
				+ "<link rel=\"stylesheet\" href=\"css/wf.ui.css\" type=\"text/css\" >"
				+ "<link rel=\"stylesheet\" href=\"css/impromptu.css\" type=\"text/css\" >"
				+ "<script src=\"js/jquery-1.4.2.js\" type=\"text/javascript\"></script>"
				+ "<script src=\"js/jqueryui.js\" type=\"text/javascript\"></script>"
				+ "<script src=\"js/jquery-impromptu.3.1.js\" type=\"text/javascript\"></script>"
				+ "<script src=\"js/base.js\" type=\"text/javascript\"></script>"		
				+ "<script src=\"js/wf.ui.js\" type=\"text/javascript\"></script>"
				+ "<script src=\"js/tip.js\" type=\"text/javascript\" ></script>"
				+ "<script src=\"js/wf.inc.js\" type=\"text/javascript\" ></script>"
				+ "<body style=\"padding:0px;margin:0px;\">"
				+ "<div  id=\"wf-ui\" ></div>"
				+ "</body></html>");
			
			doc.close();
		});
	};
	
	
	window.wfUi.dialog = window.wfUi.dialog = function(step){
		var txt = "<div id=\"wf-step-editor\" style=\"font-weight:normal;\">Loading...</div>";
			
		$.prompt(txt,{
			loaded:function(v,m,f){
				$("#wf-step-editor").load("step-editor.html?n=" + new Date().getTime());
			},
			
			buttons:{"保存":1,"添加为新节点":2,"取消":0}
		});
	};
	
	
	window.wfUi.onWfUiBuilded = function(editor){
		window.wfUi.editor = editor ;
		
		var s = $("#wf-source");
		
		editor.val = function(txt){
			if(!txt){
				return s.val();
			}
			
			s.val(txt);
			
			s.trigger("change");
		};
		
		
		s.change(function(){
			editor.build();
		});
		
		(window.wfUi.loaded || function(){})(editor);
	}
})($);















