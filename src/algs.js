var Types = {
    empty: 'empty',
    wall: 'wall',
    path: 'path',
    variant: 'variant',
}


var Colors = Types;


var Points = {
    start: 'start',
    end: 'end'
}

var Logos = Points;


var Lib = {
    rand: (len) => { return _rand(len); },
}

var _rand = (len) => {
    return Math.round(Math.random() * len);
};


var Algs = {
    Astar: (x, y, start, end, walls) => { return _Astar(x, y, start, end, walls); },
    Djikstra: () => { },
    BFS: () => { },
};

var _Astar = (x, y, start, end, walls) => {
    return [0, x, 2 * x, 2 * x + 1, 2 * x + 2, 2 * x + 3, 2 * x + 4];
}

var Mazes = {
    Kruskal: (x, y) => { return _Kruskal(x, y); },
}

var getNeighbours = (idx, A, x, y) => {
    let indexes = [idx - 2 * x, idx - 2, idx + 2, idx + 2 * x];
    let checks = [idx > 2 * x, idx % x > 1, idx % x < x - 2, idx < x * (y - 1)];
    let neighbours = []

    for (let i = 0; i < 4; i++) {
        if (checks[i] && !A.has(indexes[i]))
            neighbours.push(indexes[i]);
    }
    return neighbours;
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
            neighbours = getNeighbours(parent, A, x, y);
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

export { Types, Colors, Points, Logos, Lib, Mazes, Algs };
