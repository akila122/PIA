import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameRoomService } from "../game-room.service";
import { UserModel } from "src/app/models/UserModel";
import { LoginService } from "src/app/home/login/login.service";
import { Subscription } from "rxjs";

import { GameHelperService } from "src/app/game-helper.service";
import { GoDService } from "./go-d.service";

@Component({
  selector: "app-god-play",
  templateUrl: "./god-play.component.html",
  styleUrls: ["./god-play.component.css"]
})
export class GodPlayComponent implements OnInit, OnDestroy {
  constructor(
    private logger: LoginService,
    private service: GoDService,
    private helper: GameHelperService,
    private router: Router
  ) {}
  user: UserModel;

  data;
  doSpin = true;
  loaded = false;
  sub;
  sub2;
  infoMsg;

  translate = {
    Anagram: "Anagram",
    Fives: "5x5",
    Grail: "Pehar",
    MyNum: "Moj broj",
    Geo: "Zanimljiva geografija"
  };

  icons = {
    Anagram: "spellcheck",
    Fives: "border_all",
    Grail: "local_bar",
    MyNum: "functions",
    Geo: "language"
  };

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  ordinalFor = {
    Anagram: 0,
    Fives: 2,
    Grail: 4,
    MyNum: 1,
    Geo: 3
  };

  ngOnInit() {
    this.user = this.logger.getUser();
    this.sub2 = this.service.godId$.subscribe(godId => {
      this.helper.setData({
        godId: godId,
        gameOrdinal: this.ordinalFor[this.data.GoD.game.kind],
        blueUser: this.user,
        bluePoints: 0,
        game:this.data.GoD.game
      });
      this.router.navigate(["gamesolo",this.data.GoD.game.kind]);
    });
    this.sub = this.service.godData$.subscribe(data => {
      this.doSpin = false;
      if (data == "ERROR_ALREADY_PLAYED") {
        this.infoMsg = "Već ste igrali igru dana";
      } else if (data == "NO_GOD") {
        this.infoMsg = "Igra nije postavljena za tekući dan";
      } else {
        this.loaded = true;
        this.data = data;
      }
    });
    let parsed = new Date()
      .toLocaleString()
      .split(",")[0]
      .split("/");
    let myLocal = parsed[2] + "-" + parsed[0] + "-" + parsed[1];
    this.service.getGoD({ username: this.user.username, timeStamp: myLocal });
  }

  play() {
    this.service.playGoD(this.user.username, this.data.GoD._id);
  }
}
