$$
({
	home :
	{
		route :
		{
			default : function()
			{

				var drawSpace1 = $$.drawSpace('#canvas1');
								
				drawSpace1.activate(function(data)
				{
					// drawSpace2.drawFromData(data);			
				});
				
				//setTimeout(function()
				//{
					setInterval(function()
					{
						drawSpace1.resample();
					},2000);
				//},5000)

				$('#drawSpace1 .undo').click(function(){drawSpace1.undo();});
				$('#drawSpace1 .redo').click(function(){drawSpace1.redo();});
				$('#drawSpace1 .clear').click(function(){drawSpace1.clear();});
				$('#drawSpace1 .red').click(function(){drawSpace1.setLineColor('#ff0000');});
				$('#drawSpace1 .blue').click(function(){drawSpace1.setLineColor('#0000ff');});
				$('#drawSpace1 .green').click(function(){drawSpace1.setLineColor('#00ff00');});

				var drawSpace2 = $$.drawSpace('#canvas2');
				

				drawSpace2.activate(function(data)
				{
					// Maybe force the canvas to be the size of the recorded one and then resize?
					// @todo - work out scale stuff
					//drawSpace2.drawFromData(data);			
				});
	
				$('#drawSpace2 .undo').click(function(){drawSpace2.undo();});
				$('#drawSpace2 .redo').click(function(){drawSpace2.redo();});
				$('#drawSpace2 .clear').click(function(){drawSpace2.clear();});
				$('#drawSpace2 .red').click(function(){drawSpace2.setLineColor('#ff0000');});
				$('#drawSpace2 .blue').click(function(){drawSpace2.setLineColor('#0000ff');});
				$('#drawSpace2 .green').click(function(){drawSpace2.setLineColor('#00ff00');});

			}
		}
	}
})