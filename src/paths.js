var Algorithms = {
    Astar: function (e) { _Astar(e) },
    Dijkstra: function (e) { _Dijkstra(e) },
    BFS: function (start, end, x, y, walls) { return _BFS(start, end, x, y, walls) },
    diagonalMoves: true
};

function _Astar(e) { return e; };
function _Dijkstra(e) { return e; };


function getReachableNeighbours(idx, x, y) {
    let directions = [];
    if (idx >= x)
        directions.push(idx - x);   // top
    if (idx < x * y)
        directions.push(idx + x);   // bot
    if (idx % x != 0)
        directions.push(idx - 1);   // left
    if (idx % x != x - 1)
        directions.push(idx + 1);   // right

    if (!Algorithms.diagonalMoves)
        return directions;

    if (idx >= x && idx % x != 0)
        directions.push(idx - x - 1);   // top-left
    if (idx < x * y && idx % x != x - 1)
        directions.push(idx - x + 1);   // top-right
    if (idx % x != 0 && idx % x != 0)
        directions.push(idx + x - 1);   // bot-left
    if (idx % x != x - 1 && idx % x != x - 1)
        directions.push(idx + x + 1);   // bot-right

    return directions;
}

function getLegalNeighbours(idx, x, y, walls) {
    let neighbours = getReachableNeighbours(idx, x, y);
    for (let i in neighbours) {
        if (walls[neighbours[i]])
            delete neighbours[i];
    }
    return neighbours;
}


function _BFS(start, end, x, y, walls) {
    let queue = [];
    queue.push(start);

    let cameFrom = {};
    cameFrom[start] = null;


    let current = 0;
    while (queue.length) {
        current = queue.shift();

        if (current == end)
            break

        let neighbours = getLegalNeighbours(current, x, y, walls);

        for (let neighbour of neighbours) {
            if (!cameFrom[neighbour]) {
                queue.push(neighbour);
                cameFrom[neighbour] = current;
            }
        }
    }

    current = end;
    let path = [current];

    while (current != start) {
        current = cameFrom[current];
        path.push(current);
    }
    path.pop();
    path.shift();
    path.reverse();

    return path;
}

export { Algorithms };