import { TestComponent } from "./test.component";

export class HamiltonianCylce {
    V: number = 5;
    path: number[] = [];

    /* A utility function to check if the vertex v can be
       added at index 'pos'in the Hamiltonian Cycle
       constructed so far (stored in 'path[]') */
    private isSafe(v: number, graph: number[][], path: number[], pos: number): boolean {

        /* Check if this vertex is an adjacent vertex of
           the previously added vertex. */
        if (graph[path[pos - 1]][v] !== 0) {
            return false;
        }

        /* Check if the vertex has already been included.
           This step can be optimized by creating an array
           of size V */
        for (let i = 0; i < pos; i++) {
            if (path[i] === v) return false;
        }

        return true;
    }

    private hamCycleUtil(graph: number[][], path: number[], pos: number): boolean {
        if (pos == this.V) {
            // And if there is an edge from the last included
            // vertex to the first vertex
            if (graph[path[pos - 1]][path[0]] === 0)
                return true;
            else
                return false;
        }

        // Try different vertices as a next candidate in
        // Hamiltonian Cycle. We don't try for 0 as we
        // included 0 as starting point in hamCycle()
        for (let v = 1; v < this.V; v++) {
            /* Check if this vertex can be added to Hamiltonian
               Cycle */
            if (this.isSafe(v, graph, path, pos)) {
                path[pos] = v;

                /* recur to construct rest of the path */
                if (this.hamCycleUtil(graph, path, pos + 1) == true)
                    return true;

                /* If adding vertex v doesn't lead to a solution,
                   then remove it */
                path[pos] = -1;
            }
        }
        /* If no vertex can be added to Hamiltonian Cycle
           constructed so far, then return false */
        return false;
    }

    /* This function solves the Hamiltonian Cycle problem using
       Backtracking. It mainly uses hamCycleUtil() to solve the
       problem. It returns false if there is no Hamiltonian Cycle
       possible, otherwise return true and prints the path.
       Please note that there may be more than one solutions,
       this function prints one of the feasible solutions. */
    public hamCycle(graph: number[][]) {
        this.path = new Array(this.V).fill(0);

        for (let i = 0; i < this.V; i++) {
            this.path[i] = -1;
        }

        this.path[0] = 0;

        if (this.hamCycleUtil(graph, this.path, 1) === false) {
            console.log(`Solution does not exist`);
            return null;
        }

        const coordinates: [number, number][] = [];
        for (let i = 0; i < this.V; i++) {
            const x = Math.floor(this.path[i] / graph.length);
            const y = this.path[i] % graph.length;
            coordinates.push([x, y]);
        }

        return coordinates;
    }
    // This only generates path, it's okey can be used if really needed;
    public hamCycleTwo(graph: number[][]): [number, number][] | null {
        const numRows = graph.length;
        const numCols = graph[0].length;

        const visited = Array.from(Array(numRows), () => Array(numCols).fill(false));
        const coordinates: [number, number][] = [];

        const isValidMove = (x: number, y: number) => {
            return x >= 0 && x < numRows && y >= 0 && y < numCols && graph[x][y] !== 9 && !visited[x][y];
        };

        const traverse = (x: number, y: number): boolean => {
            visited[x][y] = true;
            coordinates.push([x, y]);

            if (coordinates.length === numRows * numCols) {
                return true; // Entire map has been traversed
            }

            const dx = [0, 0, 1, -1];
            const dy = [1, -1, 0, 0];

            for (let i = 0; i < 4; i++) {
                const newX = x + dx[i];
                const newY = y + dy[i];

                if (isValidMove(newX, newY)) {
                    if (traverse(newX, newY)) {
                        return true;
                    }
                }
            }

            // Backtrack if no valid moves found
            visited[x][y] = false;
            coordinates.pop();

            return false;
        };

        // Start from each cell and try to traverse the map
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (traverse(i, j)) {
                    return coordinates; // Return the path if found
                }
            }
        }

        console.log(`Solution does not exist`);
        return null;
    }


    public HamCycleThree(graph: number[][]): [number, number][] | null {
        const numRows = graph.length;
        const numCols = graph[0].length;

        const visited = Array.from(Array(numRows), () => Array(numCols).fill(false));
        const coordinates: [number, number][] = [];

        const isValidMove = (x: number, y: number) => {
            return x >= 0 && x < numRows && y >= 0 && y < numCols && graph[x][y] !== 9 && !visited[x][y];
        };

        const traverse = (x: number, y: number, count: number): boolean => {
            visited[x][y] = true;
            coordinates.push([x, y]);

            if (count === numRows * numCols) {
                // Check if the cycle is closed by returning to the starting point
                const dx = [0, 0, 1, -1];
                const dy = [1, -1, 0, 0];

                for (let i = 0; i < 4; i++) {
                    const newX = x + dx[i];
                    const newY = y + dy[i];

                    if (newX === coordinates[0][0] && newY === coordinates[0][1]) {
                        return true; // Hamiltonian cycle found
                    }
                }

                // Not a valid Hamiltonian cycle, backtrack
                visited[x][y] = false;
                coordinates.pop();
                return false;
            }

            const dx = [0, 0, 1, -1];
            const dy = [1, -1, 0, 0];

            for (let i = 0; i < 4; i++) {
                const newX = x + dx[i];
                const newY = y + dy[i];

                if (isValidMove(newX, newY)) {
                    if (traverse(newX, newY, count + 1)) {
                        return true;
                    }
                }
            }

            // Backtrack if no valid moves found
            visited[x][y] = false;
            coordinates.pop();

            return false;
        };

        // Start from each cell and try to traverse the map
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (traverse(i, j, 1)) {
                    TestComponent.accessibleArea = coordinates;
                    TestComponent.pathgenerated = true;
                    return coordinates; // Return the Hamiltonian cycle if found
                }
            }
        }

        console.log(`Hamiltonian cycle does not exist`);
        return null;
    }
}
