$$
({
	do_init_core : function()
	{

		$$.state = {lastResize:0};

		// Where are we?
		$$.state.kernalLocation = $('body script[src*=\\$\\$\\/\\$\\$\\.js]').attr('src');
		
		if ( typeof $$.state.kernalLocation != 'undefined' )
		{
			$$.state.kernalRoot = $$.state.kernalLocation.substr(0,$$.state.kernalLocation.indexOf('$$/$$.js'));
		}
		else
		{
			$$.state.kernalRoot = '/web/';
		}
		
		$$.state.trace = false;
		$$.state.traceObjects = false;
		$$.state.traceFilter = /(.*)/;

		// What are we?
		var ua = navigator.userAgent.toLowerCase();
		$$.state.isIE = ua.indexOf("msie") > -1;
		$$.state.isSafari = ua.indexOf("safari") > -1;
		$$.state.isWebkit = ua.indexOf("webkit") > -1;
		$$.state.isOpera = ua.indexOf("presto") > -1;
		$$.state.isChrome = ua.indexOf("chrome") > -1;
		$$.state.isFirefox = ua.indexOf("firefox") > -1;
		$$.state.isIpad = ua.indexOf("ipad") > -1;
		$$.state.isIphone = ua.indexOf("iphone") > -1;
		$$.state.isIpod = ua.indexOf("ipod") > -1;
		$$.state.isAndroid = ua.indexOf("android") > -1;
		$$.state.isWebOS = ua.indexOf("webos") > -1;
		$$.state.browserVersion = parseFloat($.browser.version);
		$$.state.isIOS = $$.state.isIpad || $$.state.isIpod || $$.state.isIphone ? true : false;
		$$.state.isSafari = $$.state.isSafari && $$.state.isChrome ? false : $$.state.isSafari;
		$$.state.isMac = ua.indexOf("os x") > -1;
		$$.state.isWindows = ua.indexOf("windows") > -1;
		$$.state.isMobile = $$.state.isIOS || $$.state.isAndroid ? true : false;
		$$.state.isTablet = $$.state.isIpad ? true : false;
		$$.captureWinSize();

		$(document).ready(function()
		{
			for ( var isClass in $$.state )
			{
				if ( isClass.substr(0,2) == 'is' && $$.state[isClass] )
				{
					$('body').addClass(isClass);
				}
			}
		
			$('.screenWidth').each(function()
			{
				var padding = parseFloat($(this).css('padding-left').replace('px',''))+parseFloat($(this).css('padding-right').replace('px',''));
				$(this).css({ width: $$.state.winWidth-padding });
			});
			
			$('.screenHeight').each(function()
			{
				var padding = parseFloat($(this).css('padding-top').replace('px',''))+parseFloat($(this).css('padding-bottom').replace('px',''));
				$(this).css({ height: $$.state.winHeight-padding });
			});

			$('.screenHeightFromY').each(function()
			{
				$(this).css({ height: $$.state.winHeight-$$.yPos(this) });
			});
			
			$('.offscreen').each(function()
			{
				$(this).hide().css({left:-10000});
			});
			
		});

		$(window).resize(function() 
		{
			$$.captureWinSize();
		});
		
		
	},
	
	removeItemFromArray : function(itemNum,oldArray)
	{
		var newArray = [];
					
		for ( var i in oldArray )
		{
			if ( i == itemNum )
			{
				continue;	
			}
			
			newArray.push(oldArray[i]);
		}
		
		return newArray;
	},
	
	getRegex : function(regex,string)
	{
		if ( string )
		{
			var matches = string.match(regex);
			if ( matches )
			{
				return string.match(regex)[1];
			}
		}
		return false;
	},
	
	captureWinSize : function()
	{
		// Use .resizing .yourclass to remove box shadows and optimize responsiveness
		$('body').addClass('resizing');
		$$.state.lastResize = $$.timeStamp();
		setTimeout(function()
		{
			if ( $$.timeStamp() - $$.state.lastResize > 100 )
			{
				$('body').removeClass('resizing');
			}
		},200);
		
		$$.state.winHeight = $(window).height();
		$$.state.winWidth = $(window).width();
		return { width: $$.state.winHeight, height: $$.state.winWidth };
	},
	
	xPos : function(selector)
  	{
  		var pos = $(selector).offset();
  		if ( pos !== null ) return pos.left;
  		
  	},
  	
  	yPos : function(selector)
  	{
  		var pos = $(selector).offset();
  		if ( pos !== null ) return pos.top;
  	},
  	
  	timeStamp : function()
	{
		var date = new Date;
		var timeStamp = date.getTime();
		return timeStamp;
	},
	
	getAddOn : function(addOnPath,callback)
	{
		$.get
		(
			addOnPath,
			function()
			{
				if ( typeof callback == 'function' )
				{
					setTimeout(function()
					{
						callback();
					},500);
				}
			},
			"script"
		);
	},
	
	exists : function (path) 
	{
		var parts = path.split('.');
		var lookup = $$;
		for (var i = 0; i < parts.length; i++) 
		{
			lookup = lookup[parts[i]];
			if ( typeof lookup == 'undefined' ) return false;
		}
		return true;    
	},
	
	isNumeric : function(n)
	{
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	
	parseNum : function(strNum)
	{
		if ( strNum.indexOf('.') > -1 )
		{
			return parseFloat(strNum);
		}
		return parseInt(strNum);
	},
	
	rand : function(from,to)
	{
		return Math.floor(Math.random() * (to - from + 1)) + from;	
	},
	
	stopEvent : function(event)
	{
		if ( event !== undefined )
		{
			if ( $.browser.msie )
			{
				var hasCancelBubble = false;
				for ( var prop in window.event )
				{
					if ( prop == 'cancelBubble' )
					{
						hasCancelBubble = true;
					}
				}
				
				if ( hasCancelBubble )
				{
					window.event.cancelBubble = true;
				}
				else
				{
					// mmm. nice ie decided to remove this property in later browsers
					event.stopPropagation();
				}
			}
			else
			{
				event.stopPropagation();
			}
		}
	},
	
	isValidEmail : function(email)
	{
		return email.match(/[_a-zA-Z0-9\'-]+(\.[_a-zA-Z0-9\'-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/g);	
	},
	
	clone : function(obj)
	{
		var cloned = $.extend(true, {}, obj);
		
		// If the root item is an array, keep it that way
		if ( obj[0] !== undefined )
		{
			var newCloned = [];
			for ( var i in obj )
			{
				newCloned.push(obj[i]);
			}
			
			cloned = newCloned;
		}
		
		return cloned;
	},
	
	getUUID : function()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
		{
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	
	isFormTrigger: function (e)
	{
		if ( (e.keyCode == 13 && e.shiftKey!= 1 ) || e.type === 'click' || e.type == 'submit' )
		{
			return true;
		}
		return false;
	},
	
	capitalize : function(string) 
	{
		return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	},
	
	popUrl : function(url)
	{
		window.open(url);
	},
	
	goUrl : function(url)
	{
		location.href = url;
	},
	
	isTrue : function(theVal)
	{
		if ( theVal === true || theVal == 'true' || theVal == 1 || theVal == '1' )
		{
			return true;
		}
		return false;
	},
	
	isFalse : function(theVal)
	{
		if ( theVal === false || theVal == 'false' || theVal == 0 || theVal == '0' )
		{
			return true;
		}
		return false;
	},
	
	ajax :
	{
		state :
		{
			trace : false,
			autoPopupErrors : false,
			crossDomain : false
		},
		
		ui :
		{
			// Replace with your own functions
			showLoader : function(loaderType) {},
			hideLoader : function(loaderType) {} 
		},
		
		do :
		{
			// Replace with your own functions
			beforeCall : function(options) { return options; },
			afterCall : function(response) { return response; },
				
			call : function(callType,options)
			{

				options = $$.ajax.do.beforeCall(options);

				if ( options.noLoader === undefined )
				{
					$$.ajax.ui.showLoader(options.loaderType);
				}
				
				if ( options.dataType === undefined )
				{
					options.dataType = 'json';
				}
				
				var params =
				{
					cache : false,
					type : callType,
					dataType : options.dataType,
					url : options.url
				}

				if ( options.params !== undefined )
				{
					params.data = options.params;
				}
				
				if ( $$.ajax.state.trace )
				{
					console.log(params);	
				}
				
				if ( $$.ajax.state.crossDomain )
				{
					params.crossDomain = true;
					params.xhrFields = { withCredentials: true };
				}
	
				$.ajax(params).always(function(response)
				{
					if ( options.noLoader === undefined )
					{
						$$.ajax.ui.hideLoader(options.loaderType);
					}
					
					response = $$.ajax.do.afterCall(response);
					
					// This is a way to stop any further ajax processing
					if ( response.quitAjax !== undefined )
					{
						return;
					}
					
					if ( $$.ajax.state.trace )
					{
						console.log(response);	
					}

					// If some kind of server error response
					if ( $$.ajax.state.autoPopupErrors && response.status !== undefined )
					{
						response.error = 'There was an unexpected error with this ajax request: '+options.url;
												
						if ( response.responseText != '' )
						{
							response.error = response.responseText;
						}
					}

					if ( $$.ajax.state.autoPopupErrors && options.manaulErrors === undefined )
					{
						if ( response.statusText !== undefined )
						{
							var curError = response.error;
							response.error = $$.getRegex(/\"error\"\:\"(.*?)\"/,curError);
							response.error_msg = $$.getRegex(/\"error_msg\"\:\"(.*?)\"/,curError);
						}
						
						if ( response.error != 'OK' )
						{
							if ( response.error_msg !== false )
							{
								$$.popup.alert(response.error_msg);
							}
						}
						else
						{
							if ( options.callback !== undefined )
							{
								options.callback(response);
							}
						}
					}
					else
					{
						if ( response.error != 'OK' && typeof response.error != 'string' )
						{
							response.error = 'OK';
						}
						
						if ( options.callback !== undefined )
						{
							options.callback(response);
						}
					}

				});

			}
		},
		
		get : function(options)
		{
			$$.ajax.do.call('get',options);
		},
		
		post : function(options)
		{
			$$.ajax.do.call('post',options);
		},
				
		delete : function(options)
		{
			$$.ajax.do.call('delete',options);
		},
		
		put : function(options)
		{
			$$.ajax.do.call('put',options);
		}
	},
	
	trace : function(strOrObj,filter)
	{
		if ( ! $$.state.trace ) 
		{
			return;
		}
		
		filter = filter !== undefined ? filter : '';
		
		if ( ! filter.match($$.state.traceFilter))
		{
			return;
		}
		
		if ( ! $$.state.traceObjects && typeof strOrObj == 'object' )
		{
			return;	
		}
		
		if ( $$.state.isIE && typeof strOrObj == 'object' && console !== undefined )
		{
			console.dir(strOrObj);
		}
		else if ( console !== undefined )
		{
			console.log(strOrObj);
		}
	}
			
})