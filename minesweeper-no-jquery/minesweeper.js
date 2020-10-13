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
		$('#' + row + "" + column ).css('background-image', 
										'radial-gradient(#fff,#e6e6e6)');
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
				$('#messageBox').text('You Win!').css({'color': 'white',
													   'background-color': 'green'});
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
		if( ctrlIsPressed )
		{
			handleCtrlClick( id );
		}
		else
		{
			let cell = board[id];
			let cellElement = document.getElementById( id );
			if( !cell.opened )
			{
				if( !cell.flagged )
				{
					if( cell.mined )
					{
						loss();		
						cellElement.innerHTML =  MINE;
						cellElement.style.color = "red";
					}
					else
					{
						cell.opened = true;
						if( cell.neighborMineCount > 0 )
						{
							let color = getNumberColor( cell.neighborMineCount );
							cellElement.innerHTML = cell.neighborMineCount;
							cellElement.style.color = color;
						}
						else
						{
							cellElement.innerHTML = "";
							cellElement.style.backgroundImage = 'radial-gradient(#e6e6e6,#c9c7c7)';
							let neighbors = getNeighbors( id );
							for( let i = 0; i < neighbors.length; i++ )
							{
								var neighbor = neighbors[i];
								if(  typeof board[neighbor] !== 'undefined' &&
									 !board[neighbor].flagged && !board[neighbor].opened )
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
}

let handleCtrlClick = function( id )
{
	let cell = board[id];
	if( cell.opened && cell.neighborMineCount > 0 )
	{
		let neighbors = getNeighbors( id );
		let flagCount = 0;
		let flaggedCells = [];
		let neighbor;
		for( let i = 0; i < neighbors.length; i++ )
		{
			neighbor = board[neighbors[i]];
			if( neighbor.flagged )
			{
				flaggedCells.push( neighbor );
			}
			flagCount += neighbor.flagged;
		}

		let lost = false;
		if( flagCount === cell.neighborMineCount )
		{
			for( let i = 0; i < flaggedCells.length; i++ )
			{
				if( flaggedCells[i].flagged && !flaggedCells[i].mined )
				{
					loss();
					lost = true;
					break;
				}
			}

			if( !lost )
			{
				for( let i = 0; i < neighbors.length; i++ )
				{
					neighbor = board[neighbors[i]];
					if( !neighbor.flagged && !neighbor.opened )
					{
						ctrlIsPressed = false;
						handleClick( neighbor.id );
					}
				}
			}
		}
	}
}

let handleRightClick = function( id )
{
	if( !gameOver )
	{
		let cell = board[id];
		let cellElement = document.getElementById( id );
		if( !cell.opened )
		{
			if( !cell.flagged && minesRemaining > 0 )
			{
				cell.flagged = true;
				cellElement.innerHTML = FLAG;
				cellElement.style.color = "red";
				minesRemaining--;
			}
			else if( cell.flagged )
			{
				cell.flagged = false;
				cellElement.innerHTML = "";
				cellElement.style.color  = "black";
				minesRemaining++;
			}

            let minesRemainingElement = document.getElementById( "mines-remaining" );
            minesRemainingElement.innerText = minesRemaining
		}
	}
}

let loss = function()
{
	gameOver = true;
	let messageBox = document.getElementById("messageBox");
	messageBox.innerText = "Game Over!";
	messageBox.style.color = "white";
	messageBox.style.backgroundColor = "red";
	let cells = Object.keys(board);
	for( let i = 0; i < cells.length; i++ )
	{
		if( board[cells[i]].mined && !board[cells[i]].flagged )
		{
		    let cellElement = document.getElementById( board[cells[i]].id );
		    cellElement.innerHTML = MINE;
		    cellElement.style.color = "black";
		}
	}
	clearInterval(timeout);
}

let randomlyAssignMines = function( board, mineCount )
{
	let mineCoordinates = [];
	for( let i = 0; i < mineCount; i++ )
	{
		let randomRowCoordinate = getRandomInteger( 0, boardSize );
		let randomColumnCoordinate = getRandomInteger( 0, boardSize );
		let cell = randomRowCoordinate + "" + randomColumnCoordinate;
		while( mineCoordinates.includes( cell ) )
		{
			randomRowCoordinate = getRandomInteger( 0, boardSize );
			randomColumnCoordinate = getRandomInteger( 0, boardSize );
			cell = randomRowCoordinate + "" + randomColumnCoordinate;
		}
		mineCoordinates.push( cell );
		board[cell].mined = true;
	}
	return board;
}

let calculateNeighborMineCounts = function( board, boardSize )
{
	let cell;
	let neighborMineCount = 0;
	for( let row = 0; row < boardSize; row++ )
	{
		for( let column = 0; column < boardSize; column++ )
		{
			let id = row + "" + column;
			cell = board[id];
			if( !cell.mined )
			{
				let neighbors = getNeighbors( id );
				neighborMineCount = 0;
				for( let i = 0; i < neighbors.length; i++ )
				{
					neighborMineCount += isMined( board, neighbors[i] );
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}
	return board;
}

let getNeighbors = function( id )
{
	let row = parseInt(id[0]);
	let column = parseInt(id[1]);
	let neighbors = [];
	neighbors.push( (row - 1) + "" + (column - 1) );
	neighbors.push( (row - 1) + "" + column );
	neighbors.push( (row - 1) + "" + (column + 1) );
	neighbors.push( row + "" + (column - 1) );
	neighbors.push( row + "" + (column + 1) );
	neighbors.push( (row + 1) + "" + (column - 1) );
	neighbors.push( (row + 1) + "" + column );
	neighbors.push( (row + 1) + "" + (column + 1) );

	for( let i = 0; i < neighbors.length; i++)
	{ 
	   if ( neighbors[i].length > 2 ) 
	   {
	      neighbors.splice(i, 1); 
	      i--;
	   }
	}

	return neighbors
}

let getNumberColor = function( number )
{
	let color = 'black';
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

let isMined = function( board, id )
{	
	let cell = board[id];
	let mined = 0;
	if( typeof cell !== 'undefined' )
	{
		mined = cell.mined ? 1 : 0;
	}
	return mined;
}

let getRandomInteger = function( min, max )
{
	return Math.floor( Math.random() * ( max - min ) ) + min;
}

let newGame = function( boardSize, mines )
{
    let timeElement = document.getElementById("time");
    timeElement.innerText = "0";

    let messageBoxElement = document.getElementById("messageBox");
    messageBoxElement.innerText = "Make a Move!";
    messageBoxElement.style.color = "rgb(255, 255, 153)";
    messageBoxElement.style.backgroundColor = "rgb(102, 178, 255)";

	minesRemaining = mines;
	let minesRemainingElement = document.getElementById("mines-remaining");
	minesRemainingElement.innerText = minesRemaining;

	gameOver = false;
	initializeCells( boardSize );
	board = Board( boardSize, mines );
	timer = 0;
	clearInterval(timeout);
	timeout = setInterval(function () {
    // This will be executed after 1,000 milliseconds
    timer++;
    if( timer >= 999 )
    {
    	timer = 999;
    }
    timeElement.innerText = timer;
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

$(document).keydown(function(event){
    if(event.ctrlKey)
        ctrlIsPressed = true;
});

$(document).keyup(function(){
    ctrlIsPressed = false;
});

var ctrlIsPressed = false;
var board = newGame( boardSize, mines );

$('#new-game-button').click( function(){
	board = newGame( boardSize, mines );
})
