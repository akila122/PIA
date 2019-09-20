import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  

  constructor(private socket : Socket) { }

  allGeo$ = this.socket.fromEvent<any>('geoRoomGames');
  newGeo$ = this.socket.fromEvent<any>('newGeo');
  geoTaken$ = this.socket.fromEvent<any>('geoGameTaken');
  showRes$ = this.socket.fromEvent<any>('geoNextTurn');
  validate$ = this.socket.fromEvent<any>('geoValidate')
  gameEnding$ = this.socket.fromEvent('geoGameEnd');

  joinRoom(user){
    this.socket.emit("geoSupervJoin",user);
  }
  startGame(data){
    this.socket.emit("geoChosen",data);
  }
  sendData(data){
    this.socket.emit("geoDataValidated",data)
  }

}
