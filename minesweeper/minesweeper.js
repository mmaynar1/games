function Cell( row, column, opened, flagged, mined, neighborMineCount ) 
{
	return {
		row: row,
		column: column,	
		opened: opened,
		flagged: flagged,
		mined: mined,
		neighborMineCount: neighborMineCount
	}
}

function Board( boardSize )
{
	var board = {};
	for( var row = 0; row < boardSize; row++ )
	{
		for( var column = 0; column < boardSize; column++ )
		{
			board[row + "" + column] = Cell( row, column, false, false, false, 0 );
		}
	}

	return board;
}


var initializeCells = function( boardSize ) 
{
	var row  = 0;
	var column = 0;
	$( ".cell" ).each( function(){
		$(this).attr( "id", row + "" + column );
		column++;
		if( column >= boardSize )
		{
			column = 0;
			row++;
		}

		$(this).off().click(function(e)
		{
		    alert('click'); // true or false
		});

		$(this).contextmenu(function(e)
		{
		    alert('right click'); // true or false
		    return false;
		});
	})
}

var boardSize = 10;
initializeCells( boardSize );
var board = Board( boardSize );