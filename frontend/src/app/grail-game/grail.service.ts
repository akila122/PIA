import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class GrailService {
  sync$ = this.socket.fromEvent<any>("grailGameBegin");
  grailData$ = this.socket.fromEvent<any>("grailData");
  grailUpdate$ = this.socket.fromEvent<any>("grailUpdate");
  grailNext$ = this.socket.fromEvent<any>("grailNext");
  componentLoaded(gameId) {
    this.socket.emit("grailComponentLoaded", gameId);
  }
  dataLoaded(gameId) {
    this.socket.emit("grailDataLoaded", gameId);
  }
  sendAnswer(gameId, gotRight, userType) {
    this.socket.emit("grailUserAnswer", {
      gameId: gameId,
      gotRight: gotRight,
      userType: userType
    });
  }

  constructor(private socket: Socket) {}
}
