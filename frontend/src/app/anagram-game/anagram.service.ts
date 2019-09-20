import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class AnagramService {
  constructor(private socket: Socket) {}

  anagramData = this.socket.fromEvent<any>("anagramData");
  anagramStart = this.socket.fromEvent("anagramStart");
  anagramNext = this.socket.fromEvent<any>("anagramNext");

  anagramLoaded(gameId) {
    this.socket.emit("anagramLoaded", gameId);
  }
  anagramSync(gameId) {
    this.socket.emit("anagramSync", gameId);
  }
  sendTurn(turn, guess, username, gameId) {

    this.socket.emit("sendTurn", {
      turn: turn,
      guess: guess,
      username: username,
      gameId: gameId
    });
  }
}
