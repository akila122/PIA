import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { FivesService } from "../fives-game/fives.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { GeoService } from "./geo.service";
import { Subscription } from "rxjs";
import { UserModel } from "../models/UserModel";

export enum Type {
  Country,
  City,
  Lake,
  Mountain,
  River,
  Animal,
  Plant,
  Music
}

@Component({
  selector: "app-geo-game",
  templateUrl: "./geo-game.component.html",
  styleUrls: ["./geo-game.component.css"]
})
export class GeoGameComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GeoService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  patternFor = [];

  numToLabelMap = {
    0: "Country",
    1: "City",
    2: "Lake",
    3: "Mountain",
    4: "River",
    5: "Animal",
    6: "Plant",
    7: "Music"
  };
  myChar;
  user: UserModel;
  data: any;
  position: boolean;
  showSuperv: boolean = false;

  fillOps: boolean = false;
  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  myTurn: boolean;
  subArr: Subscription[] = [];

  pattern;
  pattern1;
  pattern2;

  resultsInfo;
  showRes = false;
  turn = 0;
  c1;
  c2;

  names = {
    Country: "Država",
    City: "Grad",
    Lake: "Jezero",
    Mountain: "Planina",
    River: "Reka",
    Animal: "Životinja",
    Plant: "Biljka",
    Music: "Muzička grupa"
  };
  answers = [
    {
      answer: "",
      kind: this.numToLabelMap[0]
    },
    {
      answer: "",
      kind: this.numToLabelMap[1]
    },
    {
      answer: "",
      kind: this.numToLabelMap[2]
    },
    {
      answer: "",
      kind: this.numToLabelMap[3]
    },
    {
      answer: "",
      kind: this.numToLabelMap[4]
    },
    {
      answer: "",
      kind: this.numToLabelMap[5]
    },
    {
      answer: "",
      kind: this.numToLabelMap[6]
    },
    {
      answer: "",
      kind: this.numToLabelMap[7]
    }
  ];

  iconForRes = {
    auto: "check_circle_outline",
    superv: "gavel",
    none: "close"
  };
  colorForRes = {
    blueUser: "#3f51b5",
    redUser: "#f44336",
    none: "black"
  };

  icons = {
    Country: "flag",
    City: "location_city",
    Lake: "pool",
    Mountain: "filter_hdr",
    River: "directions_boat",
    Animal: "pets",
    Plant: "filter_vintage",
    Music: "music_note"
  };

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
    this.myTurn = !this.position;
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(() => {
        this.submit();
      })
    );

    this.subArr.push(
      this.service.sync$.subscribe(() => {
        this.infoMsg = "Čeka se na supervizora...";
      })
    );

    this.subArr.push(
      this.service.gameBegin$.subscribe(data => {
        this.doSpin = false;

        if (data === "TIMEOUT") {
          this.infoMsg =
            "Na supervizora se čekalo više od 30s. Igra će početi bez mogućnosti validacije nepoznatih pojmova.";
        } else {
          this.data = data;
          this.infoMsg = "Supervizor se priključio";
          this.showSuperv = true;
        }

        setTimeout(() => {
          this.showSuperv = false;
          this.infoMsg = null;
          if (this.myTurn) this.setupMyTurn();
          else this.setupOpsTurn();
        }, 5000);
      })
    );

    this.subArr.push(
      this.service.componentLoaded$.subscribe(data => {
        this.myChar = this.position ? data.c1 : data.c2;
        this.c1 = data.c1;
        this.c2 = data.c2;
        this.pattern1 =
          "^((" + this.c1.toUpperCase() + "|" + this.c1.toLowerCase() + ").*)$";
        this.pattern2 =
          "^((" + this.c2.toUpperCase() + "|" + this.c2.toLowerCase() + ").*)$";
        this.pattern = this.position ? this.pattern1 : this.pattern2;

        this.service.dataLoaded(this.data.gameId);
      })
    );

    this.subArr.push(
      this.service.answerOps$.subscribe(data => {
        this.doSpin = false;
        this.infoColor = "black";
        this.answers = data;
        this.pattern = !this.position ? this.pattern1 : this.pattern2;

        this.infoMsg =
          "Popunite protivnikove pojmove! Na slovo " +
          (this.position ? this.c2 : this.c1).toUpperCase();
        this.loaded = true;
        this.helper.startTimeout(60000);
      })
    );

    this.subArr.push(
      this.service.nextTurn$.subscribe(data => {
        this.turn++;
        this.loaded = false;
        this.helper.pushPoints({
          redPoints: data.redPoints,
          bluePoints: data.bluePoints
        });
        this.infoColor = "black";
        this.infoMsg =
          "Rezulatati " + (this.myTurn ? "vaše" : "protivnikove") + " igre";
        this.resultsInfo = data.resultsInfo;
        this.showRes = true;

        this.pattern = this.position ? this.pattern1 : this.pattern2;

        setTimeout(() => {
          if (this.turn == 2) {
            this.endGame();
          } else {
            this.showRes = false;
            this.myTurn = !this.myTurn;
            if (this.myTurn) this.setupMyTurn();
            else this.setupOpsTurn();
          }
        }, 10000);
      })
    );

    this.service.componentLoaded(this.data.gameId);
  }

  endGame() {

    if(this.position && this.data.supervisor){
      this.service.notifySupervisor(this.data.supervisor);
    }

    this.loaded = false;
    this.doSpin = true;
    this.showRes = false;
    this.infoColor = "black";
    this.infoMsg = "Pehar uskoro počinje...";

    setTimeout(()=>{
      this.helper.nextGame();
      this.router.navigate(['game','grail']);
    },2000)
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();
    this.doSpin = true;
    this.loaded = false;
    this.infoColor = "black";
    this.infoMsg = "Validacija u toku";

    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i].answer = this.answers[i].answer.toUpperCase();
      let regex = new RegExp(this.pattern, "i");
      if (!regex.test(this.answers[i].answer)) {
        this.answers[i].answer = null;
      }
    }

    this.service.sendData(
      this.answers,
      this.data.gameId,
      this.position ? "blueUser" : "redUser",
      this.myTurn
    );
  }

  setupMyTurn() {
    this.answers = [
      {
        answer: "",
        kind: this.numToLabelMap[0]
      },
      {
        answer: "",
        kind: this.numToLabelMap[1]
      },
      {
        answer: "",
        kind: this.numToLabelMap[2]
      },
      {
        answer: "",
        kind: this.numToLabelMap[3]
      },
      {
        answer: "",
        kind: this.numToLabelMap[4]
      },
      {
        answer: "",
        kind: this.numToLabelMap[5]
      },
      {
        answer: "",
        kind: this.numToLabelMap[6]
      },
      {
        answer: "",
        kind: this.numToLabelMap[7]
      }
    ];

    this.infoColor = "#62fc03";
    this.infoMsg = "S L O V O - " + this.myChar.toUpperCase();
    this.doSpin = false;
    this.loaded = true;
    this.helper.startTimeout(120000);
  }
  setupOpsTurn() {
    this.doSpin = true;
    this.infoMsg =
      "Protivnik pogađa na slovo - " +
      (this.position ? this.c2 : this.c1).toUpperCase();
  }
}
