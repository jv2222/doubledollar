$$
({
	
	/*
	
	$$.transition
	({
		onscreenId : '#page1',
		offscreenId : '#page2',
		transitionType : 'shoveLeft', // shoveLeft, shoveRight, shoveUp, shoveDown
		duration : 750
	});
				
	*/
	
	transition : 
	{
		__construct : function(params)
		{
			$$.transition.blockUi(params);
			$$.transition.doTransition(params);
		},
		
		blockUi : function()
		{
			$('body').append('<div id="ddUiBlocker" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 10000000; opacity: 0;"></div>');	
			$('#ddUiBlocker').bind('touchmove touchstart click scroll',function(event)
			{
				event.preventDefault();
				$$.stopEvent(event);
				return false;
			});
		},

		doTransition : function(params)
		{
			$(params.offscreenId).show();
			
			switch(params.transitionType)
			{
				case 'shoveLeft':
				
					$(params.onscreenId).css({left:0,top:0});
					$(params.offscreenId).css({left:$$.state.winWidth,top:0});

					$(params.onscreenId).transition({ x: '-'+$$.state.winWidth+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ x: '0px' },0);
						$(this).css({left:-$$.state.winWidth});
						$(this).hide();
					});
					$(params.offscreenId).transition({ x: '-'+$$.state.winWidth+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ x: '0px' },0);
						$(this).css({left:0});
						$$.transition.onComplete(params);
					});
					break;
					
				case 'shoveRight':
				
					$(params.onscreenId).css({left:0,top:0});
					$(params.offscreenId).css({left:-$$.state.winWidth,top:0});

					$(params.onscreenId).transition({ x: $$.state.winWidth+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ x: '0px' },0);
						$(this).css({left:$$.state.winWidth});
						$(this).hide();
					});
					$(params.offscreenId).transition({ x: $$.state.winWidth+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ x: '0px' },0);
						$(this).css({left:0});
						$$.transition.onComplete(params);
					});
					break;
					
				case 'shoveUp':
				
					$(params.onscreenId).css({left:0,top:0});
					$(params.offscreenId).css({left:0,top:$$.state.winHeight});

					$(params.onscreenId).transition({ y: -$$.state.winHeight+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ y: '0px' },0);
						$(this).css({top:-$$.state.winHeight});
						$(this).hide();
					});
					$(params.offscreenId).transition({ y: -$$.state.winHeight+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ y: '0px' },0);
						$(this).css({top:0});
						$$.transition.onComplete(params);
					});
					break;
					
				case 'shoveDown':
				
					$(params.onscreenId).css({left:0,top:0});
					$(params.offscreenId).css({left:0,top:-$$.state.winHeight});

					$(params.onscreenId).transition({ y: $$.state.winHeight+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ y: '0px' },0);
						$(this).css({top:$$.state.winHeight});
						$(this).hide();
					});
					$(params.offscreenId).transition({ y: $$.state.winHeight+'px' },params.duration,'cubic-bezier(.72,.48,.62,.82)',function()
					{
						$(this).transition({ y: '0px' },0);
						$(this).css({top:0});	
						$$.transition.onComplete(params);
					});
					break;
			}
		},
		
		onComplete : function(params)
		{
			$('#ddUiBlocker').remove();
			
			if ( typeof params.callback == 'function' )
			{
				params.callback(params);
			}
		}
	}
})