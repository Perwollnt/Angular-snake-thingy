import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HamiltonianCylce } from './hamiltonian';
import { AstarPathFinder } from './AstartPathFinder';
import { FloodFill } from './FloodFill';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  @ViewChild('gameBoard', { static: true }) gameBoardRef!: ElementRef;
  private GAME_SIZE: number = 6;

  tileEnum = tileType;

  public get gameBoard(): HTMLDivElement {
    return this.gameBoardRef.nativeElement;
  }

  board: tileType[][] = [];
  snake!: Point[];
  food!: Point;
  intervalId!: any;
  lastPath!: Point[];

  public static accessibleArea: [number, number][] | null = [];
  public static pathgenerated = false;

  private hamil: HamiltonianCylce = new HamiltonianCylce();

  constructor(private renderer: Renderer2) { }

  async ngOnInit(): Promise<void> {
    this.initializeBoard();
    this.adjustBoardSize();
    this.initSnake();
    await this.startGame();
    this.placeFood();
  }

  private initializeBoard() {
    this.board = [];

    for (let i = 0; i < this.GAME_SIZE; i++) {
      this.board[i] = [];

      for (let j = 0; j < this.GAME_SIZE; j++) {
        this.board[i][j] = tileType.EMPTY;
      }
    }
  }

  private adjustBoardSize() {
    console.log(`Trying to resize game to fit user screen better`);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    console.log(screenHeight, screenWidth);

    const maxCellSize = Math.min(screenWidth, screenHeight) / this.GAME_SIZE;

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
      cell = cell as HTMLDivElement;
      cell.setAttribute('style', `width: ${maxCellSize}px; height: ${maxCellSize}px;`);
    });
  }

  private initSnake() {
    this.snake = [{ x: 0, y: 0 }];
    this.setCell(0, 0, tileType.SNAKEHEAD);
  }

  private placeFood() {
    let x = Math.floor(Math.random() * this.GAME_SIZE);
    let y = Math.floor(Math.random() * this.GAME_SIZE);
    while (this.isSnakeBody(x, y)) {
      x = Math.floor(Math.random() * this.GAME_SIZE);
      y = Math.floor(Math.random() * this.GAME_SIZE);
    }
    this.food = { x: x, y: y };
    this.setCell(x, y, tileType.APPLE);
  }

  private async startGame() {
    this.intervalId = setInterval(() => {
      //console.log(`Moving snake...`, Math.random() * 20);
      this.moveSnake();
      //const cycle: HamiltonianCylce = new HamiltonianCylce(this.board, this.snake);
      //cycle.generateHamiltonianPath();

    }, 100);
  }

  private gameOver() {
    clearInterval(this.intervalId);
    console.log("Game over!");
    this.ngOnInit();
  }

  private async moveSnake() {
    const head = this.snake[0];
    const [x, y] = [head.x, head.y];
    const [dx, dy] = await this.getDirection();
    const newX = x + dx;
    const newY = y + dy;

    if (this.isOutOfBounds(newX, newY) || this.isSnakeBody(newX, newY)) {
      this.gameOver();
      return;
    }

    this.setCell(x, y, tileType.SNAKEBODY);
    this.snake.unshift({ x: newX, y: newY });
    this.setCell(newX, newY, tileType.SNAKEHEAD);

    if (this.isFood(newX, newY)) {
      this.eatFood();
    }
    const tail = this.snake.pop();
    this.setCell(tail!.x, tail!.y, tileType.EMPTY);
  }

  private async isValidMove(x: number, y: number) {
    if(x < 0 || x > this.GAME_SIZE) return false;
    if(y < 0 || y > this.GAME_SIZE) return false;
    if(this.snake.some(val => val.x === x && val.y === y)) return false;
    return true;
  }

  private getRandomPoint(list: number[][]): [number, number] | null {
    const validPoints: [number, number][] = [];

    for(let i = 0; i < list.length; i++) {
      for(let j = 0; j < list[i].length; j++) {
        if(list[i][j] === 2) {
          validPoints.push([i, j]);
        }
      }
    }
    if(validPoints.length === 0) {
      return null;
    }

    return validPoints[Math.floor(Math.random() * validPoints.length)];
  }

  private getMove(x: number, y: number): [number, number] {

    if(!TestComponent.accessibleArea) return [0 ,0];
    
    let index = -1;

    for(let e = 0; e < TestComponent.accessibleArea!.length; e++) {
      if(TestComponent.accessibleArea![e][0] === x && TestComponent.accessibleArea![e][1] === y) {
        index = e;
      }
    }

    let current = [x, y];
    let next = TestComponent.accessibleArea![index + 1];
    if(!next) next = TestComponent.accessibleArea![0];
    // //console.log(this.board);
    let movement = [current[0] - next[0], current[1] - next[1]];
    // //console.log(current, next, movement);
    movement = [ movement[0] * -1, movement[1] * -1];
    //console.log(this.accessibleArea);
    
    //return [0, 1]; // => jobbfele
    return [movement[0], movement[1]];

  }

  private async getDirection(): Promise<[number, number]> {
    let movement: [number, number] = [0, 0];
    const pathFinder: AstarPathFinder = new AstarPathFinder(this.board, this.snake);
    const floodFill: FloodFill = new FloodFill(this.snake, this.food, this.GAME_SIZE);
    const hamiltonian: HamiltonianCylce = new HamiltonianCylce();

    if(TestComponent.pathgenerated) {
      // path has been generated we can use it
      let move = this.getMove(this.snake[0].x, this.snake[0].y);
      movement = move;
      console.log(movement);
      console.log("Path GO brrrrrrrrr");
    } else {
      // no ham cycle we use astar for this
      let path = pathFinder.findBestPath(this.snake[0], this.food);
      let next = path[1];
      if(!next) {
        // no path no cycle wtf
        console.log(`NO PATH NO CYCLE, Guess I'll just die ^.^`);
        // dev stop game
        clearInterval(this.intervalId);
      }
      console.log("Snake AI GO brrrrrrrrr");
      let [snakex, snakey] = [this.snake[0].x, this.snake[0].y];
      let [pathx, pathy] = [next.x, next.y];


      if(snakex < pathx) {
        movement[0] = 1; //right
      } else if(snakex > pathx) {
        movement[0] = -1; // left
      } else if(snakey < pathy) {
        movement[1] = 1; // down
      } else if(snakey > pathy) {
        movement[1] = -1; // up
      }

    }

    return movement;

  }

  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= this.GAME_SIZE || y < 0 || y >= this.GAME_SIZE;
  }

  isSnakeBody(xpos: number, ypos: number): boolean {
    return this.snake.some(({ x, y }) => x === xpos && y === ypos);
  }

  isFood(x: number, y: number): boolean {
    return this.food.x === x && this.food.y === y;
  }

  eatFood() {
    //this.snake.push([]);
    const tail = this.snake[this.snake.length - 1];
    this.snake.push(tail);
    //console.log(this.snake);
    this.placeFood();
    
  }

  setCell(x: number, y: number, tile: tileType) {
    if (!this.board[x]) {
      this.board[x] = [];
    }
    this.board[x][y] = tile;
  }

}


export enum direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export enum tileType {
  APPLE = 3,
  SNAKEHEAD = 1,
  SNAKEBODY = 2,
  EMPTY = 0,
}

export interface Point {
  x: number,
  y: number,
  parent?: Point,
}
