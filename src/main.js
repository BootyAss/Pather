import { Types, Colors, Points, Logos, Lib, Mazes, Algs } from './algs.js';


var [x, y] = [null, null];
var walls = new Set();
var cellSize = 22;
var start = null;
var end = null;
var current = {
    PointType: null,
    Algorithm: Algs.Astar
}


var animateCell = (cell) => {

}

var changeCellType = (cell, type, id = null) => {
    if (id !== null)
        cell = document.getElementById(id);
    cell.className = 'cell ' + type;

    let size = cellSize;
    if (type === 'empty') {
        cell.style.border
        size -= 2
    }
    cell.style.padding = size / 2 + 'px';
    animateCell(cell);
}

var createCell = (type, id) => {
    let cell = document.createElement('div');
    cell.className = 'cell ' + type;
    cell.id = id;
    let size = cellSize;
    if (type === 'empty')
        size -= 2
    cell.style.padding = size / 2 + 'px';
    // cell.textContent = id;
    return cell;
}


var clearTable = () => {
    for (let i = 0; i < x * y; i++) {
        walls = new Set();
        changeCellType(null, 'empty', i);
    }
}


var navClickHandler = (e) => {
    let foo = null;
    switch (e.target.className) {
        case 'maze':
            for (let f in Mazes)
                if (f == e.target.textContent)
                    foo = f;
            if (!foo)
                break;
            
            clearTable();
            walls = Mazes[foo](x, y);
            for (let wall of walls)
                changeCellType(null, 'wall', wall);
            break;
        
        case 'alg':
            for (let f in Algs)
                if (f == e.target.textContent)
                    foo = f;
            if (!foo)
                break;
            
            current.Algorithm = Algs[foo];
            let path = Algs[foo](x, y, start, end, walls);
            for (let p of path)
                changeCellType(null, 'path', p);
        
        default:
            break;
    }
}

var showError = (e) => {
    console.log(e)
}

var Visualize = () => {
    if (!start || !end)
        return showError('no start/end');
    
    let path = Algs.Astar(x, y, start, end, walls);
    for (let p of path)
        changeCellType(null, 'path', p);
}

var setup = () => {
    let blocks = {
        mazes: Object.keys(Mazes),
        types: Object.keys(Types),
        colors: Object.keys(Colors),
        points: Object.keys(Points),
        logos: Object.keys(Logos),
        algs: Object.keys(Algs),
    }

    for (let [block, labels] of Object.entries(blocks)) {
        let navBlock = document.getElementById(block);
        for (let label of labels) {
            let navLabel = document.createElement('div');
            navLabel.className = block.slice(0, -1);
            if (!['colors', 'logos'].includes(block)) 
                navLabel.textContent = label;
            else
                navLabel.className = navLabel.className + ' ' + label;
            if (['logos', 'algs', 'mazes'].includes(block))
                navLabel.style.cursor = 'pointer';
                
            navLabel.onclick = navClickHandler;
            navBlock.appendChild(navLabel);
        }
    }


    let content = document.getElementById('cont');
    let tableContainer = document.getElementById('tabCon');
    if (!x || !y) {
        x = Math.floor((content.clientWidth * 0.95) / cellSize);
        y = Math.floor((content.clientHeight * 0.75) / cellSize);
        x = !(x % 2) ? x - 1 : x;
        y = !(y % 2) ? y - 1 : y;
    }
    console.log(x, y)
    let table = document.createElement('div');
    tableContainer.style.width = x * cellSize + 'px';
    tableContainer.style.height = y * cellSize + 'px';
    table.id = 'table';
    table.style.width = x * cellSize + 'px';
    table.style.height = y * cellSize + 'px';
    tableContainer.appendChild(table);

    for (let i = 0; i < y; i++) {
        let row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < x; j++) {
            let cell = createCell('empty', i * x + j);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    let visualize = document.getElementById('button');
    visualize.onclick = Visualize;

}


setup();