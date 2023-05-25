import { Point, tileType } from "./test.component";

export class FloodFill {
    private board!: boolean[][];
    private snake: Point[];
    private food: Point;
    private MAP_WIDTH;

    constructor(snake: Point[], food: Point, map: number) {
        this.snake = snake;
        this.food = food;
        this.MAP_WIDTH = map;
        this.board = this.createEmptyBoard();
        this.updateBoard();
    }

    private createEmptyBoard(): boolean[][] {
        const board = [];
        for(let i = 0; i < this.MAP_WIDTH; i++) {
            const row = [];
            for(let j = 0; j < this.MAP_WIDTH; j++) {
                row.push(false);
            }
            board.push(row);
        }
        return board;
    }

    private updateBoard(): void {
        this.snake.forEach(point => this.board[point.y][point.x] = true);
        this.board[this.food.y][this.food.x] = true;
    }

    private isAccessible(x: number, y: number): boolean {

        if(x < 0 || x >= this.MAP_WIDTH) return false;
        if(y < 0 || y >= this.MAP_WIDTH) return false;

        return !this.board[y][x];
    }

    private countEmpty(): number {
        let c = 0;

        for(let row of this.board) {
            for(let cell of row) {
                if(!cell) c++;
            }
        }

        return c;
    }

    public hasEnoughSpace(percentage: number): boolean {
        const empty = this.countEmpty();
        const total = this.MAP_WIDTH * this.MAP_WIDTH;
        return empty / total >= percentage / 100;
    }

    public findAccessibleArea(startX: number, startY: number): number[][] {
        const area: number[][] = [];
        const queue: number[][] = [];

        queue.push([startX, startY]);
        area.push([startX, startY]);

        this.board[startY][startX] = true;
        while(queue.length > 0) {
             const [x, y] = queue.shift()!;
             const neighbors : number[][] = [
                [ x - 1, y ],
                [ x + 1, y ],
                [ x, y - 1 ],
                [ x, y + 1 ],
             ]

             for(const [nx, ny] of neighbors) {
                if(this.isAccessible(nx, ny) && !this.isInArea(nx, ny, area)) {
                    queue.push([nx ,ny]);
                    area.push([nx ,ny]);
                    this.board[ny][nx] = true;
                }
             }
        }
        return area;
    }

    public async actuallyDoIt(map: number[][], startX: number, startY: number): Promise<number[][] | null> {
        const rows = map.length;
        const cols = map[0].length;
        const visited: number[][] = Array.from( { length: rows }, () => Array(cols).fill(0) );
        const queue: [number, number][] = [];

        if(startX < 0 || startX >= rows) return null;
        if(startY < 0 || startY >= cols) return null;

        const isValidCell = (x: number, y: number) => {
            return x >= 0 && x < rows && y >= 0 && y < cols && visited[x][y] === 0 && map[x][y] !== 1;
        }

        queue.push([startX, startY]);
        let iterations = 0;

        while(queue.length > 0) {
            iterations++;
            console.log(`Iteration: ${iterations}`);

            const [x, y] = queue.shift()!;
            visited[x][y] = 3;

            // Visit the neighboring cells
            const neighbors: [number, number][] = [
                [x - 1, y], // Up
                [x + 1, y], // Down
                [x, y - 1], // Left
                [x, y + 1]  // Right
            ];

            for(const [nx, ny] of neighbors) {
                if(isValidCell(nx ,ny)) {
                    queue.push([nx ,ny]);
                }
            }
        }
        return visited;

    }

    private isInArea(x: number, y: number, area: number[][]): boolean {
        return area.some(([px, py]) => px === x && py === y);
    }


}
