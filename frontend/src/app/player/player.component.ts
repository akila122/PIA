import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../home/login/login.service';
import { UserModel } from '../models/UserModel';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { GameRoomService } from './game-room.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  constructor(private logger: LoginService,private router:Router) {}
  user: UserModel;
  
  ngOnInit() {
    this.user = this.logger.getUser();
    
  }

  logout(){
    this.logger.setUser(null);
    this.router.navigate(['']);
  }

  goHome(){
    this.router.navigate(['administrator'])
  }

}
