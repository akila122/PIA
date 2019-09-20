import { Component, OnInit, HostListener } from "@angular/core";
import { LoginService } from "src/app/home/login/login.service";
import { Router } from "@angular/router";
import { GameRoomService } from "../game-room.service";
import { UserModel } from "src/app/models/UserModel";
import { Subscription } from "rxjs";
import { GameHelperService } from 'src/app/game-helper.service';

@Component({
  selector: "app-game-room",
  templateUrl: "./game-room.component.html",
  styleUrls: ["./game-room.component.css"]
})
export class GameRoomComponent implements OnInit {
  constructor(
    private logger: LoginService,
    private router: Router,
    private service: GameRoomService,
    private helper: GameHelperService,
  ) {}
  user: UserModel;
  games: UserModel[] = [];

  doSpin: Boolean = true;
  gameCreated: Boolean = false;

  startGameSub: Subscription;
  newGame: Subscription;
  gameCancled: Subscription;
  gamesSub: Subscription;

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(event) {
    this.ngOnDestroy();
  }

  ngOnInit() {
    this.user = this.logger.getUser();
    this.gamesSub = this.service.games.subscribe(users => {
      this.games = users.filter(user => user.username != this.user.username);
      this.doSpin = false;
    });
    this.newGame = this.service.newGame.subscribe(user => {
      this.games.push(user);
    });
    this.gameCancled = this.service.cancledGame.subscribe(user => {
      this.games = this.games.filter(iter => iter.username != user.username);
    });
    this.startGameSub = this.service.startGame.subscribe(gameData=>{
      this.helper.setData(gameData);
      this.router.navigate(['game']);
      
    })
    this.service.joinRoom(this.user);
  }
  ngOnDestroy() {
    this.service.leaveRoom(this.user);
    this.newGame.unsubscribe();
    this.gameCancled.unsubscribe();
    this.gamesSub.unsubscribe();
    this.startGameSub.unsubscribe();
  }

  startGame(blueUser : UserModel){
    this.service.redStarted(blueUser,this.user);
  }

  addGame() {
    this.service.addGame(this.user);
    this.gameCreated = true;
    this.doSpin = true;
  }
  cancleGame() {
    this.service.cancleGame(this.user);
    this.gameCreated = false;
    this.doSpin = false;
  }
}
