import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class MyNumService {
  constructor(private socket: Socket) {}

  setNumObservable = this.socket.fromEvent<any>("myNumSetNumServer");
  myNumSyncObservable = this.socket.fromEvent<any>("myNumSync");
  allSetObservable = this.socket.fromEvent<any>("myNumAllSet");
  nextTurn = this.socket.fromEvent<any>("myNumNextTurn");

  myNumLoaded(gameId) {
    this.socket.emit("myNumLoaded", gameId);
  }
  setNum(i, val,userType,gameId) {
    this.socket.emit("myNumSetNumClient", { i: i, val: val,userType:userType,gameId:gameId});
  }
  gameBegin(userType,gameId) {
    this.socket.emit("gameBegin", {userType:userType,gameId:gameId});
  }
  computeDone(userType, gameId, compute, answer,turn,sub) {
    this.socket.emit("computeDone", {
      userType:userType,
      gameId: gameId,
      compute: compute,
      answer: answer,
      turn: turn,
      sub: sub
    });
  }
}
