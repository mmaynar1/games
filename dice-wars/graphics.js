function Graphics()
{
    let display = function( board )
    {
        let displaySize = 400; //pixels
        let gridDiv = document.getElementById("grid");
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
    }

    	return {
    		"display": display
    	};
}