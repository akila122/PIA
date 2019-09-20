import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class GoDService {
  constructor(private socket: Socket) {}

  godData$ = this.socket.fromEvent<any>("godData");
  godId$ = this.socket.fromEvent<any>("godId");

  getGoD(username: any) {
    this.socket.emit("getGod", username);
  }
  playGoD(username, god_id) {
    this.socket.emit("playGod", {
      username: username,
      god_id: god_id
    });
  }

  godFinish(god_id,points){
    this.socket.emit("godFinish",{
      god_id:god_id,
      points:points
    });
  }
}
