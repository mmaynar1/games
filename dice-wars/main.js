let getRandomInteger = function( min, max )
{
	return Math.floor( Math.random() * ( max - min ) ) + min;
}

let shuffle = function(o)
{
  for (let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

let logNode = function( node )
{
    console.log( "( " + node.x + ", " + node.y + " )" );
};

let teams = [
    new Team(0,'orangered'),
    new Team(1,'dodgerblue'),
    new Team(2,'mediumseagreen'),
    new Team(3,'orange'),
    new Team(4,'plum')
]

let gridSize = 8;
let nodeCount = gridSize * gridSize;
let vacant = -1;
let playerTeam = teams[0];
let nodeSelected = false;
let turnColor = playerTeam.color;

let board = new Board( teams );
let graphics = new Graphics();
board.setupBoard();
graphics.display( board );

let modal = document.getElementById("modal");
let closeModalButton = document.getElementsByClassName("close")[0];
closeModalButton.onclick = function() {
    if( document.getElementById("playButton").innerHTML === "Play Again!" )
    {
       location.reload();
    }
    else
    {
        document.getElementById("modal").style.display = "none";
    }
}

let endTurn = function()
{
    board.advanceTurn( graphics, board );
}


