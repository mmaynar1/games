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
             let bonus = bonuses[teams[i].color];
             bonus = bonus.length > 1 ? bonus : " " + bonus;
             span.innerHTML = prefix + bonus;
             playersDiv.appendChild(span);
        }
        let playerDiv = document.getElementById("player_" + board.getTurnIndex());
        playerDiv.style.boxShadow = "0px 0px 15px 2px white";
    }

    	return {
    		"display": display,
    		"displayTeams": displayTeams
    	};
}