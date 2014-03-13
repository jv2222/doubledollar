$$
({
	home :
	{
		route :
		{
			default : function()
			{
				$('body').html
				(
					'<h1>Hello World</h1>'+
					'<p>The code is here ~ <a href="app/$$.home.js" target="_blank">$$.home.js</a></p>'
				);
			}
		}
	}
})