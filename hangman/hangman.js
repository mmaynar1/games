/* Movies */
let movies = [
	'The Shawshank Redemption',
	'School of Rock',
	'Forrest Gump',
	'Remember the Titans',
	'Saving Private Ryan',
	'The Dark Knight',
	'The Godfather',
	'Pulp Fiction',
	'Inception',
	'Fight Club',
	'Goodfellas',
	'Interstellar',
	'Life Is Beautiful',
	'American History X',
	'Toy Story',
	'Back to the Future',
	'Raiders of the Lost Ark',
	'Rear Window',
	'Django Unchained',
	'Once Upon a Time in the West',
	'The Shining',
	'Inglourious Basterds',
	'Good Will Hunting',
	'Reservoir Dogs',
	'For a Few Dollars More',
	'To Kill a Mockingbird',
	'Citizen Kane',
	'The Sound of Music',
	'Inside Out',
	'Up',
	'The Wolf of Wall Street',
	'V for Vendetta',
	'Batman Begins',
	'A Beautiful Mind',
	'Nacho Libre',
	'Napoleon Dynamite',
	'Indiana Jones and the Last Crusade',
	'Die Hard',
	'The Hangover',
	'The Shack',
	'The Great Escape',
	'A Quiet Place',
	'Billy Madison',
	'Happy Gilmore',
	'Tommy Boy',
	'The Bridge on the River Kwai',
	'Gone with the Wind',
	'Logan',
	'Hacksaw Ridge',
	'Gone Girl',
	'Guardians of the Galaxy',
	'Gran Torino',
	'Shutter Island',
	'How to Train Your Dragon',
	'Hotel Rwanda',
	'Finding Nemo',
	'The Sixth Sense',
	'The Truman Show',
	'Fargo',
	'Jurassic Park',
	'Dead Poets Society',
	'Stand And Deliver',
	'Stand by Me',
	'The Sandlot',
	'Rocky',
	'Pale Rider',
	'Groundhog Day',
	'The Room',
	'Mean Girls',
	'The Boondock Saints',
	'Black Hawk Down',
	'Dunkirk',
	'Lone Survivor',
	'Letters from Iwo Jima',
	'Flags of Our Fathers',
	'Apocalypse Now',
	'Full Metal Jacket',
	'The Notebook',
	'Pride and Prejudice',
	'Pearl Harbor',
	'The Dirty Dozen',
	'We Were Soldiers',
	'A Walk to Remember',
	'Silver Linings Playbook',
	'The Holiday',
	'Hitch',
	'Pretty Woman',
	'Clueless',
	'Sleepless in Seattle',
	'The Wedding Singer',
	'Sweet Home Alabama',
	'What Women Want',
	'Jerry Maguire',
	'Hidden Figures',
	'The Social Network',
	'Lincoln',
	'The Green Mile',
	'Titanic',
	'Cast Away',
	'Big',
	'Sully',
	'Captain Phillips',
	'Catch Me If You Can',
	'The Polar Express',
	'How the Grinch Stole Christmas',
	'Yes Man',
	'The Cable Guy',
	'Dumb and Dumber',
	'Liar Liar',
	'The Mask',
	'Bruce Almighty',
	'Black Panther',
	'Captain Marvel',
	'Venom',
	'Deadpool',
	'The Avengers',
	'Iron Man',
	'Thor',
	'The Incredibles',
	'Robin Hood',
	'Bee Movie',
	'Aladdin',
	'The Wizard of Oz',
	'It',
	'Bohemian Rhapsody',
	'The Hateful Eight',
	'Top Gun',
	'Suicide Squad',
	'Zombieland',
	'Jackie Brown',
	'The English Patient',
	'No Country for Old Men',
	'Reign Over Me',
	'Gladiator',
	'Chariots of Fire',
	'Slumdog Millionaire',
	'Lawrence of Arabia',
	'Patton',
	'Green Book',
	'Psycho',
	'Vertigo',
	'Taken',
	'Cold Pursuit',
	'The Grey',
	'Gangs of New York',
	'The Lego Movie',
	'War Room',
	'Silence',
	'Fireproof',
	'The Passion of the Christ',
	'Facing the Giants',
	'The Prince of Egypt',
	'Joshua',
	'Get Out',
	'Seven',
	'The Sixth Sense',
	'The Prestige',
	'Jaws',
	'Basic Instinct',
	'Unbreakable',
	'Glass',
	'Split',
	'Scream',
	'The Fugitive',
	'The Conjuring',
	'Sinister',
	'Insidious',
	'The Blair Witch Project',
	'The Grudge',
	'Blazing Saddles',
	'Superbad',
	'Hot Fuzz',
	'Tropic Thunder',
	'Old School',
	'Office Space',
	'Caddyshack',
	'Stripes',
	'Animal House',
	'The Jerk',
	'Raising Arizona',
	'Paid in Full'
];

