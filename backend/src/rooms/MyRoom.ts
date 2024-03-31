// MyRoom.ts
import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player, Square } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 3;
  rows = 7;
  columns = 5;
  currentPlayerIndex = 0;

  onCreate(options: any): void {
    this.setState(new MyRoomState(this.rows, this.columns));

    this.onMessage("move", (client, input) => {
      const player = this.state.players.get(client.sessionId);
      if (this.state.currentPlayerSessionId === client.sessionId) {
        // Calculate the new position based on the direction
        let newPlayerRow = player.playerRow;
        let newPlayerCol = player.playerCol;

        if (input.left) {
          newPlayerCol -= 1;
          console.log("left");
        } else if (input.right) {
          newPlayerCol += 1;
          console.log("right");
        } else if (input.up) {
          newPlayerRow -= 1;
          console.log("up");
        } else if (input.down) {
          newPlayerRow += 1;
          console.log("down");
        }

        // Assign old and new squares to variables
        const oldSquare = this.state.getSquareAt(player.playerRow, player.playerCol)
        const newSquare = this.state.getSquareAt(newPlayerRow, newPlayerCol);
        
        // Check if the new position is within bounds
        if (
          newSquare &&
          (newPlayerRow != player.playerRow || newPlayerCol != player.playerCol) &&
          !newSquare.occupied &&
          newPlayerRow >= 0 &&
          newPlayerRow < this.rows &&
          newPlayerCol >= 0 &&
          newPlayerCol < this.columns

        ) {
          // Update player's position
          player.playerRow = newPlayerRow;
          player.playerCol = newPlayerCol;

          // Transfer occupation of square
          oldSquare.occupied = false;
          newSquare.occupied = true;

          // Calculate mixed color
          const oldColor = oldSquare.color;
          const newColor = newSquare.color;
          const mixedColor = this.mixColors(oldColor, newColor);

          // Set the mixed color to the new square
          if (!newSquare.deleted) {
            newSquare.color = mixedColor;
          } else {
            newSquare.color = oldSquare.color;
            newSquare.deleted = false;
          }
          this.switchCurrentPlayer()
          // update playerColor
          this.updatePlayerColor(player);
          // update playerScore
          const playerScore = this.calculatePlayerScore(player);
          player.playerScore = playerScore


          // Delete the old square
          oldSquare.deleted = true
        }
      }
    });

    this.onMessage("lockScore", (client) => {
      // Call the method to lock the player's score
      this.lockPlayerScore(client);
    });
  }
  


  onJoin(client: Client, options: any): void {
    console.log(client.sessionId, "joined!");
    const availableSquares = this.findAvailableSquares();
    if (availableSquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      const assignedSquare = availableSquares[randomIndex];
      const player = new Player(assignedSquare.row, assignedSquare.col);
      if (this.state.isPlayersEmpty()) {
        this.state.currentPlayerSessionId = client.sessionId;
      }
      this.state.players.set(client.sessionId, player);
      this.state.getSquareAt(assignedSquare.row, assignedSquare.col).occupied = true;
      this.updatePlayerColor(player);
      const playerScore = this.calculatePlayerScore(player);
      player.playerScore = playerScore
    }
  }

  onLeave(client: Client, consented: boolean): void {
    console.log(client.sessionId, "left!");

    // Release the occupied square
    const player = this.state.players.get(client.sessionId);
    if (player) {
      this.state.players.delete(client.sessionId);
      const playerSquare = this.state.getSquareAt(player.playerRow, player.playerCol)
      if (playerSquare) {
        playerSquare.occupied = false;
      }
      if (this.state.currentPlayerSessionId === client.sessionId)
        this.switchCurrentPlayer()
    }
  }

  switchCurrentPlayer() {
    const playerIds = Array.from(this.state.players.keys()); // Get all player session IDs
    const numPlayers = playerIds.length;

    // Find the next player index while skipping locked players
    let nextPlayerIndex = (this.currentPlayerIndex + 1) % numPlayers;
    while (nextPlayerIndex !== this.currentPlayerIndex) {
      const nextPlayerId = playerIds[nextPlayerIndex];
      const nextPlayer = this.state.players.get(nextPlayerId);
      if (!nextPlayer || !nextPlayer.locked) {
        break;
      }
      nextPlayerIndex = (nextPlayerIndex + 1) % numPlayers;
    }

    // Set the currentPlayerSessionId to the session ID of the player at the new index
    this.currentPlayerIndex = nextPlayerIndex;
    this.state.currentPlayerSessionId = playerIds[this.currentPlayerIndex];

    // Check if all players are locked
    const allPlayersLocked = playerIds.every(id => {
      const player = this.state.players.get(id);
      return player && player.locked;
    });

    // If all players are locked, end the game
    if (allPlayersLocked) {
      this.endGame();
    }
  }
  
  endGame() {
    // Implement logic to end the game
    // For example, you can calculate final scores, declare winners, etc.
    console.log("Game Over");
    this.broadcast("gameOver");
    this.disconnect(); // Disconnect all clients and clean up the room
  }

  calculatePlayerScore(player: Player): number {
    const goalColor = this.state.goalColor;
    const playerColor = player.playerColor;

    // Convert colors to RGB
    const goalRgb = this.hexToRgb(goalColor);
    const playerRgb = this.hexToRgb(playerColor);

    // Calculate color difference using Euclidean distance
    const colorDifference = Math.sqrt(
      Math.pow(goalRgb.r - playerRgb.r, 2) +
      Math.pow(goalRgb.g - playerRgb.g, 2) +
      Math.pow(goalRgb.b - playerRgb.b, 2)
    );

    // Calculate percentage based on maximum possible difference (Euclidean distance between black and white)
    const maxDifference = Math.sqrt(Math.pow(255, 2) * 3);
    const percentage = Math.max(0, 100 - (colorDifference / maxDifference) * 100);

    // Round percentage to one decimal place
    return parseFloat(percentage.toFixed(1));
  }
  
  updatePlayerColor(player: Player) {
    const playerSquare = this.state.getSquareAt(player.playerRow, player.playerCol);
    const playerColor = playerSquare ? playerSquare.color : "#ffffff"; // Default color if square is not found
    player.playerColor = playerColor;
  }

  lockPlayerScore(client: Client): void {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      player.locked = true;
      // Skip the locked player in the rotation
      this.switchCurrentPlayer();
    }
  }

  findAvailableSquares(): { row: number; col: number }[] {
    const availableSquares = [];
    for (let row = 0; row < this.state.numRows; row++) {
      for (let col = 0; col < this.state.numColumns; col++) {
        const square = this.state.getSquareAt(row, col);
        if (square && !square.occupied && !square.deleted) {
          availableSquares.push({ row, col });
        }
      }
    }
    return availableSquares;
  }

  mixColors(color1: string, color2: string): string { // Change parameter and return type to string
    // Convert hex strings to RGB components
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    // Calculate mixed RGB components
    const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
    const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
    const mixedB = Math.round((rgb1.b + rgb2.b) / 2);

    // Combine mixed RGB components into a single hex color
    return this.rgbToHex(mixedR, mixedG, mixedB);
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } { // Helper function to convert hex to RGB
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  rgbToHex(r: number, g: number, b: number): string { // Helper function to convert RGB to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  onDispose(): void {
    console.log("room", this.roomId, "disposing...");
  }
}