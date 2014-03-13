$$
({
	home :
	{
		route :
		{
			default : function()
			{
				$$.home.ui.drawCalculator();
				$$.home.bind.buttons();
			}
		},
		
		ui :
		{
			drawCalculator : function()
			{
				$('body').html($$.home.tpl.main());
			},
			
			updateDisplay : function()
			{
				var displayNumber = $$.home.ui.makeCommaNumber($$.home.calculator.state.curVal);
				$('#display .value').html(displayNumber);
				$$.home.ui.resizeFont(displayNumber.length);
			},
			
			makeCommaNumber : function (x) 
			{
				var x = $$.home.calculator.state.curVal;
    				var parts = x.toString().split(".");
    				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    				return parts.join(".");
			},
			
			resizeFont : function(numDigits)
			{
				for ( var i = 1; i<30; i++)
				{
					$('#display .value').removeClass("numDigits"+i);
				}
				$('#display .value').addClass("numDigits"+numDigits);	
			}
		},
		
		bind : 
		{
			buttons : function()
			{
				$$.click('button',function(event,touchedThis)
				{
					var buttonValue = $(touchedThis).text();
					var buttonType = $(touchedThis).attr('class');
					
					switch ( buttonType )
					{
						case 'number':
						case 'number zero':
							$$.home.calculator.addDigit(buttonValue);
							break;
							
						case 'operation':
							$$.home.calculator.runOperation(buttonValue,touchedThis);
							break;
							
						case 'equals':
							$$.home.calculator.runEquals();
							break;
							
						case 'memory':
							$$.popup.alert("This feature doesn't work... but we got to show you a popup instead ;) Try dragging it.");
							break;
					}
				});
			}
		},
								
		tpl :
		{
			main : function()
			{
				var buttons = $$.home.tpl.buttonData();
				return $$.home.tpl.body
				(
					$$.home.tpl.display()+
					$$.home.tpl.row($$.home.tpl.buttons(buttons.line1))+
					$$.home.tpl.row($$.home.tpl.buttons(buttons.line2))+
					$$.home.tpl.row($$.home.tpl.buttons(buttons.line3))+
					$$.home.tpl.row($$.home.tpl.buttons(buttons.line4))+
					$$.home.tpl.row
					(
						$$.home.tpl.row($$.home.tpl.buttons(buttons.line7),'right')+
						$$.home.tpl.row
						(
							$$.home.tpl.row($$.home.tpl.buttons(buttons.line5))+
							$$.home.tpl.row($$.home.tpl.buttons(buttons.line6))
						)
					)
				);			
			},

			body : function(html)
			{
				return '<div id="body">'+html+'</div>';
			},

			row : function(html,rowClass)
			{
				return '<div class="'+(!_.isUndefined(rowClass)?rowClass:'row')+'">'+html+'</div>';
			},

			buttons : function(buttonData)
			{
				var html = '';
				for ( var i in buttonData )
				{
					html += '<b><button class="'+buttonData[i][0]+'">'+buttonData[i][1]+'</button></b>';
				}
				return html;
			},

			display : function()
			{
				var html =
				'<div id="display">'+
					'<div class="value numDigits1">0</div>'+
				'</div>';
				return html;
			},
			
			buttonData : function()
			{
				var buttons = 
				{
					line1 : [['memory','mc'], ['memory','m+'], ['memory','m-'], ['memory','mr']],
					line2 : [['operation','C'],['operation','+/-'],['operation','/'],['operation','X']],
					line3 : [['number','7'],['number','8'],['number','9'],['operation','-']],
					line4 : [['number','4'],['number','5'],['number','6'],['operation','+']],
					line5 : [['number','1'],['number','2'],['number','3']],
					line6 : [['number zero','0'],['number','.']],
					line7 : [['equals','=']]
				};
				return buttons;
			}
		},

		calculator :
		{
			state :
			{
				curVal : '0',
				workingVal : '',
				inMemory : '0',
				curOperation : '',
				clickedOperation : false,
				maxLength : 30
			},
			
			addDigit : function(digit)
			{
				$$.home.calculator.clearOperation();
				
				var isDot = digit.indexOf('.') > -1;
				
				if ( $$.home.calculator.state.curVal.length >= 20 )
				{
					return;
				}
				else if ( isDot && $$.home.calculator.state.curVal.indexOf('.') > -1 )
				{
					return;
				}
				else if ( $$.home.calculator.state.curVal == '0' && ! isDot )
				{
					$$.home.calculator.state.curVal = digit;
				}
				else
				{
					$$.home.calculator.state.curVal += digit;
				}
							
				$$.home.ui.updateDisplay();
			},
			
			runOperation : function(operation,touchedThis)
			{					
				switch(operation)
				{
					case 'C':
						$$.home.calculator.clearCalc();
						break;
						
					case '+/-':
						$$.home.calculator.invertNumber();
						break;
												
					default:
						$$.home.calculator.noteOperation(operation,touchedThis);
						break;
				}
			},
			
			clearCalc : function()
			{
				$('#body b').removeClass('selected');
				$$.home.calculator.state.clickedOperation = false;
				$$.home.calculator.state.curOperation = '';
				$$.home.calculator.state.curVal = '0';
				$$.home.calculator.state.workingVal = '';
				$$.home.ui.updateDisplay();
			},
			
			invertNumber : function()
			{
				var curValStr = $$.home.calculator.state.curVal;
				
				if ( curValStr == '0' )
				{
					return;	
				}
				
				if ( curValStr.indexOf('-') > -1 )
				{
					$$.home.calculator.state.curVal = curValStr.substr(1,curValStr.length-1);
				}
				else
				{
					$$.home.calculator.state.curVal = '-'+curValStr;
				}
				$$.home.ui.updateDisplay();
			},
			
			noteOperation : function(operation,touchedThis)
			{
				if ( $$.home.calculator.state.clickedOperation )
				{
					return;	
				}
				$$.home.calculator.runEquals();
				$$.home.calculator.state.curOperation = operation;
				$$.home.calculator.state.clickedOperation = true;
				$(touchedThis).parent().addClass('selected');
			},
			
			runEquals : function()
			{
				
				if ( $$.home.calculator.state.curOperation != '' )
				{
					var newVal = 0;
					var curVal = $$.home.calculator.convertNum($$.home.calculator.state.curVal);
					var workingVal = $$.home.calculator.convertNum($$.home.calculator.state.workingVal);
	
					switch ( $$.home.calculator.state.curOperation )
					{
						case 'X':	
							newVal = workingVal * curVal; 
							break;
						case '/':	
							newVal = workingVal / curVal;
							break;
						case '-':
							newVal = workingVal - curVal;
							break;
						case '+':
							newVal = workingVal + curVal;
							break;
					}
					
					$$.home.calculator.state.curVal = newVal+'';
					$$.home.calculator.state.workingVal = newVal+'';
					$$.home.ui.updateDisplay();
					
					$$.home.calculator.state.clickedOperation = true;
				}

			},
			
			convertNum : function(strNum)
			{
				if ( strNum.indexOf('.') > -1 )
				{
					return parseFloat(strNum);
				}
				return parseInt(strNum);
			},

			clearOperation : function()
			{
				if ( $$.home.calculator.state.curOperation != '' && $$.home.calculator.state.workingVal == '' )
				{
					$$.home.calculator.state.workingVal = $$.home.calculator.state.curVal;
					$$.home.calculator.state.curVal = '0';
					$('#body b').removeClass('selected');
				}
				else if ( $$.home.calculator.state.clickedOperation )
				{
					$$.home.calculator.state.curVal = '0';
					$('#body b').removeClass('selected');
				}
				
				$$.home.calculator.state.clickedOperation = false;
			}
		}
	}
})