/* Game */

const youWon = "You Won!";
const youLost = "You Lost!";

function Game()
{
	let word = movies[Math.floor(Math.random()*movies.length)];
	word = word.toUpperCase();
	let guessedLetters = [];
	let maskedWord = "";
	let incorrectGuesses = 0;
	let possibleGuesses = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let won = false;
	let lost = false;
	const maxGuesses = 7;

	for ( let i = 0; i < word.length; i++ ) 
	{
		let space = " ";
		let nextCharacter = word.charAt(i) === space ? space : "_";
		maskedWord += nextCharacter;
	}

	let guessWord = function( guessedWord )
	{
		guessedWord = guessedWord.toUpperCase();
		if( guessedWord === word )
		{
			guessAllLetters();
		}
		else
		{
			handleIncorrectGuess();
		}
	}

	let guessAllLetters = function()
	{
		for ( let i = 0; i < word.length; i++ ) 
		{
			guess( word.charAt( i ) );
		}
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

				if( !lost )
				{
					won = maskedWord === word;	
				}		
			}
			else
			{
				handleIncorrectGuess();
			}
		}
	}

	let handleIncorrectGuess = function()
	{
		incorrectGuesses++;
		lost = incorrectGuesses >= maxGuesses;
		if( lost )
		{
			guessAllLetters();
		}
	}

	return {
		"getWord": function(){ return word; },
		"getMaskedWord": function(){ return maskedWord; },
		"guess": guess,
		"getPossibleGuesses": function(){ return [... possibleGuesses]; },
		"getIncorrectGuesses": function(){ return incorrectGuesses; },
		"guessWord": guessWord,
		"isWon": function(){ return won; },
		"isLost": function(){ return lost; },
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
			let gameStillGoing = !game.isWon() && 
								 !game.isLost();
			if( gameStillGoing )
			{
				game.guess( letter );
				render( game );
			}
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
		const ENTER = 13;
		let isLetter = event.keyCode >= A && event.keyCode <= Z;
		let guessWordButton = document.getElementById("guessWordButton");
		let newGameButton = document.getElementById("newGameButton");
		let guessBox = document.getElementById("guessBox");
		let gameOver = guessBox.value === youWon || guessBox.value === youLost;

		if( event.target.id !== "guessBox" && isLetter )
		{
			letter = String.fromCharCode( event.keyCode );
		}
		else if( event.keyCode === ENTER && gameOver )
		{
			newGameButton.click();
		}
		else if( event.keyCode === ENTER && guessBox.value !== "" )
		{
			guessWordButton.click();
		}
		guessLetter( letter );
	}

	document.addEventListener('keydown', handleKeyPress );
	document.body.addEventListener('click', handleClick );
}

function guessWord( game )
{
	let gameStillGoing = !game.isWon() && 
						 !game.isLost();
	let guessedWord = document.getElementById('guessBox').value;
	if( gameStillGoing )
	{
		game.guessWord( guessedWord );
		render( game );
	}
}

function render( game )
{
    document.getElementById("word").innerHTML = game.getMaskedWord(); 
	document.getElementById("guesses").innerHTML = "";
	game.getPossibleGuesses().forEach( function(guess) {
		let innerHtml = "<span class='guess'>" + guess + "</span>";
		document.getElementById("guesses").innerHTML += innerHtml;
	});
	document.getElementById("hangmanImage").src = "img/hangman" + game.getIncorrectGuesses() + ".png";

	let guessBox = document.getElementById('guessBox');
	if( game.isWon() )
	{
		guessBox.value = youWon;
		guessBox.classList = "win";
	}
	else if( game.isLost() )
	{
		guessBox.value = youLost;
		guessBox.classList = "loss";
	}
	else
	{
		guessBox.value = "";
		guessBox.classList = "";
	}
}

function newGame()
{
	history.go(0)
}

let game = new Game();
render( game );
listenForInput( game );