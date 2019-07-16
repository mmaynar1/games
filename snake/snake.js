const CELL_TYPE = Object.freeze({
	EMPTY: "EMPTY",
	FOOD: "FOOD",
	SNAKE: "SNAKE"
});

let DIRECTION = Object.freeze({
	NONE: "NONE",
	LEFT: "LEFT",
	RIGHT: "RIGHT",
	UP: "UP",
	DOWN: "DOWN"
});

function Cell( row, column, cellType ) 
{
	return {
		row: row,
		column: column,	
		cellType: cellType
	}
}

function Snake( cell, startingLength, board )
{
	let head = cell;
	let snakeParts = [];
	head.cellType = CELL_TYPE.SNAKE;
	snakeParts.push( head );
	for( let i = 0; i < startingLength - 1; i++ )
	{
		let bodyPart = board.cells[head.row + (i + 1) ][head.column];
		bodyPart.cellType = CELL_TYPE.SNAKE;
		snakeParts.push( bodyPart )
	}


	let grow = function() {
		snakeParts.push( head );
	}

	let move = function( nextCell ) {
		let tail = snakeParts.pop();
		tail.cellType = CELL_TYPE.EMPTY;
		head = nextCell;
		head.cellType = CELL_TYPE.SNAKE;
		snakeParts.unshift( head );
	}

	let checkCrash = function( nextCell ) {
		let crashed = snakeParts.some( function( cell ) {
			return ( cell.row === nextCell.row && 
					 cell.column === nextCell.column );
		})

		if( !crashed )
		{
			crashed = nextCell.row <= -1 || 
					  nextCell.column <= -1 || 
					  nextCell.row >= board.rowCount ||
					  nextCell.column >= board.columnCount;
		}

		return crashed;
	}

	return {
		head: head,
		snakeParts: snakeParts,
		grow: grow,
		move: move,
		checkCrash: checkCrash
	}
}

function Board( rowCount, columnCount )
{
	let cells = Array.from(Array( rowCount ), () => new Array( columnCount ))
	for( let row = 0; row < rowCount; row++ )
	{
		for( let column = 0; column < columnCount; column++ )
		{
			cells[row][column] = Cell( row, column, CELL_TYPE.EMPTY );
		}
	}

	let render = function() {
		for( let row = 0; row < rowCount; row++ )
		{
			for( let column = 0; column < columnCount; column++ )
			{
				let cellType = cells[row][column].cellType;
				let element = document.getElementById( row + "_" + column );
				if( cellType === CELL_TYPE.EMPTY )
				{
					element.classList.remove('snake');
				}
				else if( cellType === CELL_TYPE.SNAKE )
				{
					element.classList.add('snake');
				}
			}
		}
	}

	let placeFood = function() {
		let row = getRandomInteger( 0, rowCount );
		let column = getRandomInteger( 0, columnCount );
		if( cells[row][column].cellType === CELL_TYPE.SNAKE )
		{
			placeFood(); //todo don't do this. build up a list of possible ones, randomly select one, and remove duplicates as you go
		}
		cells[row][column].cellType = CELL_TYPE.FOOD;
	}

	return {
		rowCount: rowCount,
		columnCount: columnCount,
		cells: cells,
		placeFood: placeFood,
		render: render
	}	
}

function getRandomInteger( min, max )
{
	return Math.floor( Math.random() * ( max - min ) ) + min;
}

function Game( snake, board )
{
	let direction = DIRECTION.NONE;
	let gameOver = false;

	let setDirection = function( newDirection )
	{
		direction = newDirection;
	}

	let update = function( snake, board ) {
		if( !gameOver )
		{
			if( direction !== DIRECTION.NONE )
			{
				let nextCell = getNextCell( snake.head, board );

				if( snake.checkCrash( nextCell ) ) 
				{
					direction = DIRECTION.NONE;
					gameOver = true;
				}
				else
				{
					snake.move( nextCell );
					if( nextCell.cellType == CELL_TYPE.FOOD )
					{
						snake.grow();
						board.placeFood();
					}
				}
			}
		}
	};

	let getNextCell = function( snakeHead, board ) {
		let row = snakeHead.row;
		let column = snakeHead.column;

		if( direction === DIRECTION.RIGHT )
		{
			column++;
		}
		else if( direction === DIRECTION.LEFT )
		{
			column--;
		}
		else if( direction === DIRECTION.UP )
		{
			row--;
		}
		else if( direction === DIRECTION.DOWN )
		{
			row++;
		}

		let nextCell = board.cells[row][column];
		return nextCell;
	};

	return {
		setDirection: setDirection,
		gameOver: gameOver,
		update: update
	};
}

function initializeCells( columnCount )
{
	let row = 0;
	let column = 0;
	let cells = document.querySelectorAll('.cell');
	cells.forEach( function(cell) {
		cell.id = row + "_" + column;
		column++;
		if( column >= columnCount )
		{
			column = 0;
			row++;
		}
	});
}

function automatedTest()
{
	var board = Board( 20, 20 );
	let snake = Snake( board.cells[5][5], 3, board );
	let game = Game( snake, board );

	function assert(condition, message) 
	{
	    if (!condition) 
	    {
	        message = message || "Assertion failed";
	        if (typeof Error !== "undefined") 
	        {
	            throw new Error(message);
	        }
	        throw message; // Fallback
	    }
	}


/*	snake.snakeParts.push( Cell( 5, 4, CELL_TYPE.SNAKE ) );
	snake.snakeParts.push( Cell( 5, 3, CELL_TYPE.SNAKE ) );*/
	board.render();
	assert( board.cells[5][5].cellType === CELL_TYPE.SNAKE );
	assert( board.cells[6][5].cellType === CELL_TYPE.SNAKE );
	assert( board.cells[7][5].cellType === CELL_TYPE.SNAKE );
	game.setDirection( DIRECTION.UP );
	game.update( snake, board );
	board.render();
	assert( board.cells[4][5].cellType === CELL_TYPE.SNAKE );
	assert( board.cells[5][5].cellType === CELL_TYPE.SNAKE );
	assert( board.cells[6][5].cellType === CELL_TYPE.SNAKE );
	assert( board.cells[7][5].cellType === CELL_TYPE.EMPTY );

}

initializeCells( 20 );
automatedTest();

