var __traceSeq = 0;
var __runTrace = false;
	
function trace(str) 
{ 
	if ( __runTrace && typeof console != 'undefined' )
	{
		console.log((++__traceSeq)+': '+str);
	}
}

$$.hooks={run:function(){},globalHook:function(){}};

var __ddHookPollTimeOut = 0;  // Start very fast so everythign loads quick, then to 250 after init
var __ddHookPollIsRunning = false;

function processHookQueue()
{
	__ddHookPollIsRunning = true;
	setTimeout(function()
	{
		if ( $$.hooks.hookQueue[0] !== undefined )
		{
			var curHook = $$.hooks.hookQueue.shift();				
			$$.hooks[curHook.type][curHook.hook](curHook.thingKey,curHook.thing,curHook.myPath);
		}
		processHookQueue();
	},__ddHookPollTimeOut);
}

$$
({
	hooks :
	{
		hookQueue : [],
		
		// Could be used to alter every function e.g add a profiler
		globalHook : function (thingKey,thing,myPath)
		{
			//trace(myPath);
		},
		
		run : function(thingKey,thing,myPath)
		{
			// Start the hookQueue processing
			if ( __ddHookPollIsRunning === false )
			{
				processHookQueue()
			}
			
			if ( myPath.indexOf('$$.hooks') > -1 )
			{
				return;	
			}

			for ( var hook in $$.hooks.wildcard )
			{
				if ( thingKey.substr(0,hook.length) == hook )
				{
					$$.hooks.hookQueue.push
					({
						type : 'wildcard',
						hook : hook,
						thingKey : thingKey,
						thing : thing,
						myPath : myPath
					});
				}				
			}
			
			for ( var hook in $$.hooks.name )
			{
				if ( thingKey == hook )
				{
					$$.hooks.hookQueue.push
					({
						type : 'name',
						hook : hook,
						thingKey : thingKey,
						thing : thing,
						myPath : myPath
					});
				}				
			}
		},
				
		wildcard :
		{
			// Execute do_*
			do_ : function(thingKey,thing,myPath)
			{
				if ( typeof thing == 'function')
				{
					thing();
				}
			}
		},
		
		name :
		{
			// Insert CSS files into the dom
			css_files : function(thingKey,thing,myPath)
			{
				for ( var file in thing )
				{

					$('body').append("<link href='"+$$.state.kernalRoot+thing[file]+"' rel='stylesheet' type='text/css'>");	
				}
			},
			
			// Insert JavaScript files into the dom
			js_files : function(thingKey,thing,myPath)
			{
				for ( var file in thing )
				{
					$.get($$.state.kernalRoot+thing[file],function(){},'script');
				}
			}
		}
	}
})