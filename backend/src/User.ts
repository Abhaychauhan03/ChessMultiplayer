import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

export class User {
  public id: string = uuidv4();
  public name: string = this.id + "-guest";
  constructor(public socket: WebSocket, name?: string) {
    if (name) this.name = name;
  }
}
