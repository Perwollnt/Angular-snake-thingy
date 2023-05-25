import { Point, tileType } from "./test.component";

export class AstarPathFinder {
    private board!: tileType[][];
    private snake!: Point[];
    private openList!: Point[];
    private closedList!: Point[];
    private start!: Point;
    private end!: Point;

    constructor(board: tileType[][], snake: any[]) {
        this.board = board;
        this.snake = snake;
    }

    public update(board: tileType[][], snake: any[]) {
        this.board = board;
        this.snake = snake;
    }

    private isValidMove(toX: number, toY: number): boolean {
        if(this.snake.some(segment => segment.x === toX && segment.y === toY)) return false;

        const numRows = this.board.length;
        const numCols = this.board[0].length;

        if(toX < 0 || toX >= numRows) return false;
        if(toY < 0 || toY >= numCols) return false;

        return true;
    }

    private calculateHeuristic(point: { x: number, y: number }): number {
        return Math.abs(point.x - this.end.x) + Math.abs(point.y - this.end.y);
    }

    private getNeighbors(point: Point) {
        const {x, y} = point;
        const neighbors: Point[] = [
            {x: x - 1, y},
            {x: x + 1, y},
            {x, y: y - 1},
            {x, y: y + 1},
        ]
        return neighbors.filter(val => this.isValidMove(val.x, val.y));
    }

    

    private findPath(): Point[] {
        this.openList.push(this.start);
        while(this.openList.length > 0) {

            this.openList.sort((a, b) => {
                const costA = this.calculateHeuristic(a);
                const costB = this.calculateHeuristic(b);
                return costA - costB;
            });

            const current = this.openList.shift()!;
            this.closedList.push(current);

            if(current.x === this.end.x && current.y === this.end.y) {
                return this.reconstructPath(current);
            }

            const neighbors = this.getNeighbors(current);
            for(const neighbor of neighbors) {
                if(!this.closedList.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
                    if (!this.openList.some((point) => point.x === neighbor.x && point.y === neighbor.y)) {
                        neighbor.parent = current; // Set the current point as the parent of the neighbor
                        this.openList.push(neighbor);
                    }
                }
            }
        }
        console.log("No path :=");
        return [];
    }

    private reconstructPath(endPoint: Point): Point[] {
        const path: Point[] = [];
        let current: Point | undefined = endPoint;
        while (current) {
            path.unshift(current);
            current = current.parent;
        }

        return path;
    }

    public findBestPath(start: Point, end: Point): Point[] {
        this.openList = [];
        this.closedList = [];
        this.start = start;
        this.end = end;

        this.start.parent = undefined;
        const path = this.findPath();
        return path;
    }
}

