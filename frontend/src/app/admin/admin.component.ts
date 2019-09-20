import { Component, OnInit } from "@angular/core";
import { UserModel } from '../models/UserModel';
import { LoginService } from '../home/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  constructor(private logger: LoginService,private router:Router) {}
  user: UserModel;
  ngOnInit() {
    this.user = this.logger.getUser();
  }

  logout(){
    this.logger.setUser(null);
    this.router.navigate(['']);
  }

  goHome(){
    this.router.navigate(['administrator'])
  }
}
