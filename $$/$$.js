// DoubleDollar Kernal - v0.1b by Justin Vincent, http://justinvincent.com
(
	function(window)
	{
		window.$$ = function(thing,myParent,myKey,myPath)
		{
			var myParent = ( typeof myParent == 'undefined' ? $$ : myParent);
			var myPath = ( typeof myPath == 'undefined' ? '$$' : myPath+'.'+myKey);
			
			$$.hooks.globalHook(myKey,thing,myPath);

			if ( typeof myKey == 'string' && ( typeof thing == 'boolean' || typeof thing == 'function' || typeof thing == 'string' || typeof thing == 'number' ) )
			{
				myParent[myKey] = thing;
				$$.hooks.run(myKey,thing,myPath);
			}
			else if ( typeof thing == 'object' )
			{
				if ( typeof myKey == 'string' )
				{
					if ( typeof myParent[myKey] == 'undefined' )
					{
						myParent[myKey] = thing;
					}

					$$.hooks.run(myKey,thing,myPath);
					
					if ( typeof thing.__construct != 'undefined' )
					{
						var overdubbed = thing.__construct;
						for ( var prop in thing )
						{
							overdubbed[prop] = thing[prop];
						}
						myParent[myKey] = overdubbed;	
					}
				}
				
				for ( var prop in thing )
				{
					$$(thing[prop],( typeof myKey == 'string' ? myParent[myKey] : myParent ), prop, myPath);
				}
			}
		}
	}
)
(window);