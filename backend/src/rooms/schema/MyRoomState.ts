import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") playerRow: number;
  @type("number") playerCol: number;
  @type("string") playerColor = "#ffffff";
  @type("number") playerScore = 0;
  @type("string") playerUsername = ""
  @type("boolean") locked: boolean;


  constructor(playerRow: number, playerCol: number) {
    super();
    this.playerRow = playerRow;
    this.playerCol = playerCol;
    this.locked = false;
  }
}

export class Square extends Schema {
  @type("number") row: number;
  @type("number") col: number;
  @type("string") color: string; // Changed type to string
  @type("boolean") deleted: boolean;
  @type("boolean") occupied: boolean;

  constructor(row: number, col: number, color: string = "#ffffff", deleted: boolean = false, occupied: boolean = false) {
    super();
    this.row = row;
    this.col = col;
    this.color = color; // No need for parsing, already a string
    this.deleted = deleted;
    this.occupied = occupied;
  }

  update(color: string = "#ffffff", deleted: boolean = false, occupied: boolean = false): void {
    this.color = color;
    this.deleted = this.deleted;
    this.occupied = occupied;
  }
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") currentPlayerSessionId: string;
  @type([Square]) grid = new ArraySchema<Square>();
  @type("int32") numRows: number;
  @type("int32") numColumns: number;
  @type("string") goalColor: string;

  constructor(numRows: number, numColumns: number) {
    super();
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.goalColor = this.getRandomColor()
    this.initializeGrid();
  }

  private initializeGrid(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numColumns; col++) {
        this.grid.push(new Square(row, col, this.getPseudoRandomColor(), false));
      }
    }
  }

  // returns a random hex value as a string
  private getRandomColor(): string {
    const letters = '0123456789abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  // returns a random hex value as a string and randomly inserts primary colors, secondary colors, white and black 1/3 of the time
  private getPseudoRandomColor(): string {
    const letters = '0123456789abcdef';
    const colors = ['#ff0000', '#0000ff', '#00ff00', '#000000', '#ffffff', '#00ffff', '#ff00ff', '#ffff00']; // Array of predefined colors
    const probability = 1 / 3; // Probability of generating one of the predefined colors

    if (Math.random() < probability) {
      return colors[Math.floor(Math.random() * colors.length)]; // Return a predefined color
    } else {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color; // Return a random color
    }
  }


  getSquareAt(row: number, col: number): Square | undefined {
    const index = row * this.numColumns + col;
    if (index < this.grid.length && index >= 0) {
      return this.grid[index];
    }
  }

  isPlayersEmpty(): boolean {
    return this.players.size === 0;
  }
  
}
