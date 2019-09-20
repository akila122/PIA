import { Component, OnInit, OnDestroy } from "@angular/core";
import { GoDService } from "../player/god-play/go-d.service";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { GeoService } from "../geo-game/geo.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";

@Component({
  selector: "app-geo-solo",
  templateUrl: "./geo-solo.component.html",
  styleUrls: ["./geo-solo.component.css"]
})
export class GeoSoloComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GeoService,
    private logger: LoginService,
    private music: MusicService,
    private godService: GoDService
  ) {}

  patternFor = [];

  totalPoints = 0;

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
  points = 0;

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
    this.position = true;
    this.myTurn = this.position;
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(() => {
        this.submit();
      })
    );

    this.subArr.push(
      this.service.gameBegin$.subscribe(data => {
        this.doSpin = false;

        if (data.err) {
          this.data.gameId = data.gameId;
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
          this.setupMyTurn();
        }, 5000);
      })
    );

    let abc = [
      "a",
      "b",
      "c",
      "č",
      "ć",
      "d",
      "dž",
      "đ",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "lj",
      "m",
      "n",
      "o",
      "p",
      "r",
      "s",
      "š",
      "t",
      "u",
      "v",
      "z",
      "ž"
    ];

    this.myChar = abc[Math.floor(abc.length * Math.random())];
    this.c1 = this.myChar;
    this.c2 = this.myChar;
    this.pattern1 =
      "^((" + this.c1.toUpperCase() + "|" + this.c1.toLowerCase() + ").*)$";
    this.pattern2 =
      "^((" + this.c2.toUpperCase() + "|" + this.c2.toLowerCase() + ").*)$";
    this.pattern = this.position ? this.pattern1 : this.pattern2;

    this.subArr.push(
      this.service.nextTurn$.subscribe(data => {
        this.turn++;
        this.loaded = false;
        this.helper.pushPoints({
          redPoints: data.redPoints,
          bluePoints: data.bluePoints
        });
        this.totalPoints = data.bluePoints;
        this.points = data.bluePoints;
        this.infoColor = "black";
        this.infoMsg =
          "Rezulatati " + (this.myTurn ? "vaše" : "protivnikove") + " igre";
        this.resultsInfo = data.resultsInfo;
        this.showRes = true;

        this.pattern = this.position ? this.pattern1 : this.pattern2;

        setTimeout(() => {
          this.endGame();
        }, 10000);
      })
    );

    this.service.soloStart(this.user);
    this.infoMsg = "Čeka se na supervizora...";
  }

  endGame() {
    if (this.data.supervisor) {
      this.service.notifySupervisor(this.data.supervisor);
    }

    this.loaded = false;
    this.doSpin = true;
    this.showRes = false;
    this.infoColor = "black";
    this.infoMsg = "Igra dana gotova!";
    this.music.playResults();

    this.godService.godFinish(this.data.godId, this.totalPoints);

    setTimeout(() => {
      this.router.navigate(["player"]);
    }, 3000);
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
