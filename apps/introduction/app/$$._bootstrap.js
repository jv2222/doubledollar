var date = new Date;
var noCache = '?'+date.getTime();

head.js
(
	// jQuery
	'$$/lib/underscore-min.js'+noCache,
	'$$/lib/jquery/jquery-1.7.1.min.js'+noCache,
	'$$/lib/jquery/jquery-ui-1.8.18.custom.min.js'+noCache,
	'$$/lib/jquery/jquery.hashchange.js'+noCache,
	'$$/lib/jquery/jquery.scrollTo-1.4.3.1-min.js'+noCache,
	
	// DoubleDollar
	'$$/$$.js'+noCache,
	'$$/$$.(hooks).js'+noCache,
	'$$/$$.(core).js'+noCache,
	'$$/add-ons/client/$$.(router).js'+noCache,
	'$$/add-ons/client/$$.(bindings).js'+noCache,
	'$$/add-ons/client/$$.content/$$.content.js'+noCache,
	
	// *** Your custom app ***
	'apps/introduction/app/$$.home.js'+noCache,
	
	function()
	{
		$$.startRouter();
	}
);