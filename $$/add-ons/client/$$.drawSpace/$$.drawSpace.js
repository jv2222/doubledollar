/*
	var drawSpace = $$.drawSpace('#drawSpace'); // A div NOT a canvas
	
	// Display only
	drawSpace.drawFromData(data);

	// Interactive drawing
	drawSpace.activate(function(data) { console.log(data) });
	drawSpace.setLineColor('#ff0000');
	drawSpace.clear()
	drawSpace.undo()
	drawSpace.redo()
	drawSpace.isUndo() // Use to disable buttons etc.
	drawSpace.isRedo()

*/
$$
({
	// Returns drawSpace object
	drawSpace :
	{
		__construct : function(jqSelector)
		{
			var instance = 
			{
				
				init : function(jqSelector)
				{
					this.data = []; // also used as undo stack
					this.redoStack = [];
					this.undoPoint = 0;
					this.amDrawing = false;
					this.recordData = true;
					this.callback = function() {}
					this.jqSelector = jqSelector;
					this.xScale = 1;
					this.yScale = 1;
					this.curLineColor = '#000000';
					this.initCanvas();
				},
				
				initCanvas : function()
				{
					
					// Log the bounds of this drawing, for auto crop function
					this.minX = 100000;
					this.minY = 100000;
					this.maxX = 0;
					this.maxY = 0;

					// Insert canvas with width and height based on containing div
					this.width = $(this.jqSelector).width();
					this.height = $(this.jqSelector).height();

					$(this.jqSelector).html('<canvas width="'+this.width+'" height="'+this.height+'"></canvas>');
										
					// Get a programatic handle on the cnavas
					this.jqObj = $('canvas',this.jqSelector);
					this.canvas = this.jqObj[0];
					this.context = this.canvas.getContext('2d');
					
					if ( this.undoPoint == 0 )
					{
						// Insert the size of the current canvas, used for scaling when re-drawing
						this.data[0] = [['size',this.width,this.height]];
						this.draw.strokeStyle(this,this.curLineColor);
					}
				},

				drawFromData : function(data)
				{	
					var drawingWidth = data[0][0][1];
					var drawingHeight = data[0][0][2];
		
					this.xScale = this.width/drawingWidth;
					this.yScale = this.height/drawingHeight;
					
					if ( typeof data.length == 'number' && data.length > 1 )
					{
						this.undoPoint = data.length-1;
					}
					
					this.data = $$.clone(data);
					this.ui.paintFromData(this);
					
					// This now establishes this new version of the drawing as base scale
					this.xScale = 1;
					this.yScale = 1;
					this.data[0][0][1] = this.width;
					this.data[0][0][2] = this.height;
				},
				
				resample : function()
				{
					this.initCanvas();
					this.drawFromData(this.data);
					
					if ( typeof this.callback == 'function' )
					{
						this.activate()
					}
				},
				
				activate : function(callback)
				{
					this.bind.touchEvents(this);
					
					if ( typeof callback == 'function' )
					{
						this.callback = callback;
					}
				},
				
				undo : function()
				{
					if ( this.isUndo() )
					{
						this.undoPoint--;
						this.redoStack.push(this.data.pop());
						this.ui.paintFromData(this);
						this.callback(this.data);
					}
				},
				
				isUndo : function()
				{
					return this.undoPoint > 0;
				},
				
				redo : function()
				{
					if ( this.isRedo() )
					{
						this.undoPoint++;
						this.data.push(this.redoStack.pop());
						this.ui.paintFromData(this);
						this.callback(this.data);
					}
				},
				
				isRedo : function()
				{
					return this.redoStack[0] !== undefined;
				},
				
				clear : function()
				{
					this.data = []; // also used as undo stack
					this.redoStack = [];
					this.undoPoint = 0;
					this.amDrawing = false;
					this.recordData = true;
					this.context.clearRect( 0 , 0 , this.width , this.height );
					this.data[0] = [['size',this.width,this.height]];
					this.draw.strokeStyle(this,this.curLineColor);
					this.callback(this.data);
				},
				
				setLineColor : function(hexColor)
				{
					this.draw.strokeStyle(this,hexColor);
					this.callback(this.data);
				},
				
				logMinMaxXY : function(x,y)
				{
					this.minX = Math.min(this.minX,x);
					this.minY = Math.min(this.minY,y);
					this.maxX = Math.max(this.maxX,x);
					this.maxY = Math.max(this.maxY,y);
				},
				
				draw :
				{

					beginPath : function(instance)
					{
						instance.context.beginPath();
						
						if ( instance.recordData )
						{
							instance.data[instance.undoPoint].push(['beginPath']);
						}
						
					},
					
					moveTo : function(instance, x, y)
					{
						instance.logMinMaxXY(x, y);
						instance.context.moveTo(x, y);
						
						if ( instance.recordData )
						{
							instance.data[instance.undoPoint].push(['moveTo',x,y]);
						}
					},
					
					lineTo : function(instance, x, y)
					{
						instance.logMinMaxXY(x, y);
						instance.context.lineTo(x, y);
						
						if ( instance.recordData )
						{
							instance.data[instance.undoPoint].push(['lineTo',x,y]);
						}
					},
					
					stroke : function(instance)
					{
						instance.context.stroke();
						
						if ( instance.recordData )
						{
							instance.data[instance.undoPoint].push(['stroke']);
						}
					},

					strokeStyle : function(instance, strokeStyle)
					{
						instance.curLineColor = strokeStyle;
						instance.context.strokeStyle = strokeStyle;
						
						if ( instance.recordData )
						{
							if ( instance.undoPoint == -1 )
							{
								instance.undoPoint++;
								instance.data[instance.undoPoint] = [];
							}
							instance.data[instance.undoPoint].push(['strokeStyle',strokeStyle]);
						}
					}

				},
				
				ui :
				{
					paintFromData : function(instance)
					{
						instance.recordData = false;
						
						// Clear the canvas
						instance.canvas.width = instance.canvas.width;
						
						if ( instance.data[0] !== undefined )
						{
							for ( var i in instance.data )
							{
								if ( instance.data[i][0] !== undefined )
								{
									for ( var ii in instance.data[i] )
									{
										var command = instance.data[i][ii];
										
										switch ( command[0] )
										{
											case 'beginPath':
												instance.draw.beginPath(instance);
												break;
												
											case 'moveTo':
												
												// Resample
												command[1] = command[1] * instance.xScale;
												command[2] = command[2] * instance.yScale;
												
												instance.draw.moveTo(instance, command[1], command[2]);
												break;
												
											case 'lineTo':
											
												// Resample
												command[1] = command[1] * instance.xScale;
												command[2] = command[2] * instance.yScale;
											
												instance.draw.lineTo(instance, command[1], command[2]);
												break;
												
											case 'stroke':
												instance.draw.stroke(instance);
												break;
												
											case 'strokeStyle':
												instance.draw.strokeStyle(instance,command[1]);
												break;
										}
										
									}
								}
							}
						}
						
						instance.recordData = true;
						
					},
					
					touchStart : function(instance,event)
					{
						// Add a new undo point to the stack
						instance.undoPoint++;
						instance.data[instance.undoPoint] = [];
						instance.redoStack = [];
						
						instance.amDrawing = true;
						
						var pos = instance.ui.getTouchPos(instance, event);
						
						instance.draw.beginPath(instance);
						instance.draw.moveTo(instance, pos.x, pos.y);
						
						event.originalEvent.preventDefault();
						
					},
					
					touchMove : function(instance,event)
					{
						if ( ! instance.amDrawing )
						{
							return;	
						}
						
						var pos = instance.ui.getTouchPos(instance, event);
						
						instance.draw.lineTo(instance, pos.x, pos.y);
						instance.draw.stroke(instance);
						
						event.originalEvent.preventDefault();
					},
					
					touchEnd : function(instance,event)
					{
						if ( ! instance.amDrawing )
						{
							return;	
						}
						
						instance.amDrawing = false;

						var pos = instance.ui.getTouchPos(instance, event);
						
						instance.draw.lineTo(instance, pos.x, pos.y);
						instance.draw.stroke(instance);
						
						instance.callback(instance.data);
						
						event.originalEvent.preventDefault();

					},
					
					getTouchPos : function(instance, event)
					{
						var pos = {x:0, y:0};
				
						if (event.originalEvent && event.originalEvent.touches) 
						{
							var offset     = instance.jqObj.offset();
							var offsetLeft = offset.left;
							var offsetTop  = offset.top;
				            
				            pos = 
				            {
				                x: event.originalEvent.touches[0].pageX - offsetLeft,
				                y: event.originalEvent.touches[0].pageY - offsetTop
				            }
				        } 
				        else 
				        {
				            pos = 
				            {
				                x: event.offsetX,
				                y: event.offsetY
				            }
				        }
				       				        
				        return pos;
					}
				},
				
				bind :
				{
					touchEvents : function(instance)
					{
						$(instance.jqObj).bind("touchstart", function(event) 
						{
				            // if touch detected, remove the mouse handlers
				            $(instance.jqObj).unbind("mousedown").unbind("mousemove").unbind("mouseup");
				            instance.ui.touchStart(instance,event);
						}).bind("mousedown", function(event) 
						{
				            instance.ui.touchStart(instance,event);
		            	}).bind("touchmove mousemove", function(event) 
						{
				            instance.ui.touchMove(instance,event);
		            	}).bind("touchend mouseup", function(event) 
						{
				            instance.ui.touchEnd(instance,event);
		            	});
					}	
				}
			}
			
			instance.init(jqSelector);
			
			return instance;
			
		}		
	}
})