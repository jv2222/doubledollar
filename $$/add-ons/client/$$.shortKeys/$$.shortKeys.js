$$
({
	shortKeys :
	{
		state :
		{
			debug : false,
			isShiftKey : false,
			isAltKey : false,
			isCtrlKey :  false,
			isModKey :  false
		},
		
		registered : {},
		
		register : function(keyCombo,callback)
		{
			$$.shortKeys.registered[keyCombo] = callback;
		},
		
		init : function()
		{
			$(window).bind('keyup keydown', function(e)
			{
				
				$$.shortKeys.state.isShiftKey = ( e.type == 'keydown' && e.shiftKey ? true : false );
				$$.shortKeys.state.isAltKey   = ( e.type == 'keydown' && e.altKey ? true : false );
				$$.shortKeys.state.isCtrlKey  = ( e.type == 'keydown' && e.ctrlKey ? true : false );
				$$.shortKeys.state.isModKey   = ( e.type == 'keydown' && ( $$.shortKeys.state.isCtrlKey || e.keyCode == 224 ) ? true : false );
				$$.shortKeys.state.keyCode    = ( e.type == 'keydown' ? e.keyCode : false );

				if ( $$.shortKeys.state.debug )
				{
					console.log('KeyCode: '+$$.shortKeys.state.keyCode);
				}

				if ( e.type == 'keydown' )
				{
					// Alt + Shift + Keycode
					if ( $$.shortKeys.state.isAltKey && $$.shortKeys.state.isShiftKey && $$.shortKeys.registered['alt-shift-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['alt-shift-'+e.keyCode](e);
					}
					// Ctl + Shift + Keycode
					else if ( $$.shortKeys.state.isCtrlKey && $$.shortKeys.state.isShiftKey && $$.shortKeys.registered['ctl-shift-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['ctl-shift-'+e.keyCode](e);
					}
					// Ctl + Alt + Keycode
					else if ( $$.shortKeys.state.isCtrlKey && $$.shortKeys.state.isAltKey && $$.shortKeys.registered['ctl-alt-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['ctl-alt-'+e.keyCode](e);
					}
					// Shift + Keycode
					else if ( $$.shortKeys.state.isShiftKey && $$.shortKeys.registered['shift-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['shift-'+e.keyCode](e);
					}
					// Ctl + Keycode
					else if ( $$.shortKeys.state.isCtrlKey && $$.shortKeys.registered['ctl-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['ctl-'+e.keyCode](e);
					}
					// Alt + Keycode
					else if ( $$.shortKeys.state.isAltKey && $$.shortKeys.registered['alt-'+e.keyCode] !== undefined )
					{
						$$.shortKeys.registered['alt-'+e.keyCode](e);
					}
				}
				
			});
		}
	}
})
$$.shortKeys.init();