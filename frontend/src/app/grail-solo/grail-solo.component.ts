import { Component, OnInit, OnDestroy } from "@angular/core";
import { GoDService } from "../player/god-play/go-d.service";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";

@Component({
  selector: "app-grail-solo",
  templateUrl: "./grail-solo.component.html",
  styleUrls: ["./grail-solo.component.css"]
})
export class GrailSoloComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GoDService,
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

  totalPoints = 0;
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

    this.myTurn = true;
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(() => {
        this.submit();
      })
    );

    this.grails = this.data.game.data;
    this.grailForm.forEach((val, i) => {
      val.answer = this.data.game.data[i].answer.toUpperCase();
      val.question = this.data.game.data[i].question;
    });

    this.loaded = true;
    this.doSpin = false;
    this.setupMyTurn();
  }
  setupMyTurn() {
    this.myTurn = true;
    this.infoMsg = this.grailForm[this.iter].question;
    this.helper.startTimeout(30000);
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

    if (gotRight) {
      this.totalPoints += 3;
      this.helper.pushPoints({
        add: true,
        bluePoints: 3
      });
    }

    this.grailForm[this.iter].model = this.grailForm[this.iter].answer;

    this.grailForm[this.iter].color = gotRight ? "#673ab7" : "balck";

    this.iter++;

    if (this.iter == 13) this.gameEnd();
    else this.setupMyTurn();
  }

  gameEnd() {
    this.music.playResults();
    this.infoMsg = "Igra dana je gotova!";
    this.service.godFinish(this.data.godId, this.totalPoints);
    setTimeout(() => this.router.navigate(["player"]), 3000);
  }
}
