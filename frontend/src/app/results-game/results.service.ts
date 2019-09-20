import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  constructor(private socket: Socket) {}

  gameResults$ = this.socket.fromEvent<any>("gameResults");

  getGameResults(gameId) {
    this.socket.emit("getResults", gameId);
  }
}
