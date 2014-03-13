$$
({
	textExpander :
	{
		
		state :
		{
			curArea : false,
			areas : {}
		},
		
		__construct : function(jqSelector)
		{
			$$.textExpander.initTextareas(jqSelector);			
			$$.textExpander.bindTexareas(jqSelector);

			if ( $('#testTextarea').length == 0 )
			{
				$('#body').append('<pre style="position: absolute; margin-top: -1000000px;" id="testTextarea"></pre>');
			}
			
		},
		
		initTextareas : function(jqSelector)
		{
			var areaNum = 0;
			$(jqSelector).each(function()
			{
				areaNum++;
				$(this).attr('data-area-num',areaNum).attr('id', 'areaNum' + areaNum);
			});

			setTimeout(function()
			{
				$(jqSelector).each(function()
				{
					$$.textExpander.initTextareasResize(areaNum);
				});
			},100);
		},
		
		bindTexareas : function(jqSelector)
		{
			$(jqSelector).bind('keyup',function()
			{
				$$.textExpander.doResize(this);
			});
			
			$(jqSelector).bind('keydown',function(event)
			{
				if ( event.keyCode == 13 && $(this).val().indexOf('\n') > -1 )
				{
					var origHeight = $(this).height();
					$(this).height(origHeight+20);
				}
				// For a paste
				else if ( ( event.metaKey || event.ctrlKey ) && event.keyCode == 86 )
				{
					var origThis = this;
					$$.textExpander.doResize(this);
				
					setTimeout(function()
					{
						$(origThis).trigger('change');
					},1000);
				}
			});
		},

		initTextareasResize : function(areaNum)
		{
			// get out of this whole process
			if ( areaNum < 0 )
			{
				return;
			}
			var textArea = $('#areaNum'+areaNum);
			$$.textExpander.doResize(textArea,areaNum);
		},
		
		doResize : function(origTexarea,areaNum)
		{
					
			var areaId = $(origTexarea).attr('data-area-num');

			if ( $$.textExpander.state.areas[areaId] === undefined )
			{
				$$.textExpander.state.areas[areaId] = {};
				$$.textExpander.state.areas[areaId].curHeight = 0;
				$$.textExpander.state.areas[areaId].areaId = areaId;
				$$.textExpander.state.areas[areaId].css = {};
				$$.textExpander.state.areas[areaId].css.width = $(origTexarea).width()+'px';

				var cloneCSSProperties = 
				[
			        'lineHeight', 'textDecoration', 'letterSpacing',
			        'fontSize', 'fontFamily', 'fontStyle', 
			        'fontWeight', 'textTransform', 'textAlign', 
			        'direction', 'wordSpacing', 'fontSizeAdjust', 
			        'wordWrap', 'word-break',
			        'borderLeftWidth', 'borderRightWidth',
			        'borderTopWidth','borderBottomWidth',
			        'paddingLeft', 'paddingRight',
			        'paddingTop','paddingBottom',
			        'boxSizing', 'webkitBoxSizing', 
			        'mozBoxSizing', 'msBoxSizing'
			    ];

			    for ( var i in cloneCSSProperties )
				{
					$$.textExpander.state.areas[areaId].css[cloneCSSProperties[i]] = $(origTexarea).css(cloneCSSProperties[i]);
				}
			}
			
			if ( areaId != $$.textExpander.state.curArea )
			{
				$$.textExpander.state.curArea = areaId;
				$('#testTextarea').css($$.textExpander.state.areas[areaId].css);
			}

			var origHeight = $(origTexarea).height();
			var testHeight = $('#testTextarea').text($(origTexarea).val()+'x').height();
						
			if ( testHeight +20 > origHeight )
			{
				var extraHeight = 0;
				if ( testHeight > 0 )
				{
					extraHeight = Math.round((testHeight / 500) * 25);
				}

				$(origTexarea).height(testHeight+extraHeight);
			}
			else
			{
				$(origTexarea).height(testHeight+20);
			}

			if ( areaNum !== undefined ) 
			{
				areaNum--;
				$$.textExpander.initTextareasResize(areaNum);
			}
		}
	}
})