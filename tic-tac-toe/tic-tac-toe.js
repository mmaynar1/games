var winConditions = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
var squareCount = 9;
var squares = document.getElementsByClassName("square");
var difficulty = "moron";
var gameOver = false;

var setMessageBox = function( caption )
{
	var messageBox = document.getElementById( "messageBox" );
    messageBox.innerHTML = caption;
};

var findClaimedSquares = function( marker )
{
	var claimedSquares = [];
	var value;

	for( var id = 0; id < squareCount; id++ )
	{
		value = document.getElementById( id ).innerHTML;
		if( value === marker )
		{
			claimedSquares.push(id);
		}
	}

	return claimedSquares;
}

var resetGame = function()
{
	gameOver = false;
	setMessageBox( "Pick a square!" );

	for( var id = 0; id < squareCount; id++ )
	{
		var square = document.getElementById( id );
		square.innerHTML = "";
		square.style.backgroundColor = "rgb(102, 178, 255)";
	}
}

var checkForWinCondition = function( marker )
{
	var claimedSquares = findClaimedSquares( marker );

	var win = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		win = winConditions[i].every( element => claimedSquares.indexOf( element ) > -1 );
		if( win )
		{
			win = winConditions[i];
			break;
		}
	}
	return win;
};

var secureWin = function()
{
	return makeMove( "O" );
}

var preventDefeat = function()
{
	return makeMove( "X" );
}

var makeMove = function( marker )
{
	var moveMade = false;
	for( var i = 0; i < winConditions.length; i++ )
	{
		var count = 0;
		for( var j = 0; j < winConditions[i].length; j++ )
		{
			if(  marker === document.getElementById( winConditions[i][j] ).innerHTML )
			{
				count++;
			}
		}

		if( count == 2 )
		{
			for( j = 0; j < winConditions[i].length; j++ )
			{
				var square = document.getElementById( winConditions[i][j] )
				if( squareIsOpen( square ) )
				{
					square.innerHTML = "O";
					moveMade = true;
					break;
				}
			}
		}

		if( moveMade )
		{
			break;
		}
	}
	return moveMade;
}

var opponentMove = function()
{
	if( difficulty === "moron" )
	{
		makeMoveAtFirstAvailableSquare();
	}
	else
	{
		var moveMade = secureWin()
		if( !moveMade )
		{
			moveMade = preventDefeat();
			if( !moveMade )
			{
				var center = document.getElementById( 4 );
				if( squareIsOpen( center  ) )
				{
					center.innerHTML = "O";
				}
				else
				{
					makeMoveAtFirstAvailableSquare();
				}
			}
		}
	}
}

var makeMoveAtFirstAvailableSquare = function()
{
	for( var id = 0; id < squareCount; id++ )
	{
		square = document.getElementById( id );
		if( squareIsOpen( square ) )
		{
			square.innerHTML = "O";
			break;
		}
	}
}

var squareIsOpen = function( square )
{
	return ( square.innerHTML !== "X" && square.innerHTML !== "O" );
}

var highlightWinningSquares = function( winningSquares, color )
{
	for( var i = 0; i < winningSquares.length; i++ )
	{
		document.getElementById( winningSquares[i] ).style.backgroundColor = color;
	}
}

var checkForDraw = function()
{
	var draw = true;
	for( var id = 0; id < squareCount; id++ )
	{
		if( squareIsOpen( document.getElementById( id ) ) )
		{
			draw = false;
			break;
		}
	}
	return draw;
}

var chooseSquare = function() 
{
	difficulty = document.getElementById("difficulty").value;
	if( !gameOver )
	{
		setMessageBox( "Pick a square!" );
	    var id = this.getAttribute("id");
	    var square = document.getElementById( id );
	    if( squareIsOpen( square ) ) 
	    {
	    	square.innerHTML = "X";
	    	var win = checkForWinCondition( "X" );
	    	if( !win )
	    	{
	    		opponentMove();
	    		var lost = checkForWinCondition( "O" );
	    		if( !lost)
	    		{
	    			var draw = checkForDraw();
	    			if( draw )
	    			{
	    				gameOver = true;
	    				setMessageBox( "It's a draw!" );
	    			}
	    		}
	    		else
	    		{
	    			gameOver = true;
	    			highlightWinningSquares( lost, "rgb(229, 55, 55)" );
	    			setMessageBox( "You lost!" );
	    		}
	    	}
	    	else
	    	{
	    		gameOver = true
	    		highlightWinningSquares( win, "rgb(42, 178, 72)" );
	    		setMessageBox( "You won!" );
	    	}

	    }
	    else
	    {
	    	setMessageBox( "That square is already taken!" );
	    }
	}
};


for (var i = 0; i < squares.length; i++) 
{
    squares[i].addEventListener('click', chooseSquare, false);
}
