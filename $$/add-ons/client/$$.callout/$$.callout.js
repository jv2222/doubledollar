$$
({
		
	callout :
	{

		/*
		$$.callout.open
		({ 
			id : 'myCallout',
			anchor : '#someElement',
			width: 200,
			height: 200,
			left: 500,
			top: 100,
			html : '<b>Hello World</b>', // The HTML inside the callout!
			arrow : 'top', // top, right, bottom, left, undefined (to hide)
		})
		*/
		
		css_files : 
		[
			'$$/add-ons/client/$$.callout/callout.css'
		],
	
		open : function(calloutData)
		{
			var anchorPos = $(calloutData.anchor).offset();
			var extraClass = calloutData.extraClass!==undefined?' '+calloutData.extraClass:'';
			
			var params = 
			{
				html : $$.callout.tpl.emptyCallout(calloutData),
				forceX : anchorPos.left+calloutData.left,
				forceY : anchorPos.top+calloutData.top,
				forceAlpha : 0,
				extraClass : 'calloutPopup'+extraClass, // $$.callout.close('.calloutPopup')
			};
			
			if ( calloutData.ignoreForceIntoView !== undefined && calloutData.ignoreForceIntoView === true )
			{
				params.ignoreForceIntoView = true;
			}
			
			if ( typeof calloutData.close == 'function' )
			{
				params.closeCallback = calloutData.close;
			}
			
			if ( calloutData.overlay === false )
			{
				params.noOverlay = true;
			}
			
			$$.popup.makePopup(params);
		},
		
		tpl :
		{
			emptyCallout : function(calloutData)
			{
				
				var heightStyle = '';
				if ( calloutData.height !== undefined && calloutData.height !== false )
				{
					heightStyle = 'height: '+calloutData.height+'px;';
				}
				
				var arrowPosition = '';
				if ( calloutData.arrow !== undefined )
				{
					arrowPosition = calloutData.arrow;
				}
				
				var html = ''+
				'<div class="callout '+arrowPosition+'" id="'+calloutData.id+'" style="width:'+calloutData.width+'px; '+heightStyle+'" >'+
					calloutData.html+
				'</div>';
				return html;
			}
		}
	}
})