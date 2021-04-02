function Graphics()
{
    let display = function( board )
    {
        let displaySize = 400; //pixels
        let gridDiv = document.getElementById("grid");
        document.querySelectorAll('.node').forEach(e => e.remove());
        gridDiv.style.height = displaySize + "px";
        gridDiv.style.width = displaySize + "px";
        let row = 0;
        let column = 0;

        for( let y = 0; y < gridSize; y++ )
        {
            for( let x = 0; x < gridSize; x++ )
            {
                let div = document.createElement("DIV");
                div.id = x + "_" + y;
                div.classList.add("node");
                let nodeSize = ( displaySize / gridSize ) + "px";
                div.style.height = nodeSize;
                div.style.width = nodeSize;
                div.addEventListener("click", function(){
                    let clickResults = board.handleClick( x, y );

                    let elements = document.getElementsByClassName("node");
                    for( let i = 0; i < elements.length; i++ )
                    {
                        elements[i].classList.remove("target");
                    }

                    if( clickResults.attackables )
                    {
                        console.log("attackables");
                        clickResults.attackables.forEach( node => document.getElementById(node.x + "_" + node.y ).classList.add("target"));
                    }
                    else if( clickResults.attacking )
                    {
                        console.log("attacking");
                        logNode(clickResults.attacking);
                        display( board );
                    }
                });

                if( board.grid[y][x] === vacant )
                {
                    div.style.backgroundColor = '#333';
                }
                else
                {
                    div.style.backgroundColor = board.grid[y][x].team.color;
                    div.innerHTML = board.grid[y][x].value;
                }
                gridDiv.appendChild(div);
            }
        }
        displayTeams( teams, board.calculateDiceBonus() );
        let gameStatus = board.getGameStatus();

        let messageBox = document.getElementById("message");
        if( gameStatus === "won" || gameStatus === "lost" )
        {
            let prize = "participation trophy?"
            if( gameStatus === "won")
            {
                prize = "prize?"
            }
            messageBox.innerHTML = "You " + gameStatus + "! " + "<a href=\"https://mitchum.blog/claim-your-prize-subscribe/\">Claim your " + prize + " </a>" ;
            document.getElementById("playButton").innerHTML = "Play Again!";
            document.getElementById("modal").style.display = "block";
        }
    }

    let displayTeams = function( teams, bonuses )
    {
        let playersDiv = document.getElementById("players");
        playersDiv.innerHTML = "";
        for( let i = 0; i < teams.length; i++ )
        {
             let span = document.createElement("SPAN");
             span.id = "player_" + i;
             span.classList.add("player");
             span.style.backgroundColor = teams[i].color;
             let prefix = i === 0 ? "P" : "C";
             let bonus = bonuses[teams[i].color].count;
             bonus = bonus.length > 1 ? bonus : " " + bonus;
             span.innerHTML = prefix + bonus;
             playersDiv.appendChild(span);
        }
        let turn = board.getTurnIndex();
        let playerDiv = document.getElementById("player_" + turn);
        playerDiv.style.boxShadow = "0px 0px 15px 2px white";
        let endTurnButton = document.getElementById("endTurnButton");
        endTurnButton.style.display = turn == 0 ? "initial" : "none";
    }

    let showInstructions = function()
    {
        let messageBox = document.getElementById("message");
        messageBox.innerHTML = "The object of Minimum Viable Dice Wars is to conquer all of the tiles. Each tile has a number representing how many dice are on the tile. Click on one of your tiles and select an adjacent tile to attack it. A few rules to note:" +
        "<ul><li>All dice are rolled during attack and defense.</li><li>Defense wins ties.</li><li>Each tile must have at least 1 die.</li><li>At the end of your turn you will receive bonus dice based on your highest number of connected tiles.</li><li>Diagonally connected tiles can be attacked and count towards your bonus.</li><li>Bonus dice can be stored for later use.</li>";
        document.getElementById("modal").style.display = "block";
        document.getElementById("playButton").innerHTML = "Let's Play!";
    }

    	return {
    		"display": display,
    		"displayTeams": displayTeams,
    		"showInstructions": showInstructions
    	};
}