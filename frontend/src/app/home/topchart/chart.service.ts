import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root"
})
export class ChartService {
  constructor(private socket: Socket) {}

  duelChart$ = this.socket.fromEvent<any>("duelChart");
  monthlyChart$ = this.socket.fromEvent<any>("monthlyChart");
  last20Chart$ = this.socket.fromEvent<any>("last20Chart");
  godChart$ = this.socket.fromEvent<any>("godChart");

  getDuelChart(username) {
    this.socket.emit("getDuelChart", username);
  }
  getMonthlyChart() {
    this.socket.emit("getMonthlyChart");
  }
  getLast20Chart() {
    this.socket.emit("get20Chart");
  }

  getGodChart(username, date) {
    this.socket.emit("getGodChart", { username, date });
  }
}
