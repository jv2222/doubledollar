$$
({
	content :
	{
		cache : {},
		
		css_files : 
		[
			'$$/add-ons/client/$$.content/loader.css'
		],

		showLoader : function(targetDiv,message)
		{
			$(targetDiv).html($$.content.getLoader(message))
		},
		
		getLoader : function(message)
		{
			message = (message !== undefined ? message : 'Loading...');
			var html =
			'<div class="loader">'+
				'<div class="message">'+message+'</div>'+
				'<div class="ball"></div>'+
			'</div>';
			return html;
		},
		
		loadPage : function(options)
		{

			if ( options.noCache === undefined && $$.content.cache[options.pagePath] !== undefined )
			{
				$(options.targetDiv).html($$.content.cache[options.pagePath]);
				
				if ( typeof options.callback == 'function' )
				{
					options.callback();
				}
				
				return;
			}
			
			$(options.targetDiv).html('');
			
			$$.content.showLoader(options.targetDiv,options.message);

			$(options.targetDiv).load(options.pagePath,function(loadedContent,textStatus,xhr)
			{
				if ( textStatus == 'error' )
				{
					var pageNotFoundMsg = xhr.status + " " + xhr.statusText;
					if ( options.pageNotFoundMsg !== undefined )
					{
						pageNotFoundMsg = options.pageNotFoundMsg;
					}
					$(options.targetDiv).html(pageNotFoundMsg);
				}
				else
				{				
					$$.content.cache[options.pagePath] = loadedContent;
					
					if ( typeof options.callback == 'function' )
					{
						options.callback();
					}
					
				}
			});
		}
	}
})