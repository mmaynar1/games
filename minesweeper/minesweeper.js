function Cell( row, column, opened, flagged, mined, neighborMineCount ) 
{
	return {
		id: row + "" + column,
		row: row,
		column: column,	
		opened: opened,
		flagged: flagged,
		mined: mined,
		neighborMineCount: neighborMineCount
	}
}

function Board( boardSize, mineCount )
{
	var board = {};
	for( var row = 0; row < boardSize; row++ )
	{
		for( var column = 0; column < boardSize; column++ )
		{
			board[row + "" + column] = Cell( row, column, false, false, false, 0 );
		}
	}
	board = randomlyAssignMines( board, mineCount );
	board = calculateNeighborMineCounts( board, boardSize );
	return board;
}


var initializeCells = function( boardSize ) 
{
	var row  = 0;
	var column = 0;
	$( ".cell" ).each( function(){
		$(this).attr( "id", row + "" + column ).css('color', 'black').text("");
		$('#' + row + "" + column ).css('background-image', 'radial-gradient(#fff,#e6e6e6)');
		column++;
		if( column >= boardSize )
		{
			column = 0;
			row++;
		}

		$(this).off().click(function(e)
		{
		    handleClick( $(this).attr("id") );
		    var isVictory = true;
			var cells = Object.keys(board);
			for( var i = 0; i < cells.length; i++ )
			{
				if( !board[cells[i]].mined )
				{
					if( !board[cells[i]].opened )
					{
						isVictory = false;
						break;
					}
				}
			}

			if( isVictory )
			{
				gameOver = true;
				$('#messageBox').text('You Win!').css({'color': 'white', 'background-color': 'green'});
				clearInterval( timeout );
			}
		});

		$(this).contextmenu(function(e)
		{
		    handleRightClick( $(this).attr("id") );
		    return false;
		});
	})
}

var handleClick = function( id )
{
	if( !gameOver )
	{
		var cell = board[id];
		var $cell = $( '#' + id );
		if( !cell.opened )
		{
			if( !cell.flagged )
			{
				if( cell.mined )
				{
					loss( $cell );				
				}
				else
				{
					cell.opened = true;
					if( cell.neighborMineCount > 0 )
					{
						var color = getNumberColor( cell.neighborMineCount );
						$cell.html( cell.neighborMineCount ).css( 'color', color );
					}
					else
					{
						$cell.html( "" ).css( 'background-image', 'radial-gradient(#e6e6e6,#c9c7c7)');
						var neighbors = getNeighbors( id );
						for( var i = 0; i < neighbors.length; i++ )
						{
							var neighbor = neighbors[i];
							if( typeof board[neighbor] !== 'undefined' && !board[neighbor].flagged && !board[neighbor].opened )
							{
								handleClick( neighbor );
							}
						}
					}
				}
			}
		}
	}
}

var handleRightClick = function( id )
{
	if( !gameOver )
	{
		var cell = board[id];
		var $cell = $( '#' + id );
		if( !cell.opened )
		{
			if( !cell.flagged && minesRemaining > 0 )
			{
				cell.flagged = true;
				$cell.html( FLAG ).css( 'color', 'red');
				minesRemaining--;
			}
			else if( cell.flagged )
			{
				cell.flagged = false;
				$cell.html( "" ).css( 'color', 'black');
				minesRemaining++;
			}

			$( '#mines-remaining').text( minesRemaining );
		}
	}
}

var loss = function( $cell )
{
	gameOver = true;
	$('#messageBox').text('Game Over!').css({'color':'white', 'background-color': 'red'});
	var cells = Object.keys(board);
	for( var i = 0; i < cells.length; i++ )
	{
		if( board[cells[i]].mined && !board[cells[i]].flagged )
		{
			$('#' + board[cells[i]].id ).html( MINE ).css('color', 'black');
		}
	}
	$cell.html( MINE ).css( 'color', 'red');
	clearInterval(timeout);
}

