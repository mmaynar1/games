function Board( teams )
{
    let vacantNodeCount = Math.floor(nodeCount / getRandomInteger(5,9));
    let occupiedNodeCount = nodeCount - vacantNodeCount;
	let grid = Array.from(Array( gridSize ), () => new Array( gridSize ))

    let getVacantNodes = function()
    {
        let vacantNodes = [];
        let picked = [];
        let second = 1;
        let secondToLast = gridSize - 2;
        for( let i = 0; i < vacantNodeCount; i++ )
        {
            let x = getRandomInteger(0, gridSize);
            let y = getRandomInteger(0, gridSize);
            while( picked.includes( x + "" + y) ||
                   x === second  ||
                   x === secondToLast ||
                   y === second ||
                   y === secondToLast
                   )
            {
                x = getRandomInteger(0, gridSize);
                y = getRandomInteger(0, gridSize);
            }
            picked.push( x + "" + y);
            vacantNodes.push({"x": x, "y": y});
        }
        return vacantNodes;
    }

    let getOccupiedNodes = function()
    {
        let nodesPerTeam = Math.floor( occupiedNodeCount / teams.length );
        let dicePerTeam = nodesPerTeam * 2;
        let nodes = [];
        for( let team = 0; team < teams.length; team++ )
        {
            for( let i = 0; i < nodesPerTeam; i++ )
            {
                 let value = 2;
                 if( i === 0 )
                 {
                    value = 1;
                 }
                 else if( i === nodesPerTeam - 1 )
                 {
                    value = 3;
                 }

                 let node = new Node(0, 0, teams[team], value)
                 nodes.push(node);
            }
        }
        return shuffle(nodes);
    }

    let cleanUpHangingNodes = function()
    {
        let hangingNodes = [];
        for( let y = 0; y < gridSize; y++ )
        {
            for( let x = 0; x < gridSize; x++ )
            {
                let node = grid[y][x];
                if( node !== vacant )
                {
                    let hanging = isNodeHanging( node );
                    if( hanging )
                    {
                        let newNode = new Node(x, y, node.team, node.value)
                        grid[y][x] = vacant;
                        hangingNodes.push( newNode );
                    }
                }
            }
        }

        for( let y = 0; y < gridSize; y++ )
        {
            for( let x = 0; x < gridSize; x++ )
            {
                let node = grid[y][x];
                if( hangingNodes.length > 0 )
                {
                    for( let i = 0; i < hangingNodes.length; i++ )
                    {
                        if( node !== vacant &&
                            node.team.color === hangingNodes[i].team.color )
                        {
                            node.value = node.value + hangingNodes[i].value;
                            hangingNodes.splice(i,1);
                            break;
                        }
                    }
                }
                else
                {
                   break;
                }
            }
        }
    }

    let isNodeHanging = function( node )
    {
        let neighbors = getNeighbors( node );
        let hanging = true;
        for( let i = 0; i < neighbors.length; i++ )
        {
            if( neighbors[i] !== vacant )
            {
                hanging = false;
                break;
            }
        }
        return hanging;
    }

    let getNeighbors = function( node )
    {
    	let neighbors = [];
    	let x = node.x;
    	let y = node.y;
    	neighbors.push(getNeighbor(x-1, y-1));
    	neighbors.push(getNeighbor(x, y-1));
    	neighbors.push(getNeighbor(x+1, y-1));
    	neighbors.push(getNeighbor(x+1, y));
    	neighbors.push(getNeighbor(x-1, y));
    	neighbors.push(getNeighbor(x-1, y+1));
    	neighbors.push(getNeighbor(x, y+1));
    	neighbors.push(getNeighbor(x+1, y+1));
    	return neighbors
    }

    let getNeighbor = function( x, y )
    {
        let node = vacant;
        try
        {
            node = grid[y][x]
            if( !node )
            {
                node = vacant;
            }
        }
        catch(error)
        {
            node = vacant;
        }
        return node;
    }

	let setupBoard = function()
	{
		let occupiedNodes = getOccupiedNodes();
		occupiedNodeCount = occupiedNodes.length;
        vacantNodeCount = nodeCount - occupiedNodeCount;
	    let vacantNodes = getVacantNodes();

		for( let y = 0; y < gridSize; y++ )
    	{
    		for( let x = 0; x < gridSize; x++ )
    		{
    		    for( let i = 0; i < vacantNodes.length; i++ )
    		    {
    		        let vacantNode = vacantNodes[i];
    		        if( x === vacantNode.x && y === vacantNode.y )
    		        {
    		            grid[y][x] = vacant;
    		        }
    		    }

    		    if( grid[y][x] !== vacant )
    		    {
    		        let node = occupiedNodes.pop();
    		        node.x = x;
    		        node.y = y;
    		        grid[y][x] = node;
    		    }
    		}
    	}
    	cleanUpHangingNodes();
	}

	return {
		"setupBoard": setupBoard,
		"grid": grid
	};
}