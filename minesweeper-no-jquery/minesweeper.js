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


let initializeCells = function( boardSize )
{
	let row  = 0;
	let column = 0;
	let cells = document.getElementsByClassName("cell");
    for(let i = 0; i < cells.length; i++)
    {
       let cellElement = cells.item(i);
       cellElement.id = row + "" + column;
       cellElement.style.color = "black";
       cellElement.innerText = "";
       cellElement.style.backgroundImage = "radial-gradient(#fff,#e6e6e6)";

       column++;
       if( column >= boardSize )
       {
           column = 0;
           row++;
       }

       cellElement.removeEventListener('click', listenForClick );
       cellElement.addEventListener('click', listenForClick );

       cellElement.removeEventListener('contextmenu', listenForRightClick );
       cellElement.addEventListener('contextmenu', listenForRightClick );
    }
}

let listenForClick = function(e)
{
   handleClick( e.currentTarget.id );
   let isVictory = true;
   let cells = Object.keys(board);
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
       let messageBoxElement = document.getElementById("messageBox");
       messageBoxElement.innerText = "You Win!";
       messageBoxElement.style.color = "white";
       messageBoxElement.style.backgroundColor = "green";
       clearInterval( timeout );
   }
}

let listenForRightClick = function(e)
{
    e.preventDefault();
    handleRightClick( e.currentTarget.id );
    return false;
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
					    if( firstClick )
					    {
					        preventImmediateLoss(cell);
					    }
					    else
					    {
                            loss();
                            cellElement.innerHTML =  MINE;
                            cellElement.style.color = "red";
						}
					}
					else
					{
					    firstClick = false;
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

let preventImmediateLoss = function( cell )
{
    firstClick = false;
    cell.mined = false;
    let cells = Object.keys(board);
    shuffle(cells);
    for( let i = 0; i < cells.length; i++ )
    {
        if( !board[cells[i]].mined && !board[cells[i]].flagged && !board[cells[i]].opened )
        {
            board[cells[i]].mined = true;
            break;
        }
    }
    board = calculateNeighborMineCounts( board, boardSize );
    handleClick(cell.id);
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

//https://javascript.info/task/shuffle
function shuffle(array)
{
  for (let i = array.length - 1; i > 0; i--)
  {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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
	firstClick = true;
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
let boardSize = 10;
let mines = 10;
let timer = 0;
let timeout;
let minesRemaining;
let firstClick = true;

document.addEventListener('keydown', event => {
     if(event.ctrlKey)
     {
         ctrlIsPressed = true;
     }
});

document.addEventListener('keyup', event => {
     ctrlIsPressed = false;
});

let ctrlIsPressed = false;
var board = newGame( boardSize, mines );

let newGameButton = document.getElementById("new-game-button");
newGameButton.addEventListener("click", function(){
     board = newGame( boardSize, mines );
});