var randomlyAssignMines = function( board, mineCount )
{
	var mineCooridinates = [];
	for( var i = 0; i < mines; i++ )
	{
		var randomRowCoordinate = getRandomInteger( 0, boardSize );
		var randomColumnCoordinate = getRandomInteger( 0, boardSize );
		var cell = randomRowCoordinate + "" + randomColumnCoordinate;
		while( mineCooridinates.includes( cell ) )
		{
			randomRowCoordinate = getRandomInteger( 0, boardSize );
			randomColumnCoordinate = getRandomInteger( 0, boardSize );
			cell = randomRowCoordinate + "" + randomColumnCoordinate;
		}
		mineCooridinates.push( cell );
		board[cell].mined = true;
	}
	return board;
}

var calculateNeighborMineCounts = function( board, boardSize )
{
	var cell;
	var neighborMineCount = 0;
	for( var row = 0; row < boardSize; row++ )
	{
		for( var column = 0; column < boardSize; column++ )
		{
			cell = board[row + "" + column];
			if( !cell.mined )
			{
				neighborMineCount = 0;
				neighborMineCount += isMined( board, row - 1, column - 1 );
				neighborMineCount += isMined( board, row - 1, column );
				neighborMineCount += isMined( board, row - 1, column + 1 );
				neighborMineCount += isMined( board, row, column - 1 );
				neighborMineCount += isMined( board, row, column + 1 );
				neighborMineCount += isMined( board, row + 1, column - 1 );
				neighborMineCount += isMined( board, row + 1, column );
				neighborMineCount += isMined( board, row + 1, column + 1 );
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}
	return board;
}

var getNeighbors = function( id )
{
	var row = parseInt(id[0]);
	var column = parseInt(id[1]);
	var neighbors = [];
	neighbors.push( (row - 1) + "" + (column - 1) );
	neighbors.push( (row - 1) + "" + column );
	neighbors.push( (row - 1) + "" + (column + 1) );
	neighbors.push( row + "" + (column - 1) );
	neighbors.push( row + "" + (column + 1) );
	neighbors.push( (row + 1) + "" + (column - 1) );
	neighbors.push( (row + 1) + "" + column );
	neighbors.push( (row + 1) + "" + (column + 1) );

	for( var i = 0; i < neighbors.length; i++)
	{ 
	   if ( neighbors[i].length > 2 ) 
	   {
	      neighbors.splice(i, 1); 
	   }
	}

	return neighbors
}

var getNumberColor = function( number )
{
	var color = 'black';        
	if( number === 1 )
	{
		color = 'blue';
	}
	else if( number === 2 )
	{
		color = 'green';
	}
	else if( number === 3 )
	{
		color = 'red';
	}
	else if( number === 4 )
	{
		color = 'orange';
	}
	return color;
}

var isMined = function( board, row, column )
{	
	var cell = board[row + "" + column];
	var mined = 0;
	if( typeof cell !== 'undefined' )
	{
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}

var getRandomInteger = function( min, max )
{
	return Math.floor( Math.random() * ( max - min ) ) + min;
}

var newGame = function( boardSize, mines )
{
	$('#time').text("0");
	$('#messageBox').text('Make a Move!').css({'color': 'rgb(255, 255, 153)', 'background-color': 'rgb(102, 178, 255)'});
	minesRemaining = mines;
	$( '#mines-remaining').text( minesRemaining );
	gameOver = false;
	initializeCells( boardSize );
	board = Board( boardSize, mines );
	timer = 0;
	clearInterval(timeout);
	timeout = setInterval(function () {
    // This will be executed after 1,000 milliseconds
    timer++;
    $('#time').text(timer);
	}, 1000);

	return board;
}

var FLAG = "&#9873;";
var MINE = "&#9881;";
var boardSize = 10;
var mines = 10;
var timer = 0;
var timeout;
var minesRemaining;
$('#new-game-button').click( function(){
	newGame( boardSize, mines );
})
var board = newGame( boardSize, mines );