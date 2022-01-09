import { Types, Colors, Points, Logos, Mazes, Algs } from './algs.js';


var [x, y] = [null, null];
var [xPerc, yPerc] = [0.95, 0.75];
var cellSize = 10;
var start = null;
var end = null;

var walls = new Set();
var current = {
    animatedMazes: false,
    animationSpeed: 'inst',
    drawing: false,
    PointType: 'wall',
    Algorithm: Algs.Astar
}

var animationSpeeds = {
    slow: 0.02,
    avrg: 0.1,
    fast: 0.5,
    lght: 1.0,
    inst: 2
}

var startCellAnimation = (cell) => {
    return new Promise(resolve => {
        let minScale = 0.1;
        let maxScale = 1.0;
        let delta = animationSpeeds[current.animationSpeed];
        if (current.animationSpeed == 'inst')
            resolve(true);
        let scale = minScale;
        cell.style.transform = 'scale(' + scale + ')';

        let timer = setInterval(animateCell, 1);
        let allow = true;
        function animateCell() {
            if (scale >= maxScale - delta) {
                allow = false;
                cell.style.transform = 'scale(' + maxScale.toString() + ')';
                resolve(true);
                clearInterval(timer);
            }
            if (allow) {
                scale += delta;
                cell.style.transform = 'scale(' + scale.toString() + ')';
            }
        }
    });
}

var changeCellType = async (cell, type, id = null, anim=true) => {
    if (id !== null)
        cell = document.getElementById(id);
        
    let oldClass = cell.className.substring(5);
    cell.className = 'cell ' + type;

    let size = cellSize;
    if (type == 'empty') {
        cell.style.border
        size -= 2
    }
    cell.style.padding = size / 2 + 'px';
    if (anim)
        return startCellAnimation(cell).then(ret => true);
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
        changeCellType(null, 'empty', i, false);
    }
    start = null;
    end = null;
}

var clearAllOfType = (type) => {
    for (let i = 0; i < x * y; i++) {
        let cell = document.getElementById(i);
        if (cell.className.substring(5) != type)
            continue;
        
        if (cell.className.substring(5) == 'wall')
            walls.delete(i);
        changeCellType(cell, 'empty', null, false);
    }

}

var changeArrayOfCells = async (cells, type, anim=true) => {
    if (current.drawing)
        return
    current.drawing = true;
    for (let cell of cells) {
        let ret = await changeCellType(null, type, cell, anim);
    }
    current.drawing = false;
}

var getFromModule = (name, module) => {
    for (let f in module)
        if (f == name)
            return f
}

var navClickHandler = (e) => {
    let foo = null;
    switch (e.target.className) {
        case 'maze':
            foo = getFromModule(e.target.textContent, Mazes)
            if (!foo)
                break;
            
            if (current.drawing)
                return
            
            clearTable();
            walls = Mazes[foo](x, y);
            changeArrayOfCells(walls, 'wall', current.animatedMazes);
            break;
        
        case 'alg':
            foo = getFromModule(e.target.textContent, Algs)
            if (!foo)
                break;
            
            if (current.drawing)
                return
            
            current.Algorithm = Algs[foo];
            break;        
        case 'logo start':
            current.PointType = 'start';
            break
        case 'logo end':
            current.PointType = 'end';
            break;
        case 'logo wall':
            current.PointType = 'wall';
            break
    }

}

var cellClickHandler = (e) => {
    let newType = current.PointType;
    let oldType = e.target.className.substring(5);
    let id = parseInt(e.target.id)
    switch (newType) {
        case 'wall':
            switch (oldType) {
                case 'wall':
                    newType = 'empty';
                    walls.delete(id);
                    break;
                case 'start':
                    start = null;
                    walls.add(id);
                    break;
                case 'end':
                    end = null;
                    walls.add(id);
                    break;
                default:
                    walls.add(id);
            }
            break;
        
        case 'start':
            if (start != null)
                changeCellType(null, 'empty', start, true);
            start = id;

            switch (oldType) {
                case 'wall':
                    walls.delete(id);
                    break;
                case 'end':
                    end = null;
            }
            break;
        
        case 'end':
            if (end != null)
                changeCellType(null, 'empty', end, true);
            end = id;

            switch (oldType) {
                case 'wall':
                    walls.delete(id);
                    break;
                case 'start':
                    start = null;
            }
            break;
    }
    changeCellType(null, newType, id, true);
}

var Visualize = () => {
    if (start === null || end === null) {
        alert('No start/end node')
        return;
    }
    clearAllOfType('path');

    let path = current.Algorithm(parseInt(x), parseInt(y), parseInt(start), parseInt(end), walls);
    if (path == null)
        alert('Couldn\'t find path')
    else
        changeArrayOfCells(path, 'path');
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
        x = Math.floor((content.clientWidth * xPerc) / cellSize);
        y = Math.floor((content.clientHeight * yPerc) / cellSize);
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
        let type = 'empty';
        for (let j = 0; j < x; j++) {
            let cell = createCell(type, i * x + j);
            cell.onclick = cellClickHandler;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    changeCellType(null, 'start', 0);
    changeCellType(null, 'end', x * y - 1);
    start = 0;
    end = x * y - 1;

    let visualize = document.getElementById('button');
    visualize.onclick = Visualize;
}


setup();