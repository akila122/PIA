import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserModel } from "src/app/models/UserModel";
import { LoginService } from "src/app/home/login/login.service";
import { Router } from "@angular/router";
import { ValidateService } from "./validate.service";
import { GameHelperService } from "src/app/game-helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-validate-game",
  templateUrl: "./validate-game.component.html",
  styleUrls: ["./validate-game.component.css"]
})
export class ValidateGameComponent implements OnInit, OnDestroy {
  constructor(
    private logger: LoginService,
    private router: Router,
    private service: ValidateService,
    private helper: GameHelperService
  ) {}

  user: UserModel;
  games: any[] = [];
  doSpin: boolean = true;
  subArr: Subscription[] = [];

  ngOnDestroy(): void {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.user = this.logger.getUser();
    this.subArr.push(this.service.allGeo$.subscribe(data => {
      this.games = data;
      this.doSpin = false;
    }));
    this.subArr.push(this.service.newGeo$.subscribe((data)=>{
      this.games.push(data);
    }))
    this.subArr.push(this.service.geoTaken$.subscribe(data=>{
      this.games = this.games.filter(iter => iter.gameId != data.gameId);
    }))
    this.service.joinRoom(this.user);
  }


  addGame(data){
    data.supervisor = this.user;
    this.helper.setData(data);
    this.router.navigate(['gameValidation']);
  }

}
