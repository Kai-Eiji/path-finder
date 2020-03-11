import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';
import {ButtonToolbar, Button, DropdownItem, DropdownButton} from 'react-bootstrap';


const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
const ROW_NUM = 20;
const COL_NUM = 50;

export default class PathfindingVisualizer extends Component
{
    constructor()
    {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    resetGrid()
    {
        window.location.reload(false);
    }

    seed()
    {
        for(let row = 0; row < ROW_NUM; row++){
            for(let col = 0; col < COL_NUM; col++){
                if(Math.floor(Math.random() * 7) === 1){ //giving 1/7 of chances to make it ture
                    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                    this.setState({grid: newGrid});
                }
            }
        }
        
    }

    componentDidMount()//initializing the 2D array for nodes
    {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col)
    {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col)
    {
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp()
    {
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitNodesInOrder, nodesInShortestPathOrder)
    {
        for(let i = 0; i <= visitNodesInOrder.length; i++)
        {
            if(i === visitNodesInOrder.length)
            {
                setTimeout( () => 
                {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout( () => 
            {
                const node = visitNodesInOrder[i];
                //console.log(document.getElementById(`node-${node.row}-${node.col}`))
                //console.log(node);
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder)
    {
        for(let i = 0; i < nodesInShortestPathOrder.length; i++)
        {
            setTimeout( () => 
            {
                const node = nodesInShortestPathOrder[i];
               // console.log(i);
               // console.log(nodesInShortestPathOrder);
               // console.log(nodesInShortestPathOrder[i]);
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra()
    {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitNodesInOrder, nodesInShortestPathOrder);
       // console.log(visitNodesInOrder);
    }

    render()// iterate through the 2D array and render the Node component
    {
        const {grid, mouseIsPressed} = this.state;
        console.log(grid);

        return(
            <div>
                <ButtonToolbar>
                    <Button variant="outline-primary" onClick={() => this.resetGrid()}>Reset</Button>
                    <Button variant="outline-secondary" onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</Button>
                    <Button variant="outline-info" onClick={() => this.seed()}>Seed Walls</Button>
                </ButtonToolbar>
                

                <div className="grid">
                {grid.map((row, rowIndex) => {
                    return(
                            <div key = {rowIndex}>
                                {row.map( (node, nodeIdx) => 
                                    {
                                        const {isStart, isFinish, isWall, col, row} = node;
                                        return(
                                            <Node 
                                                key={nodeIdx}
                                                col={col} 
                                                isStart={isStart} 
                                                isFinish={isFinish} 
                                                isWall={isWall}
                                                mouseIsPressed={mouseIsPressed}
                                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                                onMouseUp={() => this.handleMouseUp()}
                                                row={row}>
                                            </Node>
                                        );                       
                                    })
                                }
                            </div>
                        );
                })}
                </div>
            </div>
        );
    }
}

const getInitialGrid = () =>
{
    const grid = [];
    for(let row = 0; row < ROW_NUM; row++)
    {
        const currentRow = [];
        for(let col = 0; col < COL_NUM; col++)
        {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) =>
{
    return{
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisualized: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => 
{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};