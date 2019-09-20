import { Component, OnInit } from "@angular/core";
import { RegistrationService } from "src/app/home/registration/registration.service";
import { UserModel } from "src/app/models/UserModel";
import { LoginService } from 'src/app/home/login/login.service';

@Component({
  selector: "app-user-approve",
  templateUrl: "./user-approve.component.html",
  styleUrls: ["./user-approve.component.css"]
})
export class UserApproveComponent implements OnInit {
  constructor(private regger: RegistrationService,private logger: LoginService) {}

  users: UserModel[] = [];
  errMsg: String;
  user: UserModel;

  doSpin: Boolean = true;

  ngOnInit() {
    this.user = this.logger.getUser();
    this.regger.getNonapproved().subscribe(
      data => {
        this.doSpin = false;
        this.users = data;
      },
      err => {
        this.doSpin = false;
        this.errMsg = err.error;
      }
    );
  }

  regulate(user:UserModel,approve:Boolean){
    this.regger.approveUser(user.username,this.user.username,approve).subscribe(msg=>{
      this.users = this.users.filter(iter=>iter.username!=user.username);
    })
  }
}
