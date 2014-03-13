$$
({
	popup :
	{

		css_files : 
		[
			'$$/add-ons/client/$$.popup/popup.css'
		],

		state :
		{
			curPopup : 0
		},
		
		bind :
		{
			do_bind_popup_events : function()
			{
				$(window).bind('resize scroll',function()
				{
					if ( ! $$.state.isMobile )
					{
						$$.popup.close();
					}
				});
			}
		},
		
		/*
		options = 
		{
			html : '<b>Hello</b>',
			forceX : 100,
			forceY : 100,
			forceAlpha : 0.5,
			noOverlay : true,
			closeCallback : function(){alert(1);},
			extraClass : 'anything'
		};
		*/
		
		makePopup : function(options)
		{
			$('body').css('overflow','hidden');	
			
			// Ensure that each popup has 100% unique id for now and ever after
			$$.popup.state.curPopup++;
			
			// This ensures that popups stack correctly
			var overlayZ = 999 + $$.popup.state.curPopup;
			var modalZ   = 1000 + $$.popup.state.curPopup;
			
			// This appends the modal to the body
			if ( options.noOverlay === undefined || options.noOverlay == false )
			{
				$('body').append('<div id="overlayId_'+$$.popup.state.curPopup+'" class="overlay"></div>');
			}
			
			$('body').append($$.popup.tpl.popup('popupId_'+$$.popup.state.curPopup, options.html));
			
			// This ensures the overlay sizes correctly
			var overlayCss = {zIndex:overlayZ,height:$$.state.winHeight+'px',width:$$.state.winWidth+'px'};

			$$.popup.fixOverlayHeight($$.popup.state.curPopup);
			
			// This allows you to force a different alpha to the overlay
			if ( options.forceAlpha !== undefined )
			{
				overlayCss['opacity'] = options.forceAlpha;
				overlayCss['filter'] = 'alpha(opacity='+(options.forceAlpha*100)+')';
			}
			
			// This applies zIndexes and forced alpha etc
			$('#overlayId_'+$$.popup.state.curPopup).css(overlayCss);
			$('#popupId_'+$$.popup.state.curPopup).css({zIndex:modalZ});
			
			if ( options.extraClass !== undefined )
			{
				$('#popupId_'+$$.popup.state.curPopup).addClass(options.extraClass);
			}
			
			// This binds a close modal action to the overlay
			if ( typeof options.closeCallback == 'function' )
			{
				$('#overlayId_'+$$.popup.state.curPopup+',#popupId_'+$$.popup.state.curPopup+' .cancel,#popupId_'+$$.popup.state.curPopup+' .close').mousedown(function(event)
				{
					var myEvent = event;
					// Slight delay for cancel button to popup
					var timeout = $(this).hasClass('cancel')?100:0;
					setTimeout(function()
					{
						options.closeCallback();
						$$.stopEvent(myEvent);
					},timeout);
				});
			}
			else
			{
	
				$$.click('#popupId_'+$$.popup.state.curPopup+' .cancel,#popupId_'+$$.popup.state.curPopup+' .close',function(event,clickedThis)
				{
					var myEvent = event;
					// Slight delay for cancel button to popup
					var timeout = $(clickedThis).hasClass('cancel')?100:0;
					setTimeout(function()
					{
						$$.popup.close();
						$$.stopEvent(myEvent);
					},timeout);
				});

				$$.click('#overlayId_'+$$.popup.state.curPopup,function(event)
				{
					$$.popup.close();
				},function(){});

			}
			
			$$.popup.centerIt('#popupId_'+$$.popup.state.curPopup);
			
			if ( options.forceX !== undefined )
			{
				$('#popupId_'+$$.popup.state.curPopup).css({left: options.forceX });
			}
			
			if ( options.forceY !== undefined )
			{
				$('#popupId_'+$$.popup.state.curPopup).css({top: options.forceY });
			}
			
			// Test to see if popup is out of bounds, if it is then force it into view
			if ( options.forceIntoView !== undefined && options.forceIntoView === true )
			{
				$$.popup.forceIntoView('#popupId_'+$$.popup.state.curPopup);
			}
			
			return $('#popupId_'+$$.popup.state.curPopup);

		},
		
		forceIntoView : function(itsId,forceMinTop)
		{
			var pos = $(itsId).offset();
			var minTop = forceMinTop!==undefined?forceMinTop:20;
			
			if ( pos.top < minTop )
			{
				$(itsId).css({top: minTop });
			}
			else
			{
				var height = $(itsId).height();
							
				if ( ( pos.top + height ) > $$.state.winHeight )
				{
					$(itsId).css({top: $$.state.winHeight - (height + 20) });
				}
			}
		},
		
		// This is a wierd quirk fix required for ff. Without this the overlay 
		// is created too long for the page and adds ectra height
		fixOverlayHeight : function(popupId)
		{
			setTimeout(function()
			{
				$('#overlayId_'+popupId).css({height:$(document).height(),width:$(document).width()});
			},0);
		},

		centerIt : function(itsId,adjustment,isAnimated,duration,easing)
		{
			
			if ( itsId === undefined )
			{
				itsId = '#popupId_'+$$.popup.state.curPopup;
			}
			
			if ( adjustment === undefined )
			{
				adjustment = 0.1;
			}
			
			var cssParams =
			{
				top: $(document).scrollTop() + (($$.state.winHeight/2)-($(itsId).height()/2)-($$.state.winHeight*adjustment)),
				left: ($$.state.winWidth/2)-($(itsId).width()/2)
			}
			
			if ( isAnimated !== undefined && isAnimated === true )
			{
				$(itsId).animate
				(
					cssParams,
					duration===undefined?500:duration,
					easing===undefined?'swing':easing
				);
			}
			else
			{
				$(itsId).css(cssParams);
			}
		},

		open : function(options)
		{
			var ignoreForceIntoView = options.ignoreForceIntoView !== undefined ? options.ignoreForceIntoView : undefined;
			var width = options.width !== undefined ? options.width : $$.state.winWidth<=350?220:350;
			var draggable = options.draggable !== undefined && options.draggable === true;
			var overlay = options.overlay !== undefined && options.overlay === true;
			var extraClass = options.extraClass !== undefined ? ' '+options.extraClass:'';
			var forceAlpha = options.forceAlpha !== undefined ? options.forceAlpha:undefined;
			var closeCallback = options.closeCallback !== undefined ? options.closeCallback:undefined;
			var forceX = options.forceX !== undefined ? options.forceX:undefined;
			var forceY = options.forceY !== undefined ? options.forceY:undefined;

			var modal = $$.popup.makePopup
			({
				extraClass : (draggable?' draggable':'')+extraClass,
				html : $$.popup.tpl.systemPopup(options.html,width),
				noOverlay : ! overlay,
				forceAlpha : forceAlpha,
				ignoreForceIntoView : ignoreForceIntoView,
				closeCallback : closeCallback,
				forceX : forceX,
				forceY : forceY
			});
			
			if ( draggable )
			{
				$(modal).draggable
				({
					cancel:'.nodrag',
					containment : 'window'
				})
			}
			
			return modal;
		},
		
		alert : function (str,callback)
		{		
			$$.popup.open
			({
				overlay : true,
				html : $$.popup.tpl.alert(str),
				draggable : true
			});
			
			$$.popup.popupButtonCloseOrCallback('.ok-button',callback);
		},
		
		confirm : function (str,okCallback,cancelCallback)
		{
			$$.popup.open
			({
				overlay : true,
				html : $$.popup.tpl.prompt(str),
				draggable : true
			});
			
			$$.popup.popupButtonCloseOrCallback('.ok-button',okCallback);
			$$.popup.popupButtonCloseOrCallback('.cancel-button',cancelCallback);
		},
		
		choice : function (params)
		{
			$$.popup.open
			({
				overlay : true,
				html : $$.popup.tpl.choice(params),
				draggable : true
			});
			
			$$.popup.popupButtonCloseOrCallback('.choice1-button',params.choice1.callback);
			$$.popup.popupButtonCloseOrCallback('.choice2-button',params.choice2.callback);
		},
		
		popupButtonCloseOrCallback : function(buttonSelector,callback)
		{
			$$.click('#popupId_'+$$.popup.state.curPopup+' '+buttonSelector,function()
			{
				setTimeout(function()
				{
					if ( typeof callback == 'function' )
					{
						callback();
					}
					else
					{
						$$.popup.close();
					}
				},100);
				return false;
			});	
		},
		
		close: function(multiMatch,callback)
		{			
			// Close multiple popups based on selector
			if ( multiMatch !== undefined )
			{
				$(multiMatch).each(function()
				{
					
					// If it belongs to the parent
					if ( $(this).parent().attr('id') !== undefined && $(this).parent().attr('id').match('popupId_') )
					{
						var popupId = parseInt($(this).parent().attr('id').replace('popupId_',''));
					}
					else
					{
						var popupId = parseInt($(this).attr('id').replace('popupId_',''));
					}
	
					$('#overlayId_'+popupId).remove();
					$('#popupId_'+popupId).remove();
	
				});
			}
			// Close the modal with the highest ID
			else
			{
				var popupId = 0;
				$('.popup').each(function()
				{
					popupId = Math.max(popupId,parseInt($(this).attr('id').replace('popupId_','')));
				});
				
				if ( popupId > 0 )
				{
					$('#overlayId_'+popupId).remove();
					$('#popupId_'+popupId).remove();
				}	
			}
			
			if ( typeof callback == 'function' )
			{
				callback();
			}
			
			if ( $('.popup').length == 0 )
			{
				$('body').css('overflow','auto');
			}
			
		}
	}
})