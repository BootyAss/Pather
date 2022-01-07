import { Algs } from './algs.js';


var [x, y] = [null, null];
var walls = null;
var cellSize = 22;


var animateCell = (cell) => {

}

var changeCellType = (cell, type, id = null) => {
    if (id !== null)
        cell = document.getElementById(id);
    cell.className = 'cell ' + type;

    let size = cellSize;
    if (type === 'empty')
        size -= 2
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
    return cell;
}

var setup = () => {
    let content = document.getElementById('cont');
    let tableContainer = document.getElementById('tabCon');
    x = Math.floor((content.clientWidth - 100) / cellSize);
    y = Math.floor((content.clientHeight - 250) / cellSize);
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
        row.id = i;
        for (let j = 0; j < x; j++) {
            let cell = createCell('empty', i * x + j);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}


setup();