$$
({
	phoneGap :
	{
		
		initCallback : function() {},	
		
		init : function(initCallback)
		{
			
			if ( typeof initCallback == 'function' )
			{
				$$.phoneGap.initCallback = function()
				{
					$('.phoneGapWrapper').css('opacity',1);
					initCallback(); // Needs to call - navigator.splashscreen.hide();
				}
			}
			else
			{
				$$.phoneGap.initCallback = function()
				{
					$('.phoneGapWrapper').css('opacity',1);
					navigator.splashscreen.hide();
				}
			}
			
			// Get a handle on the file system
			if ( typeof LocalFileSystem != 'undefined' )
			{
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $$.phoneGap.do.registerFileSystem, null);
			}
			else
			{
				$$.phoneGap.initCallback();
			}
		},

		do :
		{
			registerFileSystem : function(fileSystem)
			{
				// $$.phoneGap.fs.root
				// $$.phoneGap.fs.root.name
				// $$.phoneGap.fs.root.fullPath
				$$.phoneGap.fs = fileSystem;
				
				$$.phoneGap.initCallback();
			}
		},

		file :
		{
			
			delete : function(filePath)
			{
				$$.phoneGap.fs.root.getFile
				(
					filePath, 
					
					{create: false},
					
					// Success
					function(fileEntry)
					{
						fileEntry.remove
						(
							function()
							{
								// Success
							},
							function()
							{
								// Fail
							}
						);
					},
					
					// Fail
					function(error)
					{
						console.log(error);
					}
				);
			},

			/*			
				$$.phoneGap.file.write
				({
					filePath : $$.phoneGap.fs.root.fullPath+'/test.html,
					fileContents: 'Hello World'
				});
			*/

			write : function(params)
			{
				
				$$.phoneGap.fs.root.getFile
				(
					params.filePath, 
					
					{create: true},
					
					// Success
					function(fileEntry)
					{

						fileEntry.createWriter
						(
							// Success
							function(writer)
							{
								
								writer.onwrite = function(evt) 
								{
									// Success
        						};
								
								writer.write(params.fileContents);
							},
							
							// Fail
							function(error)
							{
								console.log(error);
							}
						);
					},
					
					// Fail
					function(error)
					{
						console.log(error);
					}
				);
			},

			/*
				$$.phoneGap.file.download
				({
					fromUrl : 'https://itunes.apple.com/us/app/shazam/id284993459?mt=8',
					toPath : $$.phoneGap.fs.root.fullPath+'/test.html,
					callbackSuccess : function(entry)
					{
						alert('Boo!');
					},
					callbackError : function(error)
					{
						alert(error.source);
						alert(error.target);
						alert(error.code);
					}
				});
			*/
			
			download : function(params)
			{
				var fileTransfer = new FileTransfer();
				fileTransfer.download
				(
					encodeURI(params.fromUrl),
					params.toPath,
					function(entry) 
					{
						if ( typeof params.callbackSuccess == 'function' )
						{
							params.callbackSuccess(entry);
						}
					},
					function(error) 
					{
						if ( typeof params.callbackError == 'function' )
						{
							params.callbackError(error);
						}
						
					}
				);
			},
			
			/*
				$$.phoneGap.file.move
				({
					fromPath : $$.phoneGap.fs.root.fullPath+'/test.html,
					toDirHandle : $$.phoneGap.photoDir,
					callbackSuccess : function(entry)
					{
						alert('Boo!');
					},
					callbackError : function(error)
					{
						alert(error.source);
						alert(error.target);
						alert(error.code);
					}
				});
			*/
			
			move : function(params)
			{
								
				// Get file entry fromPath
				window.resolveLocalFileSystemURI
				(
					params.fromPath,
					function(fileEntry) // success
					{
						fileEntry.moveTo
						(
							params.toDirHandle,
							params.toName,
							function(newEntry) 
							{
								// Success 
								if ( typeof params.callbackSuccess == 'function' )
								{
									params.callbackSuccess(newEntry);
								}
							}, 
							function(error) 
							{
								// Fail
								if ( typeof params.callbackError == 'function' )
								{
									params.callbackError(newEntry);
								}
							}
						);
					}, 
					function() 
					{
						// Fail
					}
				);
			}	
		}
	}
})