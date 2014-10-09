;
(function($){
	// Fix widget 的 init方法不能传参数的问题
	
	$.widget = function(name, prototype) {
		var namespace = name.split(".")[0];
		name = name.split(".")[1];
		
		// create plugin method
		$.fn[name] = function(options) {
			var isMethodCall = (typeof options == 'string'),
				args = Array.prototype.slice.call(arguments, 1);
			
			if (isMethodCall && getter(namespace, name, options)) {
				var instance = $.data(this[0], name);
				return (instance ? instance[options].apply(instance, args)
					: undefined);
			}
			
			return this.each(function() {
				var instance = $.data(this, name);
				if (isMethodCall && instance && $.isFunction(instance[options])) {
					instance[options].apply(instance, args);
				} else if (!isMethodCall) {
					$.data(this, name, new $[namespace][name](this, options));
				}
			});
		};
		
		// create widget constructor
		$[namespace][name] = function(element, options) {
			var self = this;
			
			this.widgetName = name;
			this.widgetBaseClass = namespace + '-' + name;
			
			this.options = $.extend({}, $.widget.defaults, $[namespace][name].defaults, options);
			this.element = $(element)
				.bind('setData.' + name, function(e, key, value) {
					return self.setData(key, value);
				})
				.bind('getData.' + name, function(e, key) {
					return self.getData(key);
				})
				.bind('remove', function() {
					return self.destroy();
				});
			this.init(options); // fix by 5Di
		};
		
		// add widget prototype
		$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);
	};
	
	
	
	/* ---------------------------------------------------------- */
	
	
	Function.prototype.bind = Function.prototype.b = function(){
		var method = this ;
		var obj = arguments[0];
		var newArgs = [];
		var i ,len = arguments.length ;
		if(len > 1){
			for(i = 1; i < len ; i ++){
				newArgs[i - 1] = arguments[i];
			}
		}
		
		return function(){
			method.apply(obj,newArgs);
		}
	};
	
	window["class"] = window.clazz = {
		create:function(){
			function klass(){
		      this.init.apply(this, arguments);
		    }
			
		    if (!klass.prototype.init)
		      klass.prototype.init = function(){} ;
			
		    klass.prototype.constructor = klass ;
		    return klass ;
		}
	};
})(jQuery);