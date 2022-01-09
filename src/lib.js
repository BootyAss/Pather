var Types = {
    empty: 'empty',
    wall: 'wall',
    path: 'path',
    visited: 'visited',
}

var Colors = Types;

var Points = {
    wall: 'wall',
    start: 'start',
    end: 'end'
}
var Logos = Points;

var AnimSpeeds = {
    slow: 0.02,
    average: 0.1,
    fast: 1.0,
    instant: 2.0
}


var Lib = {
    rand: (len) => { return _rand(len); },
    getNeighbours: (idx, x, y, k) => { return _getNeighbours(idx, x, y, k); },
    getNeighbour: (idx, dir, x, y, k) => { return _getNeighbour(idx, dir, x, y, k); },
}

var _rand = (len) => {
    return Math.round(Math.random() * len);
};


var _getNeighbour = (idx, dir, x, y, k) => {
    let res = [idx - k * x, idx - k, idx + k * x, idx + k];
    let checks = [idx > k * x, idx % x >= k, idx < x * (y - 1), idx % x < x - k];
    let ret = [null, true]

    if (dir < 0 || dir > 3)
        return ret;

    ret[0] = res[dir]
    if (checks[dir] && ret[0] >= 0 && ret[0] < x * y)
        ret[1] = false;

    return ret;
}

var _getNeighbours = (idx, x, y, k) => {
    let neighbours = []

    for (let i = 0; i < 4; i++) {
        let neighbour = _getNeighbour(idx, i, x, y, k)
        if (!neighbour[1])
            neighbours.push(neighbour[0]);
    }

    return neighbours;
}

export { Types, Colors, Points, Logos, AnimSpeeds, Lib };