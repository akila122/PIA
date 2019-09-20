import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MusicService {
  back;
  good;
  bad;
  tick;
  results;

  constructor() {
    this.back = new Audio();
    this.back.src = "./assets/audio/back.mp3";
    this.back.loop = true;
    this.back.volume = 0.1;
    this.back.load();

    this.good = new Audio();
    this.good.src = "./assets/audio/good.wav";
    this.good.load();

    this.bad = new Audio();
    this.bad.src = "./assets/audio/bad.mp3";
    this.bad.load();

    this.tick = new Audio();
    this.tick.src = "./assets/audio/tick.wav";
    this.tick.load();

    this.results = new Audio();
    this.results.src = "./assets/audio/results.wav";
    this.results.load();
  }
  playGood() {
    this.good.play();
  }
  playBad() {
    this.bad.play();
  }
  playTick() {
    this.tick.play();
  }
  playResults() {
    this.results.play();
  }

  playBackground() {
    this.back.play();
  }
  pauseBackground() {
    this.back.pause();
  }

  playPop() {
    let audio = new Audio();
    audio.src = "./assets/audio/pop.wav";
    audio.load();
    audio.play();
  }
}
