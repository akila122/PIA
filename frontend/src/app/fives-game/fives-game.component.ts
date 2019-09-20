import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { FivesService } from "./fives.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";
import { FivesModel } from "../models/GameModels";

@Component({
  selector: "app-fives-game",
  templateUrl: "./fives-game.component.html",
  styleUrls: ["./fives-game.component.css"]
})
export class FivesGameComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: FivesService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  user: UserModel;
  data: any;
  position: boolean;
  endGuard : boolean = false;

  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  answer: string = "";
  notFound: string = "";

  revealed: boolean[][] = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ];
  fives: String[][] = [];
  myTurn: boolean;
  subArr: Subscription[] = [];

  ngOnDestroy() {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();
    if (this.user.username == this.data.blueUser.username) {
      this.position = true;
    } else {
      this.position = false;
    }
    this.myTurn = this.position;
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(() => {
        this.submit();
      })
    );
    this.subArr.push(
      this.service.gameBegin$.subscribe(() => {
        this.loaded = true;
        if (this.myTurn) this.setupMyTurn();
        else this.setupOpsTurn();
      })
    );
    this.subArr.push(
      this.service.componentLoaded$.subscribe(data => {
        for (let i = 0; i < data.data.data.length; i++)
          this.fives[i] = data.data.data[i].split("");
        for (let i = 0; i < 5; i++)
          for (let j = 0; j < 5; j++)
            this.revealed[i][j] =
              data.cStart.toLowerCase() == this.fives[i][j].toLowerCase();

        this.service.dataLoaded(this.data.gameId);
      })
    );
    this.subArr.push(
      this.service.gameEnded$.subscribe(data => {
        if (data === "LIMIT_REACHED") {
          this.infoColor = "#fc0303";
          this.myTurn = false;
          this.revealed.forEach(val =>
            val.forEach((val, i, arr) => (arr[i] = true))
          );
          this.infoMsg = "Prekoračen maksimalan broj pokušaja";
          this.endGuard = true;
          this.helper.stopTimeout();
          setTimeout(() => this.endGame(), 5000);
        } else {
          this.doSpin = false;
          let addBlue = this.position ? 0 : data.points;
          let addRed = this.position ? data.points : 0;
          this.helper.pushPoints({
            add: true,
            redPoints: addRed,
            bluePoints: addBlue
          });
          data.revealedData.forEach(x => (this.revealed[x.i][x.j] = true));
          this.infoColor = data.points > 0 ? "#62fc03" : "#fc0303";
          if (data.points == 0) this.notFound += data.answer;
          this.infoMsg = data.answer.toUpperCase();
          setTimeout(() => this.endGame(), 2000);
        }
      })
    );
    this.subArr.push(
      this.service.takeTurn$.subscribe(data => {
        this.doSpin = false;
        let addBlue = this.position ? 0 : data.points;
        let addRed = this.position ? data.points : 0;
        this.helper.pushPoints({
          add: true,
          redPoints: addRed,
          bluePoints: addBlue
        });
        data.revealedData.forEach(x => (this.revealed[x.i][x.j] = true));
        this.infoColor = data.points > 0 ? "#62fc03" : "#fc0303";
        this.infoMsg = data.answer.toUpperCase();
        if (data.points == 0) this.notFound += data.answer;
        setTimeout(() => this.setupMyTurn(), 2000);
      })
    );
    this.service.componentLoaded(this.data.gameId);
  }

  setupMyTurn() {
    this.helper.startTimeout(15000);
    this.myTurn = true;
    this.infoColor = "black";
    this.infoMsg = "Izaberite slovo";
    this.doSpin = false;
  }

  setupOpsTurn() {
    if(this.endGuard) return;
    this.doSpin = false;
    this.myTurn = false;
    this.infoColor = "black";
    this.infoMsg = "Protivnik bira";
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();

    this.myTurn = false;

    let oldState = [];
    for (let i = 0; i < 5; i++) {
      oldState[i] = this.revealed[i].slice(0);
    }

    let revealedData = [];
    let points = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (
          !this.revealed[i][j] &&
          this.fives[i][j].toLowerCase() == this.answer.toLowerCase()
        ) {
          revealedData.push({ i: i, j: j });
          this.revealed[i][j] = true;
        }
      }
    }

    this.infoMsg = this.answer.toUpperCase();
    if (revealedData.length > 0) {
      points += revealedData.length;
      this.music.playGood();
    } else this.music.playBad();

    for (let i = 0; i < 5; i++) {
      if (
        !oldState[i].reduce((prev, curr) => prev && curr) &&
        this.revealed[i].reduce((prev, curr) => prev && curr)
      )
        points += 2;
    }
    for (let i = 0; i < 5; i++) {
      let flagOld = oldState[0][i];
      let flagNew = this.revealed[0][i];
      for (let j = 1; j < 5; j++) {
        flagOld = flagOld && oldState[j][i];
        flagNew = flagNew && this.revealed[j][i];
      }
      if (!flagOld && flagNew) {
        points += 2;
      }
    }

    let gameEnd = true;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.revealed[i][j]==false) {
          gameEnd = false;
          break;
        }
      }
      if (!gameEnd) break;
    }

    let addRed = this.position ? 0 : points;
    let addBlue = this.position ? points : 0;
    this.helper.pushPoints({
      add: true,
      redPoints: addRed,
      bluePoints: addBlue
    });
    this.infoColor = points > 0 ? "#62fc03" : "#fc0303";
    if (points == 0) this.notFound += this.answer;
    this.infoMsg = this.answer.toUpperCase();
    this.myTurn = false;

    if (gameEnd) {
      this.service.endGame(
        this.data.gameId,
        this.position ? "blueUser" : "redUser",
        points,
        revealedData,
        this.answer
      );
      this.endGame();
    } else {
      this.service.nextTurn(
        this.data.gameId,
        this.position ? "blueUser" : "redUser",
        points,
        revealedData,
        this.answer
      );
    }

    setTimeout(() => this.setupOpsTurn(), 2000);
  }

  endGame() {
    this.endGuard = true;
    this.loaded = false;
    this.doSpin = true;
    this.infoColor = "black";
    this.infoMsg = "Uskoro počinje zanimljiva geografija...";
    setTimeout(()=>{
      this.router.navigate(['game','geo']);
      this.helper.nextGame();
    },2000)
  }
}
