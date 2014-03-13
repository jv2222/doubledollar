$$
({
	db :
	{
		
		/*
			$$.db.connect
			({
				name : 'mealreel',
				version : '1.0',
				displayName : 'MealReel',
				size : 1000000,
				callback : function()
				{
				
				}
			});
		*/
		
		connect : function(params)
		{
			$$.db.dbh = window.openDatabase(params.name, params.version, params.displayName, params.size);

			if ( typeof params.callback == 'function' )
			{
				params.callback($$.db.dbh);
			}
		},
		
		queryStack : [],
		
		/*
			$$.db.query
			({
				sql : 'SELECT * FROM users',
				callbackSuccess : function(data)
				{
					// Draw user list
				},
				callbackError : function(error)
				{
					// Draw user list
				}
			});
		*/
		
		query : function(params)
		{
			$$.db.queryStack.push(params);
			$$.db.processQueryStack();
		},
		
		processQueryStack : function()
		{
			if ( $$.db.queryStack[0] === undefined )
			{
				return;	
			}
			
			var curQuery = $$.db.queryStack.shift();

			$$.db.dbh.transaction
			(
				function(tx)
				{
					tx.executeSql
					(
						curQuery.sql,
						[],
						function(tx, results)
						{
							var resultsArray = [];
							
							if ( results.rows.length > 0 )
							{
								// Populate data set
								for (var i=0; i < results.rows.length; i++)
								{
									resultsArray.push(results.rows.item(i));
								}
							}
							
							var params = 
							{
								tx : tx,
								resultsOrig : results,
								resultsArray : resultsArray
							}
							
							// Success
							if ( typeof curQuery.callbackSuccess == 'function' )
							{
								curQuery.callbackSuccess(params);
							}
						},
						function(error)
						{
							// Error
							if ( typeof curQuery.callbackError == 'function' )
							{
								curQuery.callbackError(error);
							}
						}
					);
				}, 
				function(err)
				{
					// Error
					setTimeout(function()
					{
						$$.db.processQueryStack();
					},100);
				},
				function()
				{
					// Success
					setTimeout(function()
					{
						$$.db.processQueryStack();
					},100);
				}
			);
			
		}
		
	}
})