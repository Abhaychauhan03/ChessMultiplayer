import { Chess } from "chess.js";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";
export default class Game {
  public readonly id: string;
  private chess: Chess;
  constructor(public p1: User, public p2: User) {
    this.chess = new Chess();
    this.id = uuidv4();
    p1.socket.send(
      JSON.stringify({
        event: "matched",
        message: this.chess.fen(),
        color: "w",
      })
    );
    p2.socket.send(
      JSON.stringify({
        event: "matched",
        message: this.chess.fen(),
        color: "b",
      })
    );
  }
  private broadcastCurrentState() {
    this.p1.socket.send(
      JSON.stringify({
        event: "update",
        message: this.chess.fen(),
      })
    );
    this.p2.socket.send(
      JSON.stringify({
        event: "update",
        message: this.chess.fen(),
      })
    );
  }
  private async handleMove(player: User) {
    return await new Promise((resolve, reject) => {
      player.socket.once("message", (data: string) => {
        try {
          const move = JSON.parse(data);
          this.chess.move(move);
          this.broadcastCurrentState();
          resolve("Moved Successfully");
        } catch (e) {
          player.socket.send(
            JSON.stringify({ event: "error", message: "illegal-move" })
          );
          reject("illegal-move");
        }
      });
    });
  }

  private cleanupSocket(winner: User, loser: User) {
    winner.socket.removeAllListeners();
    loser.socket.removeAllListeners();
  }

  private gameOver(player1: User, player2: User) {
    player1.socket.send(
      JSON.stringify({ event: "result", message: "game-won" })
    );
    player2.socket.send(
      JSON.stringify({ event: "result", message: "game-lost" })
    );
  }
  private addCloseHandler(player: User, opponent: User) {
    player.socket.once("close", () => {
      this.gameOver(opponent, player);
      this.cleanupSocket(player, opponent);
    });
  }

  async startGame() {
    let currentMove: boolean = true;
    let gameActive: boolean = true;
    this.addCloseHandler(this.p1, this.p2);
    this.addCloseHandler(this.p2, this.p1);
    while (gameActive) {
      if (currentMove) {
        let result;
        try {
          await this.handleMove(this.p1);
          result = true;
        } catch (error) {
          result = false;
        }
        if (result) currentMove = false;
      } else {
        let result;
        try {
          await this.handleMove(this.p2);
          result = true;
        } catch (error) {
          result = false;
        }
        if (result) currentMove = true;
      }
      if (this.chess.isGameOver()) {
        if (!currentMove) {
          this.gameOver(this.p1, this.p2);
        } else {
          this.gameOver(this.p2, this.p1);
        }
        gameActive = false;
      }
    }
  }
}
