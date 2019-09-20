import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class GeoService {
  constructor(private socket: Socket) {}

  componentLoaded$ = this.socket.fromEvent<any>("geoData");
  sync$ = this.socket.fromEvent<any>("geoGameBegin");
  gameBegin$ = this.socket.fromEvent<any>("geoSupervSync");
  answerOps$ = this.socket.fromEvent<any>("geoAnswerOps");
  nextTurn$ = this.socket.fromEvent<any>("geoNextTurn");

  soloStart(user) {
    this.socket.emit("geoSoloNewGame", user);
  }

  notifySupervisor(supervisor) {
    this.socket.emit("geoGameEnd", supervisor);
  }

  dataLoaded(gameId) {
    this.socket.emit("geoDataLoaded", gameId);
  }
  componentLoaded(gameId) {
    this.socket.emit("geoComponentLoaded", gameId);
  }
  sendData(answers, gameId, userType, myTurn) {
    this.socket.emit("geoPlayerSendData", {
      answers: answers,
      gameId: gameId,
      userType: userType,
      myTurn: myTurn
    });
  }

  solo;
}
