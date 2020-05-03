const attemptsToFitWords = 300;
const gridsToMake = 50;
const gridSize = 20;
const SPACE = " ";

let usedWords = [];
let generatedGrids = [];



let createCrossWordPuzzle = function()
{
	let attemptToPlaceWordOnGrid = function(grid, word)
	{
        let text = getUniqueRandomWord();
        for (let row = 0; row < gridSize; ++row)
        {
            for (let column = 0; column < gridSize; ++column)
            {
                word.text = text;
                word.row = row;
				word.column = column;
				word.vertical = Math.random() >= 0.5;

                if ( grid.isLetter( row, column ) )
                {
                    if ( grid.update( word ) )
                    {
                        usedWords.push( word.text );
                        text = getUniqueRandomWord();
                        word.text = text;
                    }
                }
            }
        }
	}

	let getUniqueRandomWord = function()
    {
        let word = getRandomWord( words );

        while ( usedWords.includes( word ) )
        {
            word = getRandomWord( words );
        }
        return word;
    }

    let getBestGrid = function( grids )
    {
        let bestGrid = grids[ 0 ];
        grids.forEach(grid => function()
        	{
        		if ( grid.getIntersections() >= bestGrid.getIntersections() && grid.getLetterCount() > bestGrid.getLetterCount() )
            	{
               		bestGrid = grid;
            	}
        	});

        return bestGrid;
    }

	for ( let gridsMade = 0; gridsMade < gridsToMake; gridsMade++ ) 
	{
		let grid = new CrosswordPuzzle();
		let word = new Word( getRandomWordOfSize( getUnusedWords(), 9 ),
									 0, 0, false );
		//alert(startingWord.text);
		//let word = new Word( 'starting', 0, 0, false );
		grid.update(word);
		usedWords.push(word);

        for (let attempts = 0; attempts < attemptsToFitWords; ++attempts)
        {
            attemptToPlaceWordOnGrid( grid, word );
        }

        generatedGrids.push( grid );
        usedWords = [];
	}

	let bestGrid = getBestGrid( generatedGrids );
	console.log(bestGrid.grid);
}

