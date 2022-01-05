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




function getNeighbours(A, x, y) {
    let directions = {};

    let n = 0;
    for (let idx of A) {
        n = idx - 2 * x;    // top
        if (n >= 0 && !(A.includes(n))) {
            if (!directions[idx])
                directions[idx] = [];
            directions[idx].push(n);
        }
        n = idx + 2 * x;    // bot
        if (n < x * y && !(A.includes(n))) {
            if (!directions[idx])
                directions[idx] = [];
            directions[idx].push(n);
        }

        n = idx - 2;    // left
        if ((idx % x) != 0 && !(A.includes(n))) {
            if (!directions[idx])
                directions[idx] = [];
            directions[idx].push(n);
        }

        n = idx + 2;    // right
        if ((idx % x) != (x - 1) && !(A.includes(n))) {
            if (!directions[idx])
                directions[idx] = [];
            directions[idx].push(n);
        }
    }
    return directions;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].includes(value));
}

function _Maze(x, y) {
    let walls = {}
    let sets = {}
    let maxIdx = x * y;
    let out = '';
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            if (i % 2 == 0 && j % 2 == 0) {
                sets[i * x + j] = Array(1);
                sets[i * x + j][0] = i * x + j;
            }
            else
                walls[i * x + j] = true
        }
    }
    console.log(sets)

    let i = 0;
    while (i < (x * y)) {
        i++;
        let keys = Object.keys(sets);
        if (keys.length < 2) {
            break;
        }
        let keyA = parseInt(keys[rand(keys.length - 1)]);

        let nghsDict = getNeighbours(sets[keyA], x, y); // { keyA -> [keyA nghbs] } 

        let nghKeysA = (Object.keys(nghsDict));
        if (nghKeysA.length <= 0)
            continue;

        let orig = nghKeysA[rand(nghKeysA.length - 1)];
        let nghs = nghsDict[orig];                      // keyA nghbs
        let elemB = nghs[rand(nghs.length - 1)];
        let keyB = getKeyByValue(sets, elemB);

        for (let j = 0; j < sets[keyB].length; j++)
            sets[keyA].push(sets[keyB][j]);
        delete sets[keyB];
        delete walls[elemB - (elemB - orig) / 2];
    }



    return walls;
}

export { Algorithms };