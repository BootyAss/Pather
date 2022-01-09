var Types = {
    empty: 'empty',
    wall: 'wall',
    path: 'path',
    variant: 'variant',
}


var Colors = Types;


var Points = {
    wall: 'wall',
    start: 'start',
    end: 'end'
}

var Logos = Points;


var Lib = {
    rand: (len) => { return _rand(len); },
    getNeighbours: (idx, A, x, y, k) => { return _getNeighbours(idx, A, x, y, k); },
}

var _rand = (len) => {
    return Math.round(Math.random() * len);
};

var _getNeighbours = (idx, A=null, x, y, k) => {
    let indexes = [idx - k * x, idx - k, idx + k, idx + k * x];
    let checks = [idx > k * x, idx % x >= k, idx % x < x - k, idx < x * (y - 1)];
    let neighbours = []

    if (A) {
        for (let i = 0; i < 4; i++)
            if (checks[i] && !A.has(indexes[i]))
                neighbours.push(indexes[i]);
    } else {
        for (let i = 0; i < 4; i++)
            if (checks[i])
                neighbours.push(indexes[i]);
    }
    return neighbours;
}


var Algs = {
    Astar: (x, y, start, end, walls) => { return _Astar(x, y, start, end, walls); },
    Djikstra: () => { },
    BFS: () => { },
};

var _Astar = (x, y, start, end, walls) => {
    let queue = [start];
    let cameFrom = {};
    cameFrom.start = null;

    let current = null;
    while (queue.length) {
        current = queue.shift();
        if (current == end)
            break;
        
        let neighbours = Lib.getNeighbours(current, null, x, y, 1);
        for (let neighbour of neighbours) {
            if (walls.has(neighbour) || neighbour in cameFrom)
                continue;
            queue.push(neighbour);
            cameFrom[neighbour] = current;
        }
    }

    current = end;
    let path = [];
    while (current != start) {
        if (!(current in cameFrom))
            return null;
        current = cameFrom[current];
        path.push(current);
    }
    path.pop();
    path.reverse();
    return path;
    
}

var Mazes = {
    Kruskal: (x, y) => { return _Kruskal(x, y); },
}

var _Kruskal = (x, y) => {
    let walls = new Set();
    let sets = new Object();

    for (let i = 0; i < y; i++)
        for (let j = 0; j < x; j++) {
            let idx = i * x + j;
            if (i % 2 || j % 2)
                walls.add(idx);
            else
                sets[idx] = new Set([idx]);
        }

    let setsKeys = Object.keys(sets);
    while (setsKeys.length > 1) {
        let keyA = setsKeys[_rand(setsKeys.length - 1)];
        let A = sets[keyA];

        let parent = null;
        let neighbours = null;
        for (let p of A) {
            parent = p;
            neighbours = Lib.getNeighbours(parent, A, x, y, 2);
            if (neighbours.length)
                break;
        }
        if (!neighbours.length) 
            break;

        let neighbour = neighbours[_rand(neighbours.length - 1)];
        let keyB = setsKeys.find(key => sets[key].has(neighbour));
        let B = sets[keyB];
        for (let b of B)
            sets[keyA].add(b);

        walls.delete(neighbour - (neighbour - parent) / 2);
        const index = setsKeys.indexOf(keyB);
        if (index > -1)
          setsKeys.splice(index, 1);
    }

    return walls;
};

export { Types, Colors, Points, Logos, Mazes, Algs };
