var Algorithms = {
    Astar: function (e) { _Astar(e) },
    Dijkstra: function (e) { _Dijkstra(e) },
    BFS: function (start, end, x, y, walls) { return _BFS(start, end, x, y, walls) },
    Maze: function (x, y) { return _Maze(x, y) },
    diagonalMoves: false
};

function _Astar(e) { return e; };
function _Dijkstra(e) { return e; };


function getReachableNeighbours(idx, x, y) {
    let directions = [];
    if (idx >= x)
        directions.push(idx - x);   // top
    if (idx < x * (y - 1))
        directions.push(idx + x);   // bot
    if ((idx % x) != 0)
        directions.push(idx - 1);   // left
    if ((idx % x) != (x - 1))
        directions.push(idx + 1);   // right

    if (!Algorithms.diagonalMoves)
        return directions;

    if (idx >= x && idx % x != 0)
        directions.push(idx - x - 1);   // top-left
    if (idx < x * (y - 1) && idx % x != x - 1)
        directions.push(idx - x + 1);   // top-right
    if (idx % x != 0 && idx % x != 0)
        directions.push(idx + x - 1);   // bot-left
    if (idx % x != x - 1 && idx % x != x - 1)
        directions.push(idx + x + 1);   // bot-right

    return directions;
}

function getLegalNeighbours(idx, x, y, walls) {
    let directions = getReachableNeighbours(idx, x, y);
    let neighbours = [];
    for (let i = 0; i < directions.length; i++) {
        if (!walls[directions[i]])
            neighbours.push(directions[i]);
    }
    return neighbours;
}


function _BFS(start, end, x, y, walls) {
    // console.log(start, end, x, y, walls)
    let queue = [];
    queue.push(start);

    let cameFrom = {};
    cameFrom[start] = null;


    let current = null;
    while (queue.length) {
        current = queue.shift();

        if (current == end)
            break

        let neighbours = getLegalNeighbours(current, x, y, walls);

        for (let neighbour of neighbours) {
            if (!(neighbour in cameFrom)) {
                queue.push(neighbour);
                cameFrom[neighbour] = current;
            }
        }
    }

    current = end;
    let path = [current];

    while (current != start) {
        if (!(current in cameFrom))
            return null;
        current = cameFrom[current];
        path.push(current);
    }
    path.pop();
    path.shift();
    path.reverse();

    return path;
}

function rand(len) {
    return Math.round(Math.random() * len);
}

function _Maze(x, y) {
    let walls = {}
    for (let i = 1; i < x; i += 2) {
        for (let j = 1; j < y; j += 2) {
            let d = i + j * x;
            if (d < x * y)
                walls[d] = true;
            d = (i + rand(2) - 1) + (j + rand(2) - 1) * x;
            if (d < x * y)
                walls[d] = true;
        }
    }
    return walls;
}

export { Algorithms };