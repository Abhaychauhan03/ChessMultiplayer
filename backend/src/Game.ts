import { Chess } from "chess.js";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";
import { gameEvents, gameResult } from "./types";
export default class Game {
  public readonly id: string;
  private chess: Chess;
  private p1Time: number;
  private p2Time: number;
  constructor(public p1: User, public p2: User) {
    this.chess = new Chess();
    this.id = uuidv4();
    this.p1Time = 600;
    this.p2Time = 600;
    p1.socket.send(
      JSON.stringify({
        event: gameEvents.Matched,
        message: this.chess.fen(),
        color: "w",
        playerName: p1.name,
        opponentName: p2.name,
      })
    );
    p2.socket.send(
      JSON.stringify({
        event: gameEvents.Matched,
        message: this.chess.fen(),
        color: "b",
        playerName: p2.name,
        opponentName: p1.name,
      })
    );
  }
  private broadcastMessage(event: string, message: string | object) {
    this.sendMessage(this.p1, {
      event,
      message,
    });
    this.sendMessage(this.p2, {
      event,
      message,
    });
  }
  private sendMessage(player: User, message: string | object) {
    player.socket.send(JSON.stringify(message));
  }
  private timerUpdate(player: User) {
    if (player === this.p1) this.p1Time--;
    else this.p2Time--;
    this.broadcastMessage(gameEvents.TimerUpdate, {
      whiteTime: this.p1Time,
      blackTime: this.p2Time,
    });
    if (this.p1Time === 0) {
      this.gameOver(this.p2, this.p1);
      return false;
    } else if (this.p2Time === 0) {
      this.gameOver(this.p1, this.p2);
      return false;
    }
    return true;
  }
  private async handleMove(player: User): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (!this.timerUpdate(player)) {
          clearInterval(interval);
          resolve(false);
        }
      }, 1000);
      player.socket.once("message", (data: string) => {
        try {
          const move = JSON.parse(data);
          this.chess.move(move);
          this.broadcastMessage(gameEvents.Update, this.chess.fen());
          clearInterval(interval);
          resolve(true);
        } catch (e) {
          this.sendMessage(player, {
            event: gameEvents.Error,
            message: "illegal-move",
          });
          clearInterval(interval);
          reject("illegal-move");
        }
      });
    });
  }

  private cleanupSocket(winner: User, loser: User) {
    winner.socket.removeAllListeners();
    loser.socket.removeAllListeners();
  }

  private gameOver(winner: User, loser: User) {
    winner.socket.send(
      JSON.stringify({ event: gameEvents.Result, message: gameResult.GameWon })
    );
    loser.socket.send(
      JSON.stringify({
        event: gameEvents.Result,
        message: gameResult.GameLost,
      })
    );
    this.cleanupSocket(winner, loser);
  }
  private addCloseHandler(player: User, opponent: User) {
    player.socket.once("close", () => this.gameOver(opponent, player));
  }

  async startGame() {
    let currentMove: boolean = true;
    let gameActive: boolean = true;
    this.addCloseHandler(this.p1, this.p2);
    this.addCloseHandler(this.p2, this.p1);
    while (gameActive) {
      try {
        gameActive = currentMove
          ? await this.handleMove(this.p1)
          : await this.handleMove(this.p2);
        currentMove = !currentMove;
      } catch (error) {
        console.log(error);
      }
      if (this.chess.isGameOver()) {
        if (!currentMove) this.gameOver(this.p1, this.p2);
        else this.gameOver(this.p2, this.p1);
        gameActive = false;
      }
    }
  }
}
