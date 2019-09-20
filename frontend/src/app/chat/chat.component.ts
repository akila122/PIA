import { Component, OnInit } from "@angular/core";
import { GameHelperService } from "../game-helper.service";
import { LoginService } from "../home/login/login.service";
import { ChatService } from "./chat.service";
import { MusicService } from "../music.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  constructor(
    private logger: LoginService,
    private helper: GameHelperService,
    private service: ChatService,
    private music: MusicService
  ) {}

  user;
  game;
  mailbox = [];
  msg;
  usernameToImg = {};

  ngOnInit() {
    this.game = this.helper.getData();
    this.user = this.logger.getUser();

    this.usernameToImg[
      this.game.blueUser.username
    ] = this.game.blueUser.profileImageURL;
    this.usernameToImg[
      this.game.redUser.username
    ] = this.game.redUser.profileImageURL;

    //mora sync
    this.service.mailbox$.subscribe(data => {
      if (data.username != this.user.username) this.music.playPop();
      this.mailbox.unshift(data);
    });
  }

  send() {
    this.service.send(this.msg, this.user.username, this.game.gameId);
  }
}
