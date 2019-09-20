import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  constructor() {
    this.shortVersion = false;
  }
  isLoaded : Boolean = false;
  src : String;

  @Input() user: UserModel;
  @Input() shortVersion: Boolean;

  ngOnInit() {
    this.isLoaded = true;
    this.src = this.user.profileImageURL;
  }

}
