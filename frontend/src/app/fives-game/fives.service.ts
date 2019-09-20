import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class FivesService {
  constructor(private socket: Socket) {}

  gameBegin$ = this.socket.fromEvent("fivesGameBegin");
  componentLoaded$ = this.socket.fromEvent<any>("fivesData");
  takeTurn$ = this.socket.fromEvent<any>("fivesTakeTurn");
  gameEnded$ = this.socket.fromEvent<any>("fivesGameEnded");

  componentLoaded(gameId: string) {
    this.socket.emit("fivesComponentLoaded", gameId);
  }
  dataLoaded(gameId: string) {
    this.socket.emit("fivesDataLoaded", gameId);
  }

  endGame(gameId,userType,points,revealedData,answer){
    this.socket.emit("fivesGameFinish",{
      gameId:gameId,
      userType:userType,
      points:points,
      revealedData : revealedData,
      answer : answer
    })
  }
  nextTurn(gameId,userType,points,revealedData,answer){
    this.socket.emit("fivesNextTurn",{
      gameId:gameId,
      userType:userType,
      points:points,
      revealedData : revealedData,
      answer : answer
    })
  }
}
