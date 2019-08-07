function Game()
{
	let word = "The Shawshank Redemption"; //todo get a random one
	word = word.toUpperCase();
	let guessedLetters = [];
	let maskedWord = "";
	let incorrectGuesses = 0;
	let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	for ( let i = 0; i < word.length; i++ ) 
	{
		let space = " ";
		let nextCharacter = word.charAt(i) === space ? space : "_";
		maskedWord += nextCharacter;
	}

	let guess = function( letter ) 
	{
		letter = letter.toUpperCase();
		if( !guessedLetters.includes( letter ))
		{	
			guessedLetters.push(letter);
			possibleGuesses = possibleGuesses.replace(letter,"");
			if( word.includes( letter ) )
			{
				let matchingIndexes = [];
				for ( let i = 0; i < word.length; i++ ) 
				{
					if( word.charAt(i) === letter )
					{
						matchingIndexes.push( i );
					}
				}

				matchingIndexes.forEach( function(index) {
					maskedWord = replace( maskedWord, index, letter );
				});				
			}
			else
			{
				incorrectGuesses++;
			}
		}
	}

	let getWord = function() {
		return word;
	}

	let getMaskedWord = function() {
		return maskedWord;
	}

	let getPossibleGuesses = function() {
		return [... possibleGuesses];
	}


	return {
		"getWord": getWord,
		"getMaskedWord": getMaskedWord,
		"guess": guess,
		"getPossibleGuesses": getPossibleGuesses
	};
}

function replace( value, index, replacement ) 
{
    return value.substr(0, index) + replacement + value.substr(index + replacement.length);
}

function listenForInput( game ) 
{
	let guessLetter = function( letter )
	{
		if( letter )
		{
			game.guess( letter );
	    	document.getElementById("word").innerHTML = game.getMaskedWord() 
	    	document.getElementById("guesses").innerHTML = "";
	    	game.getPossibleGuesses().forEach( function(guess) {
	    		let innerHtml = "<span class='guess'>" + guess + "</span>";
	    		document.getElementById("guesses").innerHTML += innerHtml;
	    	});
		}
	};

	let handleClick = function( event )
	{
	    if (event.target.classList.contains('guess') )
	    {
	    	guessLetter( event.target.innerHTML );
	    }
	}

	let handleKeyPress = function( event )
	{
		let letter = null;
		const A = 65;
		const Z = 90;
		if( event.keyCode >= A && event.keyCode <= Z )
		{
			letter = String.fromCharCode( event.keyCode );
		}
		guessLetter( letter );
	}

	document.onkeydown = null;
	document.addEventListener('keydown', handleKeyPress );
	document.body.addEventListener('click', handleClick, false );
}

let game = Game();
document.getElementById("word").innerHTML = game.getMaskedWord() 
listenForInput(game);