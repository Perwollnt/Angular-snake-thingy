# Angular snake components

## This is a project I started working on but never finished. Feel free to use it if you want.

### What can you find here?

## Astar.ts =>
 find the shortest path between two points

```ts
AstarPathFinder#findBestPath

/* The constructor needs the board and the snake
 * board: A 2d array | tileType[][]
 * snake: The snake array | Point[] 
 */

FloodFill#hasEnoughSpace
FloodFill#findAccessibleArea
FloodFill#actuallyDoIt

/*
 * I have never finished this,
 * hasEnoughSpace finds if the given percentage is free on the map or no.
 
 * findAccessibleArea Does not work but is supposed to find the area that can be accessed from that point (Its super duper slow)
 * actuallyDoIt Should work better (It is worse)
 */

HamiltonianCylce#hamCycle
HamiltonianCylce#hamCycleTwo
HamiltonianCylce#hamCycleThree

/*
 * They all do the same except:
 * hamCycle returns graph numbers,
 * hamCycleTwo returns coordinates on the 2d array
 * hamCycleThree will be used with a worker and some other magic to calculate the path on another thread. (TODO!!)
 */
```

# There is a functioning game board and snake in there if you take away everything it should work with only A* like on my [webpage](https://perwollnt.me)

