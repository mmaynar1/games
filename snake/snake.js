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
		let cellType = nextCell.cellType;
		let tail = snakeParts.pop();
		tail.cellType = CELL_TYPE.EMPTY;
		head = nextCell;
		head.cellType = CELL_TYPE.SNAKE;
		snakeParts.unshift( head );
		snakeParts.forEach( function(part) {
			part.cellType = CELL_TYPE.SNAKE;
		})
		return cellType;
	}

	let checkCrash = function( nextCell ) {
		let crashed = ( typeof nextCell === 'undefined' );
		if( !crashed )
		{
			crashed = snakeParts.some( function( cell ) {
				return ( cell.row === nextCell.row && 
						 cell.column === nextCell.column );
			})
		}
		return crashed;
	}

	let getHead = function() {
		return head;
	}

	return {
		getHead: getHead,
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
		let snakeCssClass = 'snake';
		let foodCssClass = 'food';
		for( let row = 0; row < rowCount; row++ )
		{
			for( let column = 0; column < columnCount; column++ )
			{
				let cellType = cells[row][column].cellType;
				let element = document.getElementById( row + "_" + column );
				if( cellType === CELL_TYPE.EMPTY )
				{
					element.classList.remove(snakeCssClass);
					element.classList.remove(foodCssClass);
				}
				else if( cellType === CELL_TYPE.SNAKE )
				{
					element.classList.add(snakeCssClass);
					element.classList.remove(foodCssClass);
				}
				else if( cellType === CELL_TYPE.FOOD )
				{
					element.classList.add(foodCssClass);
					element.classList.remove(snakeCssClass);
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

	let getColumnCount = function() {
		return columnCount;
	}

	let getRowCount = function() {
		return rowCount;
	}

	return {
		getRowCount: getRowCount,
		getColumnCount: getColumnCount,
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

	let update = function( snake, board ) {
		if( !gameOver )
		{
			if( direction !== DIRECTION.NONE )
			{
				let nextCell = getNextCell( snake.getHead(), board );

				if( snake.checkCrash( nextCell ) ) 
				{
					direction = DIRECTION.NONE;
					gameOver = true;
				}
				else
				{
					let nextCellType = snake.move( nextCell );
					if( nextCellType == CELL_TYPE.FOOD )
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

		let nextCell;
		if( row > -1 && row < board.getRowCount() && 
			column > -1 && column < board.getColumnCount() )
		{
			nextCell = board.cells[row][column];
		}
		return nextCell;
	};

	let setDirection = function( newDirection )
	{
		direction = newDirection;
	}

	let getDirection = function()
	{
		return direction;
	}

	return {
		getDirection: getDirection,
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

function listenForInput( game )
{
	document.addEventListener('keydown', function( event ) {
	    if(event.keyCode == 37 && game.getDirection() !== DIRECTION.RIGHT ) 
	    {
	    	game.setDirection( DIRECTION.LEFT );
	    }
	    else if(event.keyCode == 39 && game.getDirection() !== DIRECTION.LEFT ) 
	    {
	    	game.setDirection( DIRECTION.RIGHT );
	    }
	    else if(event.keyCode == 38 && game.getDirection() !== DIRECTION.DOWN )
	    {
	    	game.setDirection( DIRECTION.UP );
	    }
	    else if(event.keyCode == 40 && game.getDirection() !== DIRECTION.UP )
	    {
			game.setDirection( DIRECTION.DOWN );
	    }
	});
}

var board = Board( 20, 20 );
let snake = Snake( board.cells[5][5], 3, board );
let game = Game( snake, board );
initializeCells( 20 );
board.placeFood();
game.setDirection(DIRECTION.UP);
board.render();
listenForInput( game );
setInterval( function(){
	game.update( snake, board );
	board.render();
}, 120)