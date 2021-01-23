let answers = [
	'Seems unlikely.',
	'Not a chance.',
	'In your dreams.',
	'Get real, kid.',
	'Absolutely.',
	'Maybe.',
	'It is certain.',
	'Ask me later.',
	'Chances seem good.',
	'I don\'t know, I\'m just a stupid piece of plastic.',
	'Ask again later.',
	'Signs point to yes.',
	'No.',
	'Yes.',
	'Nope.',
	'Don\'t count on it.',
	'Is the Pope Catholic?',
	'Does a one legged duck swim in a circle?'
]

let displayAnswer = function()
{
	let index = Math.floor(Math.random() * answers.length);
	let answer = answers[index];
	let element = document.getElementById( 'circle' );
	element.style.display = 'inline-block';
	element.innerHTML = '<br><br>' + answer;
}


