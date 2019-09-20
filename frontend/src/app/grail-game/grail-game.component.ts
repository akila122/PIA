import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserModel } from "../models/UserModel";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { GrailService } from "./grail.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-grail-game",
  templateUrl: "./grail-game.component.html",
  styleUrls: ["./grail-game.component.css"]
})
export class GrailGameComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GrailService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  user: UserModel;
  data: any;
  position: boolean;

  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  answer: string = "";
  myTurn;
  subArr: Subscription[] = [];

  grails = [];

  iter = 0;
  turn = 0;
  grailForm = [
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    },
    {
      model: "",
      color: "black",
      question: "",
      answer: ""
    }
  ];

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
      this.service.sync$.subscribe(() => {
        this.loaded = true;
        this.doSpin = false;
        if (this.myTurn) this.setupMyTurn();
        else this.setupOpsTurn();
      })
    );

    this.subArr.push(
      this.service.grailData$.subscribe(data => {
        this.grails = data;
        this.grailForm.forEach((val, i) => {
          val.answer = data[0].data[i].answer.toUpperCase();
          val.question = data[0].data[i].question;
        });

        this.service.dataLoaded(this.data.gameId);
      })
    );

    this.subArr.push(
      this.service.grailUpdate$.subscribe(data => {
        if (data.prevInfo) {
          this.grailForm[this.iter].model = this.grailForm[this.iter].answer;
          this.helper.pushPoints({
            redPoints: data.redPoints,
            bluePoints: data.bluePoints
          });
          if (data.prevInfo != "none")
            this.grailForm[this.iter].color =
              data.prevInfo == "blueUser" ? "#3f51b5" : "#f44336";

          this.iter++;
        }

        if (data.position == this.position) this.setupMyTurn();
        else this.setupOpsTurn();
      })
    );

    this.subArr.push(
      this.service.grailNext$.subscribe(data => {
        this.infoMsg = "Pehar je otvoren!";
        this.grailForm[this.iter].model = this.grailForm[this.iter].answer;
        this.helper.pushPoints({
          redPoints: data.redPoints,
          bluePoints: data.bluePoints
        });
        if (data.prevInfo != "none")
          this.grailForm[this.iter].color =
            data.prevInfo == "blueUser" ? "#3f51b5" : "#f44336";

        setTimeout(() => {
          if (++this.turn == 2) {
            this.gameEnd();
          } else {
            this.myTurn = !this.position;
            this.iter = 0;
            this.grailForm.forEach((val, i) => {
              val.answer = this.grails[1].data[i].answer.toUpperCase();
              val.question = this.grails[1].data[i].question;
              val.model = "";
              val.color = "black";
            });
            if(this.myTurn) this.setupMyTurn();
            else this.setupOpsTurn();
          }
        }, 3000);
      })
    );

    this.service.componentLoaded(this.data.gameId);
  }
  setupMyTurn() {
    this.myTurn = true;
    this.infoMsg = this.grailForm[this.iter].question;
    this.helper.startTimeout(30000);
  }
  setupOpsTurn() {
    this.myTurn = false;
    this.infoMsg = "Protivnik pogađa";
    
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();
    this.myTurn = false;

    let gotRight;

    gotRight =
      this.grailForm[this.iter].model.toLowerCase() ==
      this.grailForm[this.iter].answer.toLowerCase();
    if (gotRight) {
      this.music.playGood();
    } else this.music.playBad();

    this.service.sendAnswer(
      this.data.gameId,
      gotRight,
      this.position ? "blueUser" : "redUser"
    );
  }

  gameEnd() {
    this.loaded = false;
    this.doSpin = true;
    this.infoMsg = "Prelazi se na rezultate...";

    setTimeout(() => {
      this.helper.nextGame();
      this.router.navigate(['game','results'])
    }, 2000);
  }
}
