import {
  Component,
  OnInit,
  Input,
  Pipe,
  PipeTransform,
  OnDestroy,
  HostListener
} from "@angular/core";
import { GameHelperService } from "../game-helper.service";
import { Observable, Subscription } from "rxjs";
import { MusicService } from "../music.service";

@Component({
  selector: "app-duel-card",
  templateUrl: "./duel-card.component.html",
  styleUrls: ["./duel-card.component.css"]
})
export class DuelCardComponent implements OnInit, OnDestroy {
  constructor(private helper: GameHelperService, private music: MusicService) {}

  points: Subscription;
  timeout: Subscription;
  stop: Subscription;
  game: number = 0;
  gameSub: Subscription;
  data: any;
  time: number = 0;
  timerColor: string = "#62fc03";
  handle: any;
  didTick: boolean = false;

  timeFocusLost;
  timeFocusGained;

  @Input() solo: boolean = false;

  ngOnInit() {
    this.points = this.helper.pointsObservable.subscribe(data => {
      if (data == null) {
        this.game++;
      } else if (data.add != undefined) {
        if (data.redPoints) this.data.redPoints += data.redPoints;
        this.data.bluePoints += data.bluePoints;
      } else {
        if (data.redPoints) this.data.redPoints = data.redPoints;
        this.data.bluePoints = data.bluePoints;
      }
    });
    this.stop = this.helper.stopObservable.subscribe(data => {
      if (this.handle) clearInterval(this.handle);
      this.handle = null;
      this.didTick = false;
      this.time = 0;
      this.timerColor = "#62fc03";
    });
    this.timeout = this.helper.timerObservable.subscribe(time => {
      this.time = time.valueOf();
      this.handle = setInterval(() => {
        if (this.time > 20000) {
          this.timerColor = "#62fc03";
        } else if (this.time > 10000) {
          this.timerColor = "#fcba03";
        } else {
          this.timerColor = "#fc0303";
        }
        if (this.time < 5000 && !this.didTick) {
          this.music.playTick();
          this.didTick = true;
        }
        if (this.time - 10 > 0) {
          this.time -= 10;
        } else {
          clearInterval(this.handle);
          this.handle = null;
          this.time = 0;
          this.didTick = false;
          this.helper.endTimeout();
        }
      }, 10);
    });
    this.gameSub = this.helper.gameObservable.subscribe(data => {
      this.game++;
    });
    this.data = this.helper.getData();
    if (this.solo) this.game = this.data.gameOrdinal;
  }

  ngOnDestroy() {
    this.points.unsubscribe();
    this.timeout.unsubscribe();
    this.stop.unsubscribe();
    this.gameSub.unsubscribe();
  }
}

@Pipe({
  name: "minuteSeconds"
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const seconds: number = Math.floor(value / 1000);
    const minutes: number = Math.floor(seconds / 60);
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      (seconds - minutes * 60).toString().padStart(2, "0")
    );
  }
}
