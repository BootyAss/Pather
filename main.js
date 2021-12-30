var isSet;
var walls = null;
var pointType = 'wall'
var start = null;
var end = null;
var mouseDown = false;
var cellSize = 31;

let tableSize = [20, 20];
let buttonTypes = ['empty', 'wall', 'start', 'end'];


function cellAnimation(cell) {
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
}

function toggleWalls(i, j) {
    walls[i][j] += 1;
    walls[i][j] %= 2;
}

function toggleCellColor(cell, type) {
    cell.className = 'cell ' + type;
}

function changeCellTypeIfDragged(e) {
    if (mouseDown)
        changeCellType(e);
}

function changeCellType(e) {
    let cell = e.target;
    let oldType = cell.className.substr(5)

    let i = cell.getAttribute('i');
    let j = cell.getAttribute('j');

    let newType = null;
    switch (pointType) {
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
                    toggleWalls(i, j);
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
            toggleWalls(i, j);
            break;

        case 'start':
            newType = 'start';
            if (start)
                toggleCellColor(start, 'empty')
            start = cell;
            switch (oldType) {
                case 'end':
                    end = null;
                    break;
                case 'wall':
                    toggleWalls(i, j);
            }
            break;

        case 'end':
            newType = 'end';
            if (end)
                toggleCellColor(end, 'empty')
            end = cell;
            switch (oldType) {
                case 'start':
                    start = null;
                    break;
                case 'wall':
                    toggleWalls(i, j);
            }
            break;
    }

    toggleCellColor(cell, newType);
    if (newType != oldType)
        cellAnimation(cell)
}

function changePointType(e) {
    button = e.target;
    pointType = button.innerHTML;
}

function setup(x, y) {
    walls = new Array(y);
    for (let i = 0; i < y; i++) {
        walls[i] = new Array(x).fill(0);
    }

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
    tableContainer.onmouseup = function () { mouseDown = false; }
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
            cell.setAttribute('i', j.toString());
            cell.setAttribute('j', i.toString());
            cell.addEventListener('mousedown', function (e) { changeCellType(e); });
            cell.addEventListener('mouseenter', function (e) { changeCellTypeIfDragged(e); });

            column.appendChild(cell);
        }
    }

}


if (!isSet) {
    isSet = true;
    setup(...tableSize);
}

