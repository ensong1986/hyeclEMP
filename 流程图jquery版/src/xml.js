;
(function($){
	window.XML = clazz.create();
	
	$.extend(window.XML.prototype,{
		init:function(){
			this.doc ;
		},
		
		parse:function(src){
			try{
	            var p = new DOMParser();
	            this.doc = p.parseFromString(src,'text/xml');
	            return tihs.doc.documentElement;
	        }catch(e){
	            try{
	                this.doc = this.ieAx();
	                this.doc.loadXML(src);
	                return this.doc.documentElement;
	            }catch(e){
	                return null;
	            }
	        }
		},
		
		loadXML:function(path){  
	        if (window.ActiveXObject){
	            this.doc=this.getIEXmlAX();
	        }else if (document.implementation && document.implementation.createDocument){
	            this.doc=document.implementation.createDocument("","",null);
	        }else{
	            alert('Your browser cannot handle this script');
	        }
	        this.doc.async=false;
	        this.doc.load(path);
	        return doc;
	    },
	    
	    root:function(){
	    	if(this.doc){
	    		return this.doc.documentElement ;
	    	}
	    	
	    	return false ;
	    },
		
		children:function(node,name){
			node = node || this.root();
			
	        var nodes = [];
	        for(var i=0;i<node.childNodes.length;i++){
	            if(node.childNodes[i].nodeName == name){
	                nodes[nodes.length] = node.childNodes[i];
	            }
	        }
	        return nodes;
	    },
	    
	    child:function(node,name){
	    	node = node || this.root();
	    	
	        for(var i=0;i<node.childNodes.length;i++){
	            if(node.childNodes[i].nodeName == name){
	                return node.childNodes[i];
	            }
	        }
	        return null;
	    },
		
		selectNodes:function(node,path,child){
			node = node || this.root();
			
	        var paths = path.split("/");
	        for(var i=0;i<paths.length;i++){
	            node = this.child(node,paths[i]);
	            if(node == null){
	                return [];
	            }
	        }
	        return this.children(node,child);
	    },
	      
	    selectSingleNode:function(node,path){
	    	node = node || this.root();
	    	
	        var paths = path.split("/");
	        for(var i=0;i<paths.length;i++){
	            node = this.child(node,paths[i]);
	            if(node == null){
	                return null;
	            }
	        }
	        return node;
	    },
	      
	    nodeValue:function(node){
	        return node.firstChild.nodeValue;  
	    },
		
		ieAx:function(){
			var i,activeXarr;  
	        var activeXarr = [
	            "MSXML4.DOMDocument",
	            "MSXML3.DOMDocument",
	            "MSXML2.DOMDocument",
	            "MSXML.DOMDocument",
	            "Microsoft.XmlDom"
	        ];
	        
	        for(i=0; i<activeXarr.length; i++){
	            try{
	                var o = new ActiveXObject(activeXarr[i]);
	                return o;
	            }catch(e){}
	        }
	        
	        return false;
		},
		
		toXml:function(node){
			alert(node.attributes);
			
			var r = "";
			
			if(node.xml){
				return node.xml ;
			}
			
			// TODO
		}
	});
	
})($);