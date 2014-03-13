$$
({
	home :
	{	
		route :
		{
			defaultOnly : true,
			
			default : function(routingParams)
			{
	
				if ( routingParams.hash === undefined )
				{
					routingParams.hash = 'welcome';
				}
				
				if ( $('a[name="hash:'+routingParams.hash+'"]').length == 0 )
				{
					$$.goURL("./");
				}
				
				// Nice scrolling speed no matter how far/close the content is
				var scrollTop = Math.abs($('#content').scrollTop());
				var hashY = $$.yPos('a[name="hash:'+routingParams.hash+'"]')+scrollTop;
				var scrollSpeed = Math.round(Math.max(scrollTop,hashY) - Math.min(scrollTop,hashY))*.9;
	
				// Let's scroll it
				if ( scrollSpeed <= 4000 )
				{
					$('#content').css({opacity:1});
					$('#content').scrollTo('a[name="hash:'+routingParams.hash+'"]',Math.min(2000,scrollSpeed), {axis:'y'} );
				}
				// Too far, let's fade it
				else
				{
					$('#content').css({opacity:0});
					$('#content').scrollTo('a[name="hash:'+routingParams.hash+'"]',0, {axis:'y'} );
					$('#content').animate({opacity:1},250);
				}
			}
		},
		
		bind :
		{
			do_bindResizeContent : function()
			{
				$$.home.ui.resizeContent();
				$$.home.ui.setMinContentHeight();
				
				$(window).resize(function() 
				{
					$$.home.ui.resizeContent();
				});
			}
		},
		
		ui :
		{
			resizeContent : function()
			{
				$('#body #content').css({height:$$.state.winHeight-260});
			},
			
			setMinContentHeight : function()
			{
				$('#body #content').css({minHeight:$('#body #nav').height()});
			}
		}
	}
})