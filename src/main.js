import { Algorithms } from './paths.js';


var isSet; // true if all is setup
var cellSize = 21;
var tableSize = [71, 31];
var walls = {};
var start = null;
var end = null;
var pointType = 'wall'
var types = ['empty', 'wall', 'start', 'end', 'path'];
var mouseDown = false;
var algorithm = Algorithms.BFS;
var path = null;
var drawingPath = false;


function clearLastPath() {
    if (!path)
        return;

    drawingPath = true;
    for (let p of path) {
        changeCellType(null, 'empty', document.getElementById(p));
        if (walls[p])
            changeCellType(null, 'wall', document.getElementById(p));
    }
    drawingPath = false;
}

function cellAnimation(cell) {
    if (cell.className == 'cell empty') {
        cell.style.transform = 'scale(' + 1 + ')';
        return
    }

    cell.style.zIndex = 10;
    let scale = 1.0;
    let maxScale = 0.9;
    if (cell.className == 'cell path') {
        maxScale = 1.0;
    }
    let minScale = 0.2;
    let halfway = false;

    let id = null;
    clearInterval(id);
    id = setInterval(scaleAnimation, 1);

    function scaleAnimation() {
        if (scale >= maxScale && halfway) {
            clearInterval(id);
        } else {
            if (scale < minScale)
                halfway = true;
            scale += halfway ? 0.01 : -0.04;
            cell.style.transform = 'scale(' + scale.toString() + ')'
        }
    }
    return true;
}

function toggleWalls(index) {
    if (walls[index])
        delete walls[index];
    else
        walls[index] = true;
}

function toggleCellColor(cell, type) {
    cell.className = 'cell ' + type;
}

function changeCellTypeIfDragged(e, type) {
    if (type == 'start' || type == 'end')
        return
    if (mouseDown)
        changeCellType(e, type);
}

function changeCellType(e, type, _cell, anim = true, scale = 1.0) {
    let cell = e ? e.target : _cell;
    let oldType = cell.className.substr(5)
    let id = cell.id;

    let newType = null;
    let recalculate = false;
    cell.style.transform = 'scale(' + scale + ')';
    switch (type) {
        case 'empty':
            newType = 'empty';
            switch (oldType) {
                case 'start':
                    start = null;
                    break;
                case 'end':
                    end = null;
                    break;
                case 'wall':
                    toggleWalls(id);
            }
            break;

        case 'wall':
            newType = 'wall';
            switch (oldType) {
                case 'start':
                    start = null;
                    break;
                case 'end':
                    end = null;
                    break;
                case 'wall':
                    newType = 'empty'
            }
            toggleWalls(id);
            break;

        case 'start':
            if (drawingPath)
                return
            clearLastPath();
            newType = 'start';
            if (start)
                changeCellType(null, 'empty', start)
            start = cell;
            switch (oldType) {
                case 'end':
                    end = null;
                    break;
                case 'wall':
                    toggleWalls(id);
            }
            if (!drawingPath)
                recalculate = true;
            break;

        case 'end':
            if (drawingPath)
                return
            clearLastPath();
            newType = 'end';
            if (end)
                changeCellType(null, 'empty', end)
            end = cell;
            switch (oldType) {
                case 'start':
                    start = null;
                    break;
                case 'wall':
                    toggleWalls(id);
            }
            recalculate = true;
            break;

        case 'path':
            newType = 'path';
    }

    toggleCellColor(cell, newType);
    if (newType != oldType && anim)
        cellAnimation(cell)

    if (recalculate)
        calculatePath();
}

function changePointType(e) {
    let typeButton = e.target;
    pointType = typeButton.className.substr(5);
}


function setup(x, y) {
    let typeButtons = document.getElementById('TypCon');
    for (let type of types.slice(0, -1)) {
        let typeButton = document.createElement('div');
        typeButton.className = 'type ' + type;
        typeButton.onclick = function(e) { changePointType(e); };
        typeButtons.appendChild(typeButton);
    }

    let tableContainer = document.getElementById('TabCon');
    tableContainer.onmousedown = function() { mouseDown = true; }
    document.onmouseup = function() { mouseDown = false; }
    tableContainer.style.width = (cellSize * x).toString() + 'px';
    tableContainer.style.height = (cellSize * y).toString() + 'px';

    let table = document.getElementById('Tab');
    for (let i = 0; i < x; i++) {
        let column = document.createElement('div');
        column.className = 'column';
        table.appendChild(column);

        for (let j = 0; j < y; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell empty';
            let idx = j * x + i;

            cell.id = idx.toString();
            cell.style.padding = (cellSize - 1) / 2 + 'px';
            // cell.innerHTML = idx.toString();
            cell.addEventListener('mousedown', function(e) { changeCellType(e, pointType); });
            cell.addEventListener('mouseenter', function(e) { changeCellTypeIfDragged(e, pointType); });

            column.appendChild(cell);
        }
    }

    let twalls = Algorithms.Maze(...tableSize);
    for (const [key, value] of Object.entries(twalls)) {
        changeCellType(null, 'wall', document.getElementById(key), false, 0.9);
    }
}



function drawPath(cellPath, delay) {
    let id = null;
    let idx = 0;
    clearInterval(id);
    id = setInterval(drawPathCell, delay);
    let cell = cellPath[idx];

    function drawPathCell() {
        if (idx == cellPath.length) {
            drawingPath = false;
            clearInterval(id);
        } else {
            changeCellType(null, 'path', cell);
            cellAnimation(cell);
            idx += 1;
            if (idx != cellPath.length)
                cell = cellPath[idx];
        }
    }
}


function calculatePath() {
    if (start && end) {
        drawingPath = true;
        let from = parseInt(start.id);
        let to = parseInt(end.id);

        path = algorithm(from, to, tableSize[0], tableSize[1], walls)
        if (!path) {
            drawingPath = false;
            return;
        }
        let cellPath = [];
        for (let p of path)
            cellPath.push(document.getElementById(p));
        drawPath(cellPath, 1);
    }
}


setup(...tableSize);