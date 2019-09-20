import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserModel } from '../models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class GameRoomService {

  newGame = this.socket.fromEvent<UserModel>('newGame');
  games = this.socket.fromEvent<UserModel[]>('allGames');
  cancledGame = this.socket.fromEvent<UserModel>('gameCancled');
  startGame = this.socket.fromEvent<any>('startGame');

  constructor(public socket : Socket) {}

  joinRoom(user: UserModel){
    this.socket.emit('joinRoom',user);
  }
  leaveRoom(user: UserModel){
    this.socket.emit('leaveRoom',user);
  }
  addGame(user : UserModel){
    this.socket.emit('addGame',user);
  }
  cancleGame(user : UserModel){
    this.socket.emit('cancleGame',user)
  }
  redStarted(blueUser : UserModel,redUser : UserModel){
    this.socket.emit('redStarted',{blueUser:blueUser,redUser:redUser});
  }
}
