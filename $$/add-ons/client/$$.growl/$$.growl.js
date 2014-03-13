$$
({
	css_files : 
	[
		'$$/add-ons/client/$$.growl/growl.css'
	],
	
	js_files : 
	[
		'$$/add-ons/client/$$.growl/jquery.gritter.js'
	],
	
	growl : function(params)
	{
		if ( typeof params == 'string' )
		{
			params = { message: params };
		}

		$.gritter.add
		({
			title: 'System Message',
			text: params.message,
			sticky:params.sticky!==undefined&&params.sticky===true?true:false,
			time:params.time!==undefined?params.time*1000:5000
		});
	}
})