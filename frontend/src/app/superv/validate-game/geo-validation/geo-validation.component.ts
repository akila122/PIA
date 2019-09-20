import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserModel } from "src/app/models/UserModel";
import { LoginService } from "src/app/home/login/login.service";
import { Router } from "@angular/router";
import { ValidateService } from "../validate.service";
import { GameHelperService } from "src/app/game-helper.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-geo-validation",
  templateUrl: "./geo-validation.component.html",
  styleUrls: ["./geo-validation.component.css"]
})
export class GeoValidationComponent implements OnInit, OnDestroy {
  constructor(
    private logger: LoginService,
    private router: Router,
    private service: ValidateService,
    private helper: GameHelperService
  ) {}

  subArr: Subscription[] = [];

  headerData: any;
  user: UserModel;
  data;
  resultsInfo;

  infoColor: string = "black";
  loaded: boolean = false;
  doSpin: boolean = true;
  infoMsg: string = "Takmičari igraju";
  showRes: boolean = false;
  iter = 0;

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

  translateMap = {
    Country: "država",
    City: "grad",
    Lake: "jezero",
    Mountain: "planina",
    River: "reka",
    Animal: "životinja",
    Plant: "biljka",
    Music: "muzička grupa"
  };

  ngOnDestroy() {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.headerData = this.helper.getData();
    this.user = this.logger.getUser();

    this.subArr.push(
      this.service.showRes$.subscribe(data => {
        this.infoColor = "Black";
        this.infoMsg = "Rezulatati";
        this.loaded = false;
        this.resultsInfo = data.resultsInfo;
        this.showRes = true;

        setTimeout(() => {
          this.doSpin = true;
          this.showRes = false;
          this.infoMsg = "Takmičari igraju";
        }, 8000);
      })
    );

    this.subArr.push(
      this.service.gameEnding$.subscribe(() => {
        this.infoMsg = "Vaš posao je ovde gotov! Vraćanje na početnu stranu...";

        setTimeout(() => {
          this.router.navigate(["supervisor"]);
        }, 5000);
      })
    );

    this.subArr.push(
      this.service.validate$.subscribe(data => {
        this.data = data;
        this.doSpin = false;
        this.loaded = true;
        this.infoMsg = "Validirajte";
      })
    );

    this.service.startGame(this.headerData);
  }

  valid() {
    this.data.answers[this.iter].validInfo = "superv";
    this.data.answers[this.iter].answerdBy = this.data.userType;
    if (++this.iter == this.data.answers.length) this.sendData();
  }
  invalid() {
    this.data.answers[this.iter].answer = null;
    this.data.answers[this.iter].validInfo = "none";
    this.data.answers[this.iter].answerdBy = "none";
    if (++this.iter == this.data.answers.length) this.sendData();
  }

  sendData() {
    this.iter = 0;
    this.doSpin = true;
    this.loaded = false;
    this.infoMsg = "Takmičari igraju...";
    this.service.sendData(this.data);
  }

  endGame() {
    this.doSpin = false;
    this.showRes = false;
    this.infoMsg = "Igra je gotova!";
  }
}
