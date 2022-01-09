import { Lib } from "./lib.js";

var Algs = {
    Astar: (x, y, start, end, walls) => {
        return _Astar(x, y, start, end, walls);
    },
    Djikstra: () => {},
    BFS: () => {},
};

var _Astar = (x, y, start, end, walls) => {
    let queue = [start];
    let visited = [];
    let cameFrom = {};
    cameFrom.start = null;

    let current = null;
    while (queue.length) {
        current = queue.shift();
        if (current == end) break;
        if (current != start) visited.push(current);

        let neighbours = Lib.getNeighbours(current, x, y, 1);
        for (let neighbour of neighbours) {
            if (walls.has(neighbour) || neighbour in cameFrom) continue;
            queue.push(neighbour);
            cameFrom[neighbour] = current;
        }
    }

    current = end;
    let path = [];
    while (current != start) {
        if (!(current in cameFrom)) return [null, null];
        current = cameFrom[current];
        path.push(current);
    }
    path.pop();
    path.reverse();
    return [path, visited];
};

export { Algs };