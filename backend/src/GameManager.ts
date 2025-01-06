import { WebSocket } from "ws";
import Game from "./Game";
import { User } from "./User";

export class GameManager {
  private waitingPlayer: User | null = null;
  private games: Game[] = [];

  constructor() {}
  startGame(player: User) {
    player.socket.once("close", () => {
      if (this.waitingPlayer === player) this.waitingPlayer = null;
      else {
        const gameFound = this.games.find(
          (game: Game) => game.p1 === player || game.p2 === player
        );
        if (gameFound) {
          const winner = gameFound.p1 === player ? gameFound.p2 : gameFound.p1;
          winner.socket.send(
            JSON.stringify({ event: "result", message: "game-won" })
          );
          this.games = this.games.filter((game: Game) => game !== gameFound);
        }
      }
    });
    if (
      !this.waitingPlayer ||
      this.waitingPlayer.socket.readyState !== WebSocket.OPEN
    ) {
      this.waitingPlayer = player;
      player.socket.send(
        JSON.stringify({
          event: "connection",
          message: "Connected to Server, Waiting For players",
        })
      );
    } else {
      player.socket.send(
        JSON.stringify({ event: "matched", message: "matched a player" })
      );
      this.waitingPlayer.socket.send(
        JSON.stringify({ event: "matched", message: "matched a player" })
      );
      let game = new Game(this.waitingPlayer, player);
      this.games.push(game);
      game.startGame();
      this.waitingPlayer = null;
    }
  }
}
