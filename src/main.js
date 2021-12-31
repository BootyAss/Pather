import { Algorithms } from './paths.js';


var isSet;                 // true if all is setup
var start = null;
var end = null;
var walls = {};
var tableSize = [20, 20];
var cellSize = 32;
var pointType = 'wall'
var buttonTypes = ['empty', 'wall', 'start', 'end', 'path'];
var mouseDown = false;
var algorithm = Algorithms.BFS;
var path = null;
var drawingPath = false;


function clearLastPath() {
    if (path)
        for (let p of path)
            changeCellType(null, 'empty', document.getElementById(p));
}

function cellAnimation(cell) {
    if (cell.className == 'cell empty') {
        console.log(cell.className);
        return
    }
    cell.style.zIndex = 100;
    let scale = 1.0;
    let halfway = false;

    let id = null;
    clearInterval(id);
    id = setInterval(scaleAnimation, 1);
    function scaleAnimation() {
        if (scale == 1 && halfway) {
            clearInterval(id);
            cell.style.zIndex = 0;
        }
        else {
            if (scale < 0.7)
                halfway = true;
            scale += halfway ? 0.01 : -0.01;
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
    if (mouseDown)
        changeCellType(e, type);
}

function changeCellType(e, type, _cell) {
    let cell = e ? e.target : _cell;
    let oldType = cell.className.substr(5)
    let index = cell.getAttribute('index');

    let newType = null;
    let recalculate = false;
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
                    toggleWalls(index);
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
            toggleWalls(index);
            break;

        case 'start':
            if (drawingPath)
                return
            clearLastPath();
            newType = 'start';
            if (start)
                toggleCellColor(start, 'empty')
            start = cell;
            switch (oldType) {
                case 'end':
                    end = null;
                    break;
                case 'wall':
                    toggleWalls(index);
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
                toggleCellColor(end, 'empty')
            end = cell;
            switch (oldType) {
                case 'start':
                    start = null;
                    break;
                case 'wall':
                    toggleWalls(index);
            }
            recalculate = true;
            break;

        case 'path':
            newType = 'path';
    }

    toggleCellColor(cell, newType);
    if (newType != oldType)
        cellAnimation(cell)

    if (recalculate)
        calculatePath();
}

function changePointType(e) {
    let button = e.target;
    pointType = button.innerHTML;
}

function setup(x, y) {
    let buttons = document.getElementById('ButCon');
    for (let type of buttonTypes) {
        let button = document.createElement('div');
        button.className = 'button ' + type;
        button.innerHTML = type;
        button.onclick = function (e) { changePointType(e); };
        buttons.appendChild(button);
    }

    let tableContainer = document.getElementById('TabCon');
    tableContainer.onmousedown = function () { mouseDown = true; }
    document.onmouseup = function () { mouseDown = false; }
    tableContainer.style.width = (cellSize * x).toString() + 'px';
    tableContainer.style.height = (cellSize * y).toString() + 'px';

    let table = document.getElementById('Tab');
    for (let i = 0; i < y; i++) {
        let column = document.createElement('div');
        column.className = 'column';
        table.appendChild(column);

        for (let j = 0; j < x; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell empty';
            let idx = j * x + i;

            cell.id = idx.toString();
            cell.addEventListener('mousedown', function (e) { changeCellType(e, pointType); });
            cell.addEventListener('mouseenter', function (e) { changeCellTypeIfDragged(e, pointType); });

            column.appendChild(cell);
        }
    }
}



function drawPath(cellPath, delay) {
    let id = null;
    let idx = 0;
    clearInterval(id);
    id = setInterval(drawPathCell, delay);
    let cell = cellPath[idx];
    function drawPathCell() {
        if (cellPath.length == idx) {
            clearInterval(id);
            drawingPath = false;
        }
        else {
            changeCellType(null, 'path', cell);
            cellAnimation(cell);
            idx += 1;
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
        let cellPath = [];
        for (let p of path)
            cellPath.push(document.getElementById(p));
        drawPath(cellPath, 10);
    }
}


setup(...tableSize);
