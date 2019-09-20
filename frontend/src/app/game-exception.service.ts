import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameExceptionService {


  gameException$ = this.socket.fromEvent<any>('gameStop');
  constructor(private socket : Socket) { }
}
