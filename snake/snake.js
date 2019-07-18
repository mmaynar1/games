const CELL_TYPE = Object.freeze({
	EMPTY: "EMPTY",
	FOOD: "FOOD",
	SNAKE: "SNAKE"
});

const DIRECTION = Object.freeze({
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
	let directions = [];
	let direction = DIRECTION.NONE;
	let gameOver = false;
	let score = 0;

	let update = function( snake, board ) {
		if( !gameOver )
		{
			if( getFirstDirection() !== DIRECTION.NONE )
			{
				let nextCell = getNextCell( snake.getHead(), board );

				if( snake.checkCrash( nextCell ) ) 
				{
					directions = [];
					direction = DIRECTION.NONE;
					gameOver = true;
				}
				else
				{
					let nextCellType = snake.move( nextCell );
					if( nextCellType == CELL_TYPE.FOOD )
					{
						score += 100;
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
		direction = getFirstDirection();

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
		directions.shift();
		return nextCell;
	};

	let getScore = function()
	{
		return score;
	}

	let addDirection = function( newDirection )
	{
		directions.push( newDirection );
	}

	let getFirstDirection = function()
	{
		let result = direction;
		if( directions.length > 0 )
		{
			result = directions[0];
		}
		return result;
	}

	let getLastDirection = function()
	{
		let result = direction;
		if( directions.length > 0 )
		{
			result = directions[ directions.length - 1 ];
		}
		return result;
	}

	let exceededMaxDirections = function()
	{
		return directions.length > 3;
	}

	let getDirection = function()
	{
		return direction;
	}

	return {
		exceededMaxDirections: exceededMaxDirections,
		getLastDirection: getLastDirection,
		getScore: getScore,
		getDirection: getDirection,
		addDirection: addDirection,
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
	let movingVertically = function() {
		return !game.exceededMaxDirections() &&
			   game.getLastDirection() !== DIRECTION.RIGHT &&
	    	   game.getLastDirection() !== DIRECTION.LEFT;
	};

	let movingHorizontally = function() {
		return !game.exceededMaxDirections() && 
		   	   game.getLastDirection() !== DIRECTION.UP &&
	    	   game.getLastDirection() !== DIRECTION.DOWN;
	};

	document.addEventListener('keydown', function( event ) {
		const LEFT_ARROW = 37;
		const RIGHT_ARROW = 39;
		const UP_ARROW = 38;
		const DOWN_ARROW = 40;
	    if( event.keyCode == LEFT_ARROW && movingVertically() ) 
	    {
	    	game.addDirection( DIRECTION.LEFT );
	    }
	    else if( event.keyCode == RIGHT_ARROW && movingVertically() ) 
	    {
	    	game.addDirection( DIRECTION.RIGHT );
	    }
	    else if( event.keyCode == UP_ARROW && movingHorizontally() )
	    {
	    	game.addDirection( DIRECTION.UP );
	    }
	    else if( event.keyCode == DOWN_ARROW && movingHorizontally() )
	    {
			game.addDirection( DIRECTION.DOWN );
	    }
	});
}


const rowCount = 20;
const columnCount =20;
const startingLength = 5;

var board = Board( rowCount, columnCount );
let snake = Snake( board.cells[Math.floor(rowCount/2)][Math.floor(columnCount/2)],
				   startingLength, 
				   board );
let game = Game( snake, board );
initializeCells( columnCount );
board.placeFood();
game.addDirection(DIRECTION.UP);
board.render();
listenForInput( game );
setInterval( function(){
	game.update( snake, board );
	board.render();
}, 120)