function CrosswordPuzzle()
{
	const emptyCell = '_';
	let grid = Array.from(Array( gridSize ), () => new Array( gridSize ))
	for( let row = 0; row < gridSize; row++ )
	{
		for( let column = 0; column < gridSize; column++ )
		{
			grid[row][column] = emptyCell;
		}
	}

	let update = function( word )
	{
		let updated = false;
		if( canBePlaced( word ))
		{
			addWord( word );
			updated = true;
		}

		return updated;
	}

	let canBePlaced = function( word )
	{
		let canBePlaced = true;
		if( isValidPosition( word.row, word.column ) &&  fitsOnGrid( word ) )
		{
			let index = 0;
			while( index < word.text.length )
			{
				let currentRow = word.vertical ? word.row + index : word.row;
				let currentColumn = !word.vertical ? word.column + index : word.column;

				if( ( word.text.charAt( index ) === grid[currentRow][currentColumn] ||
					emptyCell === grid[currentRow][currentColumn] ) &&
					placementLegal( word, currentRow, currentColumn) )
				{
					//We can place a word! 
				}
				else
				{
					canBePlaced = false;
				}
				index++;
			}
		}
		else
		{
			canBePlaced = false;
		}

		return canBePlaced;
	}

    let getLetterCount = function()
    {
        let letterCount = 0;
        for (let row = 0; row < gridSize; row++)
        {
            for (let column = 0; column < gridSize; column++)
            {
                if ( isLetter( row, column ) )
                {
                    ++letterCount;
                }
            }
        }
        return letterCount;
    }

    let getIntersections = function()
    {
        let intersections = 0;
        for (let row = 0; row < gridSize; row++)
        {
            for (let column = 0; column < gridSize; column++)
            {
                if ( isLetter( row, column ) )
                {
                    if ( isValidPosition( row - 1, column ) &&
                         isValidPosition( row + 1, column ) &&
                         isValidPosition( row, column - 1 ) &&
                         isValidPosition( row, column + 1 ) &&
                         isLetter( row - 1, column ) &&
                         isLetter( row + 1, column ) &&
                         isLetter( row, column - 1 ) &&
                         isLetter( row, column + 1 ) )
                    {
                        ++intersections;
                    }
                }
            }
        }
        return intersections;
    }

	let placementLegal = function( word, row, column )
	{
		let illegal = false;
		if( word.vertical )
		{
			illegal = isInterference( row, column + 1, row + 1, column ) ||
					  isInterference( row, column - 1, row + 1, column  ) ||
					  overwritingVerticalWord( row, column ) ||
					  invadingTerritory( word, row, column );

		}
		else
		{
			illegal = isInterference( row + 1, column, row, column + 1 ) ||
					  isInterference( row - 1, column, row, column + 1  ) ||
					  overwritingHorizontalWord( row, column ) ||
					  invadingTerritory( word, row, column );

		}
		return !illegal;
	}

	let invadingTerritory = function( word, row, column )
	{
		let invading = false;
		let empty = isEmptyCell( row, column )
		if( word.vertical )
		{
			let weHaveNeighbors = ( doesCharacterExist( row, column - 1 ) ||
					     		    doesCharacterExist( row, column + 1 ) ) ||
									endOfWord( word, row, column ) && 
									doesCharacterExist( row + 1, column );

			invading = empty && weHaveNeighbors;				
		}
		else
		{
			let weHaveNeighbors = ( doesCharacterExist( row - 1, column ) ||
					     		    doesCharacterExist( row + 1, column ) ) ||
									endOfWord( word, row, column ) && 
									doesCharacterExist( row, column + 1 );

			invading = empty && weHaveNeighbors;
		}
		return invading;
	}

	let endOfWord = function( word, row, column )
	{
		if( word.vertical )
		{
			return word.row + word.text.length - 1 === row;
		}
		else
		{
			return word.column + word.text.length - 1 === column;
		}
	}

	let doesCharacterExist = function( row, column )
	{
		return isValidPosition( row, column ) && 
			   isLetter( row, column );
	}

    let overwritingHorizontalWord = function( row, column )
    {
        let leftColumn = column - 1;
        return ( isValidPosition( row, leftColumn ) && 
        		 isLetter( row, column ) && 
        		 isLetter( row, leftColumn ) );
    }

    let overwritingVerticalWord = function( row, column )
    {
        let rowAbove = row - 1;
        return ( isValidPosition( rowAbove, column ) && 
        		 isLetter( row, column ) && 
        		 isLetter( rowAbove, column ) );
    }

    let isInterference = function( row, column, nextRow, nextColumn )
    {
    	return isValidPosition( row, column ) &&
    		   isValidPosition( nextRow, nextColumn ) &&
    		   isLetter( row, column ) &&
    		   isLetter( nextRow, nextColumn );	
    }

    let isLetter = function( row, column)
    {
    	return grid[row][column] !== emptyCell;
    }

    let isEmptyCell = function( row, column )
    {
    	return !isLetter( row, column );
    }

	let addWord = function( word )
	{
		for (let letterIndex = 0; letterIndex < word.text.length; ++letterIndex)
        {
        	let row = word.row;
			let column = word.column;
	        if ( word.vertical )
	        {
	            row += letterIndex;
	        }
	        else
	        {
	            column += letterIndex;
	        }

	        grid[row][column] = word.text.substring( letterIndex, letterIndex + 1 ) ;//+ SPACE;
        }
	}

	let fitsOnGrid = function( word )
	{
		if( word.vertical )
		{
			return word.row + word.text.length <= gridSize;
		}
		else
		{
			return word.column + word.text.length <= gridSize;
		}
	}

	let isValidPosition = function( row, column )
    {
        return row >= 0 && row < gridSize && column >= 0 && column < gridSize;
    }

	return { "grid": grid, "update": update, "isLetter": isLetter };
}

function Word( text, row, column, vertical )
{
	this.text = text;
	this.row = row;
	this.column = column;
	this.vertical = vertical;
}

function getUnusedWords()
{
	return words.filter(val => !usedWords.includes(val));
}

function getRandomWordOfSize( wordList, wordSize )
{
	let properLengthWords = wordList.filter(val => val.length >= wordSize );
	return properLengthWords[getRandomInt(properLengthWords.length)]
}

function getRandomWord( wordList )
{
	return wordList[getRandomInt(wordList.length)]
}

function getRandomInt( max )
{
	return Math.floor(Math.random() * Math.floor(max));
}

function newGame()
{
	history.go(0)
}
