function Board( teams )
{
    let vacantNodeCount = Math.floor(nodeCount / getRandomInteger(5,9));
    let occupiedNodeCount = nodeCount - vacantNodeCount;
	let grid = Array.from(Array( gridSize ), () => new Array( gridSize ));
	let turnIndex = 0;
	let MAX_NODE_VALUE = 8;

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
            while ( picked.includes( x + "" + y) ||
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
                 if( i === 0 || i === 1 )
                 {
                    value = 1;
                 }
                 else if( i === nodesPerTeam - 1 || i === nodesPerTeam - 2 )
                 {
                    value = 3;
                 }

                 let node = new Node(0, 0, teams[team], value, false, false )
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
                        let newNode = new Node(x, y, node.team, node.value, false, false )
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

    let getAttackableNodes = function( x, y )
    {
        let selectedNode = getNode( x , y );

        let nodes = [];
        nodes.push( getNode( x, y - 1 ) );
        nodes.push( getNode( x, y + 1 ) );
        nodes.push( getNode( x + 1, y - 1 ) );
        nodes.push( getNode( x + 1, y + 1 ) );
        nodes.push( getNode( x - 1, y - 1 ) );
        nodes.push( getNode( x - 1, y + 1 ) );
        nodes.push( getNode( x + 1, y ) );
        nodes.push( getNode( x - 1, y ) );

        let attackables = [];
        nodes.forEach( node => addAttackable(attackables, node, selectedNode.team.color ) );
        return attackables;
    }

    let addAttackable = function( attackables, node, color )
    {
        if( node != vacant && node.team.color !== color )
        {
            attackables.push( node );
        }
    }

    let getNode = function( x , y )
    {
        if( x < 0 || x >= gridSize || y < 0 || y >= gridSize )
        {
            return vacant;
        }
        else
        {
            return grid[y][x];
        }
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

    let calculateDiceBonus = function()
    {
        let bonuses = {};
        teams.forEach( team => bonuses[team.color] = { "count": 0, "indexes": [] } );

        for( let y = 0; y < gridSize; y++ )
        {
            for( let x = 0; x < gridSize; x++ )
            {
                let node = grid[y][x];
                if( node != vacant )
                {
                    let color = node.team.color;
                    let connectedIndexes = []
                    let connectedNodes = findNumberConnected(y,x,grid, connectedIndexes);
                    connectedNodes.indexes.push( {"x": x, "y": y} );
                    if( bonuses[color].count < connectedNodes.count )
                    {
                        bonuses[color] = connectedNodes;
                    }
                }
            }
        }

        applyToEachNode( uncheck );
        return bonuses;
    }

    let applyToEachNode = function( f )
    {
        let results = {};
        grid.forEach( row => row.forEach( node => f( node, results )));
        return results;
    }

    let getSelectedNode = function()
    {
        let selected = function( node, results )
        {
            if( node !== vacant && node.selected )
            {
                results["selectedNode"] = node;
            }
        }

        let results = applyToEachNode( selected );
        return results["selectedNode"];
    }

    let findAttackables = function( node, results )
    {
        if( node !== vacant && node.selected && node.team.color === turnColor )
        {
            results["attackables"] = getAttackableNodes( node.x, node.y );
        }
    }

    let uncheck = function( node )
    {
        if( node !== vacant )
        {
            node.checked = false;
        }
    }

    let unselect = function( node )
    {
        if( node !== vacant )
        {
            node.selected = false;
        }
    }

	let findNumberConnected = function(y, x, grid, connectedIndexes)
    {
        //https://stackoverflow.com/questions/21716926/finding-connected-cells-in-a-2d-array
        let canUp = (y - 1 >= 0);
        let canDown = (y + 1 < gridSize);
        let canRight = (x + 1 < gridSize);
        let canLeft = (x - 1 >= 0);
        let canUpRight = canUp && canRight;
        let canUpLeft = canUp && canLeft;
        let canDownRight = canDown && canRight;
        let canDownLeft = canDown && canLeft;

        let node = grid[y][x];
        let color = node.team.color

        let up = 0;
        let down = 0;
        let right = 0;
        let left = 0;
        let upRight = 0;
        let upLeft = 0;
        let downRight = 0;
        let downLeft = 0;

        node.checked = true;

        //todo make some functions you idiot.
        if (canUpRight && grid[y-1][x+1] !== vacant && grid[y-1][x+1].team.color == color && grid[y-1][x+1].checked === false )
        {
            connectedIndexes.push( {"x": x+1, "y": y-1} );
            upRight = findNumberConnected(y-1,x+1,grid, connectedIndexes).count;
        }
        if (canUpLeft && grid[y-1][x-1] !== vacant && grid[y-1][x-1].team.color == color && grid[y-1][x-1].checked === false )
        {
            connectedIndexes.push( {"x": x-1, "y": y-1} );
            upLeft = findNumberConnected(y-1,x-1,grid, connectedIndexes).count;
        }
        if (canDownRight && grid[y+1][x+1] !== vacant && grid[y+1][x+1].team.color == color && grid[y+1][x+1].checked === false )
        {
            connectedIndexes.push( {"x": x+1, "y": y+1} );
            downRight = findNumberConnected(y+1,x+1,grid, connectedIndexes).count;
        }
        if (canDownLeft && grid[y+1][x-1] !== vacant && grid[y+1][x-1].team.color == color && grid[y+1][x-1].checked === false )
        {
            connectedIndexes.push( {"x": x-1, "y": y+1} );
            downLeft = findNumberConnected(y+1,x-1,grid, connectedIndexes).count;
        }
        if (canUp && grid[y-1][x] !== vacant && grid[y-1][x].team.color == color && grid[y-1][x].checked === false )
        {
            connectedIndexes.push( {"x": x, "y": y-1} );
            up = findNumberConnected(y-1,x,grid, connectedIndexes).count;
        }
        if (canDown && grid[y+1][x] !== vacant && grid[y+1][x].team.color == color && grid[y+1][x].checked === false)
        {
            connectedIndexes.push( {"x": x, "y": y+1} );
            down = findNumberConnected(y+1,x,grid, connectedIndexes).count;
        }
        if (canLeft && grid[y][x-1] !== vacant && grid[y][x-1].team.color == color && grid[y][x-1].checked === false)
        {
            connectedIndexes.push( {"x": x-1, "y": y} );
            left = findNumberConnected(y,x-1,grid, connectedIndexes).count;
        }
        if (canRight && grid[y][x+1] !== vacant && grid[y][x+1].team.color == color && grid[y][x+1].checked === false)
        {
            connectedIndexes.push( {"x": x+1, "y": y} );
            right = findNumberConnected(y,x+1,grid, connectedIndexes).count;
        }

        return { "count": up + left + right + down + upLeft + upRight + downLeft + downRight + 1, "indexes": connectedIndexes };
    }

    let handleClick = function( x, y )
    {
        let prepareToAttack = function( color, node, clickResults )
        {
            applyToEachNode( unselect );
            nodeSelected = false;
            if( node.team.color === turnColor && node.value > 1 )
            {
                node.selected = true;
                nodeSelected = true;
                let attackables = getAttackableNodes( node.x, node.y );
                clickResults["attackables"] = attackables;
            }
        }

        let clickResults = {};

        let node = getNode( x, y );
        if( node === vacant || node.selected )
        {
            node.selected = false;
            nodeSelected = false;
        }
        else if( !node.selected )
        {
            if( nodeSelected )
            {
                //todo attack the node, update grid, and return result to graphics engine
                if( node.team.color !== turnColor )
                {
                    let results = applyToEachNode( findAttackables );
                    for( let i = 0; i < results.attackables.length; i++ )
                    {
                        if( node.x === results.attackables[i].x && node.y === results.attackables[i].y )
                        {
                            clickResults["attacking"] = node;
                            let selectedNode = getSelectedNode();
                            if( rollDice( node ) >= rollDice( selectedNode ) )
                            {
                                selectedNode.value = 1;
                            }
                            else
                            {
                                node.value = selectedNode.value - 1;
                                node.team = selectedNode.team;
                                selectedNode.value = 1;
                            }
                        }
                    }
                    node.selected = false;
                    nodeSelected = false;
                }
                else
                {
                    prepareToAttack( turnColor, node, clickResults );
                }
            }
            else
            {
                prepareToAttack( turnColor, node, clickResults );
            }
        }

        return clickResults;
    }

    let rollDice = function( node )
    {
        let total = 0;
        for( let i = 0; i < node.value; i++ )
        {
            total += getRandomInteger(1,6);
        }
        return total;
    }

    let advanceTurn = function( graphics, board )
    {
        applyBonus();
        if( turnIndex >= teams.length - 1 )
        {
            turnIndex = 0;
            graphics.display( board );
        }
        else
        {
            turnIndex++;
        }
        turnColor = teams[turnIndex].color;

        if( turnIndex != 0 )
        {
            makeSmartAttacks( turnColor );
            setTimeout(function(){ advanceTurn(graphics, board); }, 800 );
        }
    }

    let applyBonus = function()
    {
        let bonuses = calculateDiceBonus();
        let color = teams[turnIndex].color;
        let bonus = bonuses[color].count;
        let vacancies = true;
        while( bonus > 0 && vacancies )
        {
            vacancies = false
            for( let y = 0; y < gridSize; y++ )
            {
                for( let x = 0; x < gridSize; x++ )
                {
                    let node = grid[y][x];
                    if( node != vacant )
                    {
                        if( node.team.color === color &&
                            bonus > 0 &&
                            node.value < MAX_NODE_VALUE )
                        {
                            node.value++;
                            bonus--;
                            vacancies = true;
                        }
                    }
                }
            }
        }
    }

    let makeSmartAttacks = function( color )
    {
        let attackOptions = getAttackOptions( color );
        for (const [key, value] of Object.entries(attackOptions))
        {
            let keyArray = key.split("_");
            let x = keyArray[0];
            let y = keyArray[1];
            let nodeValue = keyArray[2];
            for( let i = 0; i < value.length; i++ )
            {
                if( value[i].value < nodeValue || (value[i].value == MAX_NODE_VALUE && nodeValue == MAX_NODE_VALUE ) )
                {
                    document.getElementById(x+"_"+y).click();
                    document.getElementById(value[i].x + "_" + value[i].y).click();
                    break;
                }
            }
        }
    }

    let getAttackOptions = function( color )
    {
        let attackOptions = {};
        for( let y = 0; y < gridSize; y++ )
        {
            for( let x = 0; x < gridSize; x++ )
            {
                let node = grid[y][x];
                if( node != vacant )
                {
                    if( node.team.color === color )
                    {
                        attackOptions[x + "_" + y + "_" + node.value] = getAttackableNodes( x, y );
                    }
                }
            }
        }
        return attackOptions;
    }

    let getTurnIndex = function()
    {
        return turnIndex;
    }

    let getGameStatus = function()
    {
        let bonuses = calculateDiceBonus();
                let color = teams[turnIndex].color;
                let bonus = bonuses[color].count;
         let status = "won";
        for( let i = 0; i < teams.length; i++ )
        {
            let color = teams[i].color;
            let bonus = bonuses[color].count;
            if( i === 0 && bonus === 0 )
            {
                status = "lost";
                break;
            }
            else if( i !== 0 && bonus > 0 )
            {
                status = "inProgress";
                break;
            }
        }
        return status;
    }

	return {
		"setupBoard": setupBoard,
		"grid": grid,
		"calculateDiceBonus": calculateDiceBonus,
		"getAttackableNodes": getAttackableNodes,
		"handleClick": handleClick,
		"advanceTurn": advanceTurn,
		"getTurnIndex": getTurnIndex,
		"getGameStatus": getGameStatus
	};
}