import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(private socket: Socket) {}

  send(msg: any, username: any, gameId: any) {
    this.socket.emit("sendMsg", {
      gameId: gameId,
      msg: msg,
      username: username,
      ts: new Date()
    });
  }
  mailbox$: any = this.socket.fromEvent<any>("newMsg");
}
