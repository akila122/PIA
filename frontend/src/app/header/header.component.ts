import { Component, OnInit } from "@angular/core";
import { MusicService } from "../music.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  constructor(private music: MusicService) {}

  state = false;

  src = "../../assets/img/off.png";

  ngOnInit() {
  }

  play() {
    if (this.state) {
      this.music.pauseBackground();
      this.src = "../../assets/img/off.png";
    } else {
      this.music.playBackground();
      this.src = "../../assets/img/on.png";
    }
    this.state = !this.state;
  }
